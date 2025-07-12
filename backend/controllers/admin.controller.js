const User = require('../models/user.model');
const Order = require('../models/order.model');
const Coupon = require('../models/coupon.model');

// Get all users
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

// Delete user
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.userId);
  res.json({ message: 'User deleted' });
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email');
  res.json(orders);
};

// Delete order
exports.deleteOrder = async (req, res) => {
  await Order.findByIdAndDelete(req.params.orderId);
  res.json({ message: 'Order deleted' });
};

// Get all coupons
exports.getAllCoupons = async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
};

// Delete coupon
exports.deleteCoupon = async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.couponId);
  res.json({ message: 'Coupon deleted' });
};
