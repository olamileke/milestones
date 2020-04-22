const User = require('../models/user');

exports.getDashboard = (req, res, next) => {
	res.render('dashboard', {pageTitle:'Milestones', path:'/'})
}

exports.getCreate = (req, res, next) => {
	res.render('create', {pageTitle:"Milestones - Create", path:'/create'});
}
