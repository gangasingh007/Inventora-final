const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const auth = require('../middleware/auth');

router.get('/analytics', auth(['admin']), adminController.getDashboardAnalytics);
router.get('/orders', auth(['admin']), adminController.getAllOrders);
router.put('/orders/:id/status', auth(['admin']), adminController.updateOrderStatus);
router.get('/users', auth(['admin']), adminController.getUserAnalytics);

module.exports = router;