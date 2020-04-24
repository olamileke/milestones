const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/user/change-avatar', userController.postChangeAvatar);

module.exports = router;