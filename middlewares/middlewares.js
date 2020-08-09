const User = require('../models/user');
const Activity = require('../models/activity');
const Action = require('../models/action');
const errorController = require('../controllers/errors');

exports.fileFilter = (req, file, cb) => {

	const mimeType = file.mimetype.toLowerCase();

	if(mimeType == 'image/png' || mimeType == 'image/jpg' || mimeType == 'image/jpeg') {
		return cb(null, true);
	}

	return cb(null, false);
}

exports.checkSessionExpiry = (req, res, next) => {

	if(new Date().getTime() >= req.session.cookieExpiry) {

		req.session.regenerate(() => {
			
			req.flash('message', {class:'danger', message:'Your session has expired'});
			return res.redirect('/login');
		})
	}

	next();
}

exports.setUser = (req, res, next) => {

	if(req.session.userId) {
		User.findById(req.session.userId)
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => {
			errorsController.throwError(err, next);
		})
	}
	else {
		next();
	}
}

exports.fetchData = (req, res, next) => {

	res.locals.csrfToken = req.csrfToken();
	res.locals.page = null;
	res.locals.altPath = null;

	if(req.session.userId) {
		res.locals.user = req.user;

		Activity.getStats(req.session.userId)
		.then(stats => {
			res.locals.activityCount = stats.activities.length;
			res.locals.completedActivityCount = stats.completed;
			res.locals.uncompletedActivityCount = stats.uncompleted;

			res.locals.milestonesCount = 0;
			stats.activities.forEach(activity => {
				res.locals.milestonesCount += activity.milestones.length;
			})
			return;
		})
		.then(() => {

			Action.getCount(req.session.userId)
			.then(result => {
				res.locals.actionCount = result;
				next();
			})
		})
		.catch(err => {
			errorsController.throwError(err, next);
		})
	} else {
		next();
	}
}