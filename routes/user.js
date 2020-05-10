const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authGuard = require('../guards/guards').authGuard;

router.post('/user/change-avatar', authGuard , userController.postChangeAvatar);

module.exports = router;