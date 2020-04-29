const User = require('../models/user');
const Activity = require('../models/activity');
const Action = require('../models/action');
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
		console.log(err);
	})

}

exports.getCreateActivity = (req, res, next) => {
	const messages = req.flash('message');

	res.render('create', {
	pageTitle:"Milestones - Create",
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
		console.log(err);
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
		console.log(err);
	})
}

exports.getActivity = (req, res, next) => {
	const activityId = req.params.activityId;

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
		activity:activity
		});
	})
}
