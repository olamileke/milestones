const Activity = require('../models/activity');
const Action = require('../models/action');
const errorsController = require('./errors');
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
		errorsController.throwError(err, next);
	})
}

exports.postEditMilestone = (req, res, next) => {

	const milestoneId = req.params.milestoneId;
	const description = req.body.description;
	let imageUrl = null;
	req.file ? imageUrl = req.file.path : '';

	Activity.editMilestone(req.session.currentActivity, milestoneId, description, imageUrl)
	.then(() => {

		return Action.updateMilestone(milestoneId, description, imageUrl);
	})
	.then(() => { 
		
		req.flash('message', {class:'success', message:'Milestone edited successfully'});
		res.back();  
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})
}

exports.postDeleteMilestone = (req, res, next) => {

	const milestoneId = req.params.milestoneId;

	Activity.deleteMilestone(req.session.currentActivity, milestoneId)
	.then(() => {
		req.flash('message', {class:'success', message:'Milestone deleted successfully'});
		res.back();
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})
}