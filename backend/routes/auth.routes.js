const express = require('express');
const { signup, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();



router.get('/me', protect, getMe);
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
