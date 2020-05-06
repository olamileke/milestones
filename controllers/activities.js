const User = require('../models/user');
const Activity = require('../models/activity');
const Action = require('../models/action');
const errorsController = require('./errors');
const { validationResult } = require('express-validator');

exports.getDashboard = (req, res, next) => {

	Action.getLastFour(req.user._id)
	.then(actions => {
		res.render('dashboard', {
		pageTitle:'Milestones',
		path:'/dashboard',
		actions:actions
		});
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})

}

exports.getCreateActivity = (req, res, next) => {
	const messages = req.flash('message');

	res.render('create', {
	pageTitle:"Milestones - Create",
	activity:null,
	path:'/create/activity',
	notification:messages[0]
	});
}

exports.postCreateActivity = (req, res, next) => {
	const errors = validationResult(req);

	if(!errors.isEmpty()) {
		req.flash('message', {class:'danger', message:'Invalid data entered'});
		return res.redirect('/create/activity');
	}

	const name = req.body.name;
	let link;
	req.body.link.length == 0 ? link = undefined : link = req.body.link;
	const imageUrl = req.file.path;
	const description = req.body.description;

	const activity = new Activity(name, link, description, imageUrl, Date.now() , req.user._id, []);
	activity.save()
	.then(result => {
		const action = new Action('Create Activity', req.user._id, Date.now() , result.ops[0]);
		action.save()
		.then(() => {
			req.flash('message', {class:'success', 'message':'Activity created successfully'});
			res.redirect('/create/activity');
		})
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})
}

exports.getActivities = (req, res, next) => {
	
	Activity.getAll(req.user._id)
	.then(activities => {
		res.render('activities', {
			pageTitle:'Activities',
			path:'/activities',
			activities:activities,
		});
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})
}

exports.getActivity = (req, res, next) => {

	const activityId = req.params.activityId;
	const messages = req.flash('message');

	Activity.findById(activityId)
	.then(activity => {
		if(!activity) {
			res.redirect('/dashboard');
		}

		if(activity.userId.toString() != req.user._id.toString()) {
			res.redirect('/dashboard');
		}

		req.session.currentActivity = activity;

		res.render('activity', {
		pageTitle:activity.name,
		path:'/activities',
		activity:activity,
		notification:messages[0]
		});
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})
}

exports.getEditActivity = (req, res, next) => {

	const activityId = req.params.activityId;
	const messages = req.flash('message');

	Activity.findById(activityId)
	.then(activity => {
		if(!activity) {
			res.redirect('/dashboard');
		}

		if(activity.userId.toString() != req.user._id.toString()) {
			res.redirect('/dashboard');
		}

		req.session.currentActivity = activity;

		res.render('create', {
		pageTitle:`Edit ${ activity.name }`,
		activity:activity,
		path:'/activities',
		page:'/edit/activity',
		notification:messages[0]
		});
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})
}

exports.postEditActivity = (req, res, next) => {
 
	const errors = validationResult(req);

	if(!errors.isEmpty()) {
		return res.back();
	}

	const currentActivity = req.session.currentActivity;
	currentActivity.name = req.body.name;
	currentActivity.link = req.body.link;
	req.file ? currentActivity.imageUrl = req.file.path : '';
	currentActivity.description = req.body.description;

	Activity.update(currentActivity)
	.then(() => {

		const action = new Action('Edit Activity', req.session.userId, Date.now(), currentActivity);
		return action.save();
	})
	.then(() => {
		
		return Action.updateActivity(currentActivity);
	})
	.then(() => {

		req.flash('message', {class:'success', message:'Updated successfully'});
		res.back();
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})
}

exports.postDeleteActivity = (req, res, next) => {

	const activityId = req.params.activityId;

	Activity.delete(req.session.currentActivity)
	.then(() => {

		return Action.deleteActivityActions(activityId);
	}) 
	.then(() => {
		res.redirect('/activities');
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})
}

exports.postCompleteActivity = (req, res, next) => {

	const activityId = req.params.activityId;
	const incomplete = req.query.incomplete;

	Activity.complete(activityId, incomplete)
	.then(() => {
		res.back();
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})
}

exports.getFileDownloads = (req, res, next) => {

	Activity.getAll(req.user._id)
	.then(activities => {

		res.render('file-download', {
		pageTitle:'Download',
		path:'/download',
		activities:activities
		});
	})
	.catch(err => {

		throwError(err, next);
	})
}
	