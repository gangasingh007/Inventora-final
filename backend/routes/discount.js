const  express = require('express');
const router = express.Router();
const discountController = require('../controllers/discount');
const auth = require('../middleware/auth');

router.post('/', auth(['admin']), discountController.createDiscount);
router.get('/', discountController.getActiveDiscounts);
router.put('/:id/deactivate', auth(['admin']), discountController.deactivateDiscount);

module.exports = router;