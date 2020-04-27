const express = require('express');
const router = express.Router();
const activitiesController = require('../controllers/activities');
const authGuard = require('../guards/guards').authGuard;
const { body } = require('express-validator');

router.get('/dashboard', authGuard , activitiesController.getDashboard);

router.get('/create/activity', authGuard ,activitiesController.getCreateActivity);

router.post('/create/activity', [ body('name').isLength({ min:5 }),	
								  body('image').custom((value, { req }) => {
								  	if(!req.file.path) {
								  		return Promse.reject('select a valid image');
								  	} 

								  	return true;
								  }),
								  body('description').isLength({ min:10 }) ] ,activitiesController.postCreateActivity);

router.get('/activities', activitiesController.getActivities);

router.get('/activity/:activityId', activitiesController.getActivity);

module.exports = router; 