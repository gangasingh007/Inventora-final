const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const auth = require('../middleware/auth');
const cartController = require('../controllers/cart');

router.post('/', auth(['admin']), productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', auth(['admin']), productController.updateProduct);
router.delete('/:id', auth(['admin']), productController.deleteProduct);
router.delete('/clear', auth(['user']), cartController.clearCart);

module.exports = router;