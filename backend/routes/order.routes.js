const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders } = require('../controllers/order.controller');
const { protect } = require('../middleware/authMiddleware');


router.use(protect);

router.post('/place', placeOrder);
router.get('/my-orders', getMyOrders);

module.exports = router;
