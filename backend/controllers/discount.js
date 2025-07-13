const Discount = require('../models/Discount');
const { body, validationResult } = require('express-validator');

exports.createDiscount = [
  body('code').trim().notEmpty(),
  body('percentage').isFloat({ min: 0, max: 100 }),
  body('expiresAt').isISO8601().toDate(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, percentage, expiresAt } = req.body;

    try {
      const existingDiscount = await Discount.findOne({ code });
      if (existingDiscount) {
        return res.status(400).json({ message: 'Discount code already exists' });
      }

      const discount = new Discount({
        code,
        percentage,
        expiresAt,
        createdBy: req.user._id,
      });
      await discount.save();
      res.status(201).json(discount);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
];

exports.getActiveDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find({ isActive: true, expiresAt: { $gt: new Date() } });
    res.status(200).json(discounts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deactivateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }
    if (discount.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    discount.isActive = false;
    await discount.save();
    res.status(200).json({ message: 'Discount deactivated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};