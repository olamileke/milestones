const Activity = require('../models/activity');
const Action = require('../models/action');
const { validationResult } = require('express-validator');

exports.postNewMilestone = (req, res, next) => {

	const errors = validationResult(req);
	console.log(errors);
	
	if(!errors.isEmpty()) {
		return res.back();
	}

	const description = req.body.description;
	const imageUrl = req.file.path;

	Activity.addMilestone(req.session.currentActivity, description, imageUrl, req.session.userId)
	.then(() => {

		res.back();
	})
	.catch(err => {
		console.log(err);
	})
}