const express = require('express');
const router = express.Router();
const { getOverviewStats, getMonthlySales } = require('../controllers/analytics.controller');
const { isAdmin, protect } = require('../middleware/authMiddleware');


router.use(protect, isAdmin);

router.get('/overview', getOverviewStats);
router.get('/monthly-sales', getMonthlySales);

module.exports = router;
