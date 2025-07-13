const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Discount = require('../models/Discount');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

exports.createOrder = [
  body('isEcoFriendly').isBoolean(),
  body('discountCode').optional().trim(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { isEcoFriendly, discountCode } = req.body;
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // Fetch cart
      const cart = await Cart.findOne({ user: req.user._id }).populate('items.product').session(session);
      if (!cart || !cart.items.length) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'Cart is empty' });
      }

      // Validate stock
      for (const item of cart.items) {
        if (item.quantity > item.product.stock) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({ message: `Insufficient stock for ${item.product.name}` });
        }
      }

      // Calculate total
      let total = cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
      let discount = null;
      let finalTotal = total;

      // Apply discount if provided
      if (discountCode) {
        discount = await Discount.findOne({
          code: discountCode,
          isActive: true,
          expiresAt: { $gt: new Date() },
        }).session(session);
        if (discount) {
          finalTotal = total * (1 - discount.percentage / 100);
        } else {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({ message: 'Invalid or expired discount code' });
        }
      }

      // Create order
      const order = new Order({
        user: req.user._id,
        items: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        total,
        discountApplied: discount ? discount._id : null,
        finalTotal,
        isEcoFriendly,
      });

      // Update stock
      for (const item of cart.items) {
        await Product.findByIdAndUpdate(
          item.product._id,
          { $inc: { stock: -item.quantity } },
          { session }
        );
      }

      // Clear cart
      cart.items = [];
      await cart.save({ session });

      // Update eco-friendly order count and issue coupons
      if (isEcoFriendly) {
        const user = await User.findById(req.user._id).session(session);
        user.ecoFriendlyOrders += 1;

        // Generate coupons at 5 and 10 eco-friendly orders
        if (user.ecoFriendlyOrders === 5 || user.ecoFriendlyOrders === 10) {
          const couponCode = `ECO${user.ecoFriendlyOrders}_${Date.now()}`;
          user.coupons.push(couponCode);
          await Discount.create(
            [
              {
                code: couponCode,
                percentage: user.ecoFriendlyOrders === 5 ? 10 : 20, // 10% for 5 orders, 20% for 10
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
                createdBy: req.user._id,
              },
            ],
            { session }
          );
        }
        await user.save({ session });
      }

      await order.save({ session });
      await session.commitTransaction();
      session.endSession();

      res.status(201).json(order);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: 'Server error' });
    }
  }
];

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product discountApplied');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};