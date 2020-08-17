const User = require('../models/user');
const Activity = require('../models/activity');
const Action = require('../models/action');
const file = require('../utils/file');
const errorsController = require('./errors');
const { validationResult } = require('express-validator');

exports.getDashboard = (req, res, next) => {

    let activities;

    Activity.get(req.user._id, 2)
    .then(result => {
        activities = result;
        return Action.get(req.user._id, 0, 5);
    })
	.then(actions => {
		res.render('dashboard', {
		pageTitle:'Milestones',
        path:'/dashboard',
        activities:activities,
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
	const description = req.body.description;

    file.upload(req, res, next, 'activities', imageUrl => {

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
    })
	.catch(err => {
		errorsController.throwError(err, next);
	})
}

exports.getActivities = (req, res, next) => {
	
	Activity.get(req.user._id)
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
            const error = new Error('activity does not exist');
            error.statusCode = 404;
            throw error;
		}

		if(activity.userId.toString() != req.user._id.toString()) {
			return res.redirect('/dashboard');
		}

        activity = sortMilestones(activity);
        req.session.currentActivity = activity;
        let milestones = activity.milestones;
        let pages = 1;
        let page = 1;

        if(activity.milestones.length > 5) {
            page = req.query.page || 1;
            const start = (page - 1) * 5;
            const end = page * 5;
            milestones = [...activity.milestones].slice(start, end);
            pages = Math.ceil(activity.milestones.length/5);
        }

		res.render('activity', {
		pageTitle:`Milestones - ${activity.name}`,
		path:'/activities',
        activity:activity,
        milestones:milestones,
        activePage:page,
        pages:pages,
		notification:messages[0]
		});
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})
}

const sortMilestones = activity => {
	const milestones = [...activity.milestones];
	const sortedMilestones = milestones.sort((a,b) => {
		return b.created_at - a.created_at
	})

	activity.milestones = sortedMilestones;
	return activity;
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
    currentActivity.description = req.body.description;
    
    if(req.file) {
        return file.delete(currentActivity.imageUrl, next)
        .then(() => {
            file.upload(req, res, next, 'activities', imageUrl => {
                updateActivity(currentActivity, req, res, next, imageUrl)
            })
        })
    }

    updateActivity(currentActivity, req, res, next);
}

function updateActivity(currentActivity, req, res, next, imageUrl = null) {

    imageUrl ? currentActivity.imageUrl = imageUrl : '';
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
    
    return file.delete(req.session.currentActivity.imageUrl, next)
    .then(() => {
        Activity.delete(req.session.currentActivity, next)
        .then(() => {

            return Action.deleteActivityActions(activityId);
        }) 
        .then(() => {
            res.redirect('/activities');
        })
    })
	.catch(err => {
		errorsController.throwError(err, next);
	})
} 

exports.postCompleteActivity = (req, res, next) => {

	const incomplete = req.query.incomplete;

	Activity.complete(req.session.currentActivity, incomplete)
	.then(() => {
		res.back(); 
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})
}

exports.getMetrics = (req, res, next) => {

	const type = req.query.type;
	let num, displayType;

	switch(type) {
		case undefined:
			num = 7;
			displayType = 'last week';
			break;
		case '1week':
			num = 7;
			displayType = 'last week';
			break;
		case '2week':
			num = 14;
			displayType = 'last 2 weeks';
			break;
		case '1month':
			num = 30;
			displayType = 'last month';
			break;
		default:
			num = 7;
			displayType = 'last week';
			break;
	}

	const now = new Date().getTime();
	const date = now - (num * 86400000);
	let activitiesCreatedCount, chartData, achievedMilestonesCount, chartDataKeys;

	Activity.get(req.user._id)
	.then(activities => {
		activitiesCreatedCount = activities.filter(activity => activity.created_at >= date).length;
		[ chartData, achievedMilestonesCount ] = getMetricMilestones(activities, date);
		chartDataKeys = Object.keys(chartData);
		
		return Action.getCreatedInDateCount(req.user._id, date);
	})
	.then(actionsCreatedCount => {
		res.render('metrics', {
			pageTitle:'Metrics',
			path:'/metrics',
			actionsCreatedCount:actionsCreatedCount,
			activitiesCreatedCount:activitiesCreatedCount,
			achievedMilestonesCount:achievedMilestonesCount,
			chartData:chartData,
			chartDataKeys:chartDataKeys,
			displayType:displayType
		});
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})
}

const getMetricMilestones = (activities, date) => {
	const data = {};
	let achievedMilestonesCount = 0;

	activities.forEach(activity => {
		const count = activity.milestones.filter(milestone => milestone.created_at >= date).length;
		count > 0 ? data[activity.name.slice(0,8) + '...'] = count : '';
		achievedMilestonesCount += count;
	})

	return [ data, achievedMilestonesCount ];
}

exports.getFileDownloads = (req, res, next) => {

	Activity.get(req.user._id)
	.then(result => {

		const activities = result.filter(activity => activity.milestones.length > 0);

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

exports.postFileDownloads = (req, res, next) => {

    const activityId = req.body.activityId;

	Activity.findById(activityId) 
	.then(activity => {

		return file.download(activity, req, res, next);
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})
}

exports.getActions = (req, res, next) => {

	let start = 0;
	let limit = 8;
	let activePage = 1;
	const pageLimit = 8;
    const page = req.query.page;

	if(page && typeof(Number(page)) == 'number') {
		start = (page - 1) * pageLimit;
		limit = page * pageLimit;
		activePage = page;
    }

	Action.get(req.user._id, start, limit)
	.then(actions => {
		res.render('actions', {
		pageTitle:'Actions',
		path:'/dashboard',
		altPath:'/actions',
		actions:actions,
		pages:Math.ceil(res.locals.actionCount/pageLimit),
		activePage:activePage
		});
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})
}

exports.getMilestones = (req, res, next) => {
	
	let milestones = [];
	let activePage = 1;
	let limit = 8;
	let pageLimit = 8;
	let start = 0;
	const page = req.query.page;

	if(page && typeof(Number(page)) == 'number') {
		start = (page - 1) * pageLimit;
		limit = page * pageLimit;
		activePage = page;
	}

	Activity.get(req.user._id)
	.then(activities => {
		activities.forEach(activity => {
			milestones.push(...activity.milestones);
		})

		return milestones;
	})
	.then(milestones => {
		res.render('milestones', {
		pageTitle:'Milestones',
		path:'/dashboard',
		altPath:'/milestones',
		milestones:milestones.slice(start, limit),
		pages:Math.ceil(milestones.length/pageLimit),
		activePage:activePage
		})
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})
}