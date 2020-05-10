const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authGuard = require('../guards/guards').authGuard;

const milestonesController = require('../controllers/milestones');

router.post('/create/milestone/:activityId', authGuard , [body('description').isLength({ min:8 }),
											  body('image').custom((value, { req }) => {
											  	if(!req.file) {
											  		return Promise.reject('Milestone image required')
											  	}

											  	return true;
											  })] ,milestonesController.postNewMilestone);

router.post('/edit/milestone/:milestoneId', authGuard , body('description').isLength({ min:8 }), milestonesController.postEditMilestone);

router.post('/delete/milestone/:milestoneId', authGuard , milestonesController.postDeleteMilestone);

module.exports = router;