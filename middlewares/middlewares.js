const User = require('../models/user');
const Activity = require('../models/activity');
const Action = require('../models/action');
const errorController = require('../controllers/errors');
const multer = require('multer');
const path = require('path');

exports.fileFilter = (req, file, cb) => {

	const mimeType = file.mimetype.toLowerCase();

	if(mimeType == 'image/png' || mimeType == 'image/jpg' || mimeType == 'image/jpeg') {
		return cb(null, true);
	}

	return cb(null, false);
}

exports.fileStorage = multer.diskStorage({

	destination:(req, file, cb) => {

		const url = req.url;

		if(url.includes('avatar')) {
			cb(null, path.join('images','users'));
		}

		if(url.includes('activity')) {
			cb(null, path.join('images','activities'));
		}

		if(url.includes('milestone')) {
			cb(null, path.join('images','milestones'));
		}
	},

	filename:(req, file, cb) => {
		cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);		
	}
})

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