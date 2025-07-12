const Order = require('../models/order.model');

// GET /api/admin/dashboard/overview
exports.getOverviewStats = async (req, res) => {
  try {
    const orders = await Order.find();

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;
    const ecoOrders = orders.filter((o) => o.ecoDelivery).length;

    const statusCount = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalRevenue,
      totalOrders,
      ecoOrders,
      statusCount,
    });
  } catch (err) {
    res.status(500).json({ message: 'Dashboard error', error: err.message });
  }
};

// GET /api/admin/dashboard/monthly-sales
exports.getMonthlySales = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ];

    const monthlyData = await Order.aggregate(pipeline);

    res.json(monthlyData);
  } catch (err) {
    res.status(500).json({ message: 'Monthly stats error', error: err.message });
  }
};
