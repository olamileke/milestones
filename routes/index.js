const express = require('express');
const router = express.Router();
const guestGuard = require('../guards/guards').guestGuard;

const indexController = require('../controllers/index');

router.get('/', guestGuard , indexController.getIndex);

module.exports = router;