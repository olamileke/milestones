const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check'); 
const User = require('../models/user');

exports.getSignup = (req, res, next) => {
	const messages = req.flash('message');
	console.log(messages);
	let oldInput = {name:'', email:'', password:''};
	let notification;

	if(messages.length == 1) {
		notification = messages[0]
	}

	if(messages.length == 2) {
		oldInput = messages[1];
	}

	res.render('auth/signup', {
	pageTitle:'Signup on Milestones',
	oldInput:oldInput,
	notification:notification
    });
}

exports.postSignup = (req, res, next) => {
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;

	const errors = validationResult(req);

	if(!errors.isEmpty()) {
		return res.render('auth/signup',{
		pageTitle:'Signup on Milestones',
		oldInput:{name:name, email:email, password:password}
		});
	}

	User.findByEmail(email)
	.then(user => {
		if(user) {
			req.flash('message', {class:'danger', message:'User exists with that email.'});
			req.flash('message', {name:name, email:email, password:password});
			return res.redirect('/signup');
		}

		bcrypt.hash(password, 12)
		.then(hashedPassword => {
			const user =  new User(name, email, hashedPassword, undefined, false, Date.now());
			user.save()
			.then(() => {
				req.flash('message', {class:'success', message:'Registration successful. Check your email'});
				res.redirect('/signup');
			})
		})
	})
	.catch(err => {
		console.log(err);
	})
}

exports.getLogin = (req, res, next) => {
	const messages = req.flash('message');
	let oldInput = {email:'', password:''};

	if(messages.length > 0) {
		oldInput = messages[1];
	}
	res.render('auth/login',{
	pageTitle:'Login to Milestones',
	oldInput:oldInput,
	notification:messages[0]
	});
}

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	let userId;

	const errors = validationResult(req);

	if(!errors.isEmpty()) {
		return res.render('auth/login',{
		pageTitle:'Login to Milestones',
		oldInput:{email:email, password:password}
	  });
	}

	User.findByEmail(email)
	.then(user => {
		if(!user) {
			req.flash('message', {class:'danger', message:'Invalid email or password'});
			req.flash('message', {email:email, password:password});
			return res.redirect('/login');
		}

		userId = user._id;
		bcrypt.compare(password, user.password)
		.then(passwordMatch => {
			if(!passwordMatch) {
				req.flash('message', {class:'danger', message:'Invalid email or password'});
				req.flash('message', {email:email, password:password});
				return res.redirect('/login');
			}

			req.session.userId = userId;
			res.redirect('/');
		})
	})
	.catch(err => {
		console.log(err);
	})
}


