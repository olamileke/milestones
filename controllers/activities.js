const User = require('../models/user');
const Activity = require('../models/activity');

exports.getDashboard = (req, res, next) => {
	res.render('dashboard', {pageTitle:'Milestones', path:'/'})
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
	const name = req.body.name;
	let link;
	req.body.link.length == 0 ? link = undefined : link = req.body.link;
	const imageUrl = req.file.path;
	const description = req.body.description;

	const activity = new Activity(name, link, description, imageUrl, Date.now(), req.user._id);
	activity.save()
	.then(() => {
		req.flash('message', {class:'success', 'message':'Activity created successfully'});
		res.redirect('/create');
	})
	.catch(err => {
		console.log(err);
	})
}
