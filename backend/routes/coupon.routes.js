const express = require('express');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { createCoupon, applyCoupon } = require('../controllers/coupon.controller');
const router = express.Router();


router.post('/create', protect, isAdmin, createCoupon); // Admin only
router.post('/apply', protect, applyCoupon); // User applies

module.exports = router;
