const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const milestonesController = require('../controllers/milestones');

router.post('/create/milestone/:activityId', [body('description').isLength({ min:8 }),
											  body('image').custom((value, { req }) => {
											  	if(!req.file) {
											  		return Promise.reject('Milestone image required')
											  	}

											  	return true;
											  })] ,milestonesController.postNewMilestone);

module.exports = router;