const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

exports.getDashboardAnalytics = async (req, res) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

    // Total Sales
    const totalSales = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$finalTotal' } } },
    ]);

    // Sales Over Time (Daily)
    const salesOverTime = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate }, status: 'completed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$finalTotal' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Order Count
    const orderCount = await Order.countDocuments({ createdAt: { $gte: startDate, $lte: endDate }, status: 'completed' });

    // User Count
    const userCount = await User.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } });

    // Top Products by Sales
    const topProducts = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate }, status: 'completed' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
    ]);

    // Eco-Friendly Orders
    const ecoFriendlyOrders = await Order.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      isEcoFriendly: true,
      status: 'completed',
    });

    res.status(200).json({
      totalSales: totalSales[0]?.total || 0,
      salesOverTime,
      orderCount,
      userCount,
      topProducts,
      ecoFriendlyOrders,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .populate('discountApplied', 'code percentage');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = [
  body('status').isIn(['pending', 'completed', 'cancelled']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      order.status = req.body.status;
      await order.save();
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
];
exports.getUserAnalytics = async (req, res) => {
  try {
    const topEcoUsers = await User.aggregate([
      { $match: { ecoFriendlyOrders: { $gt: 0 } } },
      {
        $project: {
          name: 1,
          email: 1,
          ecoFriendlyOrders: 1,
        },
      },
      { $sort: { ecoFriendlyOrders: -1 } },
      { $limit: 5 },
    ]);
    res.status(200).json(topEcoUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};