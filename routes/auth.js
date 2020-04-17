const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/signup', authController.getSignup);

router.get('/login', authController.getLogin);

module.exports = router;