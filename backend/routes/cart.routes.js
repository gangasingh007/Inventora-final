const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeItem,
  clearCart,
} = require('../controllers/cart.controller');
const { protect } = require('../middleware/authMiddleware');


router.use(protect); // all routes below are protected

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:productId', removeItem);
router.delete('/clear', clearCart);

module.exports = router;
