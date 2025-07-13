const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { body, validationResult } = require('express-validator');

exports.addToCart = [
  body('productId').isMongoId(),
  body('quantity').isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity } = req.body;

    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }

      let cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        cart = new Cart({ user: req.user._id, items: [] });
      }

      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
];

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const total = await Cart.aggregate([
      { $match: { user: req.user._id } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: '$productInfo' },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$items.quantity', '$productInfo.price'] } },
        },
      },
    ]);

    res.status(200).json({ cart, total: total[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCartItem = [
  body('productId').isMongoId(),
  body('quantity').isInt({ min: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity } = req.body;

    try {
      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }

      if (quantity === 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        const product = await Product.findById(productId);
        if (!product || product.stock < quantity) {
          return res.status(400).json({ message: 'Insufficient stock' });
        }
        cart.items[itemIndex].quantity = quantity;
      }

      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
];

exports.removeFromCart = [
  body('productId').isMongoId(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId } = req.body;

    try {
      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      cart.items = cart.items.filter(item => item.product.toString() !== productId);
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
];

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    cart.items = [];
    await cart.save();
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};