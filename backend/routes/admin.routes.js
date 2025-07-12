const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllOrders,
  deleteOrder,
  getAllCoupons,
  deleteCoupon,
} = require('../controllers/admin.controller');
const { protect, isAdmin } = require('../middleware/authMiddleware');


router.use(protect, isAdmin);

// User management
router.get('/users', getAllUsers);
router.delete('/users/:userId', deleteUser);

// Order management
router.get('/orders', getAllOrders);
router.delete('/orders/:orderId', deleteOrder);

// Coupon management
router.get('/coupons', getAllCoupons);
router.delete('/coupons/:couponId', deleteCoupon);

module.exports = router;
