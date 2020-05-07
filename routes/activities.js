const express = require('express');
const router = express.Router();
const activitiesController = require('../controllers/activities');
const authGuard = require('../guards/guards').authGuard;
const { body } = require('express-validator');

router.get('/dashboard', authGuard , activitiesController.getDashboard);

router.get('/create/activity', authGuard ,activitiesController.getCreateActivity);

router.post('/create/activity', [ body('name').isLength({ min:5 }),	
								  body('link').optional().isURL(),
								  body('image').custom((value, { req }) => {
								  	if(!req.file.path) {
								  		return Promse.reject('select a valid image');
								  	} 

								  	return true;
								  }),
								  body('description').isLength({ min:10 }) ] ,activitiesController.postCreateActivity);

router.get('/activities', activitiesController.getActivities);

router.get('/activity/:activityId', activitiesController.getActivity);

router.get('/edit/activity/:activityId', activitiesController.getEditActivity);

router.post('/edit/activity/:activityId', [ body('name').isLength({ min:5 }),
											body('description').isLength({ min:10 })], activitiesController.postEditActivity);

router.post('/delete/activity/:activityId', activitiesController.postDeleteActivity);

router.post('/complete/activity/:activityId', activitiesController.postCompleteActivity);

router.get('/download', activitiesController.getFileDownloads);

router.post('/download', activitiesController.postFileDownloads);

module.exports = router; 