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

router.get('/activities', authGuard , activitiesController.getActivities);

router.get('/activity/:activityId', authGuard , activitiesController.getActivity);

router.get('/edit/activity/:activityId', authGuard , activitiesController.getEditActivity);

router.post('/edit/activity/:activityId', authGuard , [ body('name').isLength({ min:5 }),
											body('description').isLength({ min:10 })], activitiesController.postEditActivity);

router.post('/delete/activity/:activityId', authGuard , activitiesController.postDeleteActivity);

router.post('/complete/activity/:activityId', authGuard , activitiesController.postCompleteActivity);

router.get('/metrics', authGuard, activitiesController.getMetrics);

router.get('/download', authGuard , activitiesController.getFileDownloads);

router.post('/download', authGuard , activitiesController.postFileDownloads);

router.get('/actions', authGuard, activitiesController.getActions);

router.get('/milestones', authGuard, activitiesController.getMilestones);

module.exports = router; 