const express = require('express');
const router = express.Router();
const activitiesController = require('../controllers/activities');
const authGuard = require('../guards/guards').authGuard;

router.get('/dashboard', authGuard , activitiesController.getDashboard);

router.get('/create/activity', authGuard ,activitiesController.getCreateActivity);

router.post('/create/activity', activitiesController.postCreateActivity);

module.exports = router; 