const Product = require('../models/Product');
const { body, validationResult } = require('express-validator');

exports.createProduct = [
  body('name').trim().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('stock').isInt({ min: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, stock, imageUrl } = req.body;

    try {
      const product = new Product({
        name,
        description,
        price,
        stock,
        imageUrl,
        createdBy: req.user._id,
      });
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
];

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('createdBy', 'name email');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name email');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProduct = [
  body('name').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      if (product.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      Object.assign(product, req.body);
      await product.save();
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
];

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await product.remove();
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};