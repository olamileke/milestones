const Activity = require('../models/activity');
const Action = require('../models/action');
const errorsController = require('./errors');
const { validationResult } = require('express-validator');
const file = require('../utils/file');
const { updateActivity } = require('../models/action');

exports.postNewMilestone = (req, res, next) => {

	const errors = validationResult(req);
	console.log(errors);
	
	if(!errors.isEmpty()) {
		return res.back();
	}

	const description = req.body.description;
    
    file.upload(req, res, next, 'milestones', imageUrl => {
        Activity.addMilestone(req.session.currentActivity, description, imageUrl, req.session.userId)
        .then(() => {

            res.back();
        })
    })
	.catch(err => {
		errorsController.throwError(err, next);
	})
}

exports.postEditMilestone = (req, res, next) => {

	const milestoneId = req.params.milestoneId;
    const description = req.body.description;
    
	const activity = {...req.session.currentActivity};
    const idx = activity.milestones.findIndex(milestone => milestone._id.toString() == milestoneId.toString());
    activity.milestones[idx].description = description;
    
    if(req.file) {
        return file.delete(activity.milestones[idx].imageUrl, next)
        .then(() => {
            file.upload(req, res, next, 'milestones', imageUrl => {
                activity.milestones[idx].imageUrl = imageUrl;
                return updateMilestone(req, res, activity, idx);
            })
        })
        .catch(err => {
            errorsController.throwError(err, next);
        })
    }

    updateMilestone(req, res, activity, idx);
}

function updateMilestone(req, res, activity, idx) {

    Activity.editMilestone(activity, idx)
	.then(() => {
        const updatedMilestone = activity.milestones[idx];
		return Action.updateMilestone(updatedMilestone._id, updatedMilestone.description, updatedMilestone.imageUrl);
	})
	.then(() => { 
		
		req.flash('message', {class:'success', message:'Milestone edited successfully'});
		res.back();  
    })
}

exports.postDeleteMilestone = (req, res, next) => {

    const milestoneId = req.params.milestoneId;
    const currentActivity = req.session.currentActivity;
    const milestone = currentActivity.milestones.filter(milestone => milestone._id.toString() == milestoneId.toString())[0]

    file.delete(milestone.imageUrl, next)
    .then(() => {
        Activity.deleteMilestone(currentActivity, milestoneId)
        .then(() => {
            req.flash('message', {class:'success', message:'Milestone deleted successfully'});
            res.back();
        })
    })
	.catch(err => {
		errorsController.throwError(err, next);
	})
}