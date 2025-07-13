const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

exports.signup = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    try {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      const admin = new Admin({ email, password, name });
      await admin.save();

      const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.status(201).json({ token, admin: { id: admin._id, email, name, role: admin.role } });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
];

exports.signin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const admin = await Admin.findOne({ email });
      if (!admin || !(await admin.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.status(200).json({ token, admin: { id: admin._id, email, name: admin.name, role: admin.role } });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
];