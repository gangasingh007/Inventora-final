const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const User = require('../models/user.model');
const Coupon = require('../models/coupon.model');
const { generateGiftCoupon } = require('./coupon.controller');

exports.placeOrder = async (req, res) => {
  const { ecoDelivery = false, couponCode = null } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let discountPercent = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        expiresAt: { $gt: new Date() },
      });
      if (!coupon) return res.status(400).json({ message: 'Invalid or expired coupon' });
      discountPercent = coupon.discountPercent;
    }

    // Calculate total
    const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discountAmount = (subtotal * discountPercent) / 100;
    const totalAmount = subtotal - discountAmount;

    const order = await Order.create({
      user: req.user._id,
      items: cart.items,
      totalAmount,
      discountPercent,
      ecoDelivery,
      appliedCoupon: couponCode || null,
    });

    // Update eco order count
    if (ecoDelivery) {
      req.user.ecoOrders += 1;

      // Generate gift coupon if ecoOrders >= 10
      if (req.user.ecoOrders >= 10) {
        const giftCode = await generateGiftCoupon(req.user);
        req.user.ecoOrders = 0; // reset
        await req.user.save();
        return res.status(201).json({
          order,
          message: `Eco reward unlocked! 🎁 Gift coupon: ${giftCode}`,
        });
      }

      await req.user.save();
    }

    // Clear cart
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Order failed', error: err.message });
  }
};

// Get all user orders
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};
