const express = require('express');
const router = express.Router();
const userAuth = require('../controllers/userAuth');
const adminAuth = require('../controllers/adminAuth');

router.post('/user/signup', userAuth.signup);
router.post('/user/signin', userAuth.signin);
router.post('/admin/signup', adminAuth.signup);
router.post('/admin/signin', adminAuth.signin);

module.exports = router;