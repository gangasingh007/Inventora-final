const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const auth = require('../middleware/auth');

router.post('/', auth(['user']), orderController.createOrder);
router.get('/', auth(['user']), orderController.getUserOrders);

module.exports = router;