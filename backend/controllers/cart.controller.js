const Cart = require('../models/cart.model');

// Get user's cart
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.json({ items: [] });
  res.json(cart);
};

// Add item to cart
exports.addToCart = async (req, res) => {
  const { productId, name, price, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex > -1) {
    // update quantity
    cart.items[itemIndex].quantity += quantity;
  } else {
    // add new item
    cart.items.push({ productId, name, price, quantity });
  }

  await cart.save();
  res.status(200).json(cart);
};

// Update quantity
exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.find(
    (i) => i.productId.toString() === productId
  );

  if (item) {
    item.quantity = quantity;
    await cart.save();
    return res.json(cart);
  } else {
    return res.status(404).json({ message: 'Item not found' });
  }
};

// Remove item
exports.removeItem = async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await cart.save();
  res.json(cart);
};

// Clear cart
exports.clearCart = async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.json({ message: 'Cart cleared' });
};
