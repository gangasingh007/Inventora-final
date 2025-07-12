const Coupon = require('../models/coupon.model');

// Admin: Create coupon
exports.createCoupon = async (req, res) => {
  const { code, discountPercent, expiresAt, gift = false } = req.body;

  try {
    const existing = await Coupon.findOne({ code });
    if (existing) return res.status(400).json({ message: 'Code already exists' });

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountPercent,
      expiresAt,
      gift,
      createdBy: req.user._id,
    });

    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create coupon', error: err.message });
  }
};

// User: Apply coupon to cart
exports.applyCoupon = async (req, res) => {
  const { code } = req.body;
  try {
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      expiresAt: { $gt: new Date() },
    });

    if (!coupon) return res.status(404).json({ message: 'Invalid or expired code' });

    res.json({ discountPercent: coupon.discountPercent });
  } catch (err) {
    res.status(500).json({ message: 'Failed to apply coupon', error: err.message });
  }
};

// Auto: Generate gift coupon after 10 eco-orders
exports.generateGiftCoupon = async (user) => {
  const giftCode = `ECOGIFT${Date.now().toString().slice(-5)}`;

  const coupon = new Coupon({
    code: giftCode,
    discountPercent: 15,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    gift: true,
    createdBy: user._id,
  });

  await coupon.save();

  return coupon.code;
};
