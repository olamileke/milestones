const path = require('path');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check'); 
const errorsController = require('./errors');
const User = require('../models/user');
const ejs = require('ejs');
const crypto = require('crypto');
const config = require('../utils/config');
const mailgun = require('mailgun-js')({ apiKey:config.API_KEY, domain: config.DOMAIN });

exports.getSignup = (req, res, next) => {
	const messages = req.flash('message');
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
	let hashedPassword, token;
 
	if(!errors.isEmpty()) {
		return res.render('auth/signup',{
		pageTitle:'Signup on Milestones',
		oldInput:{name:name, email:email, password:password}
		});
	}

	User.findByEmail(email)
	.then(result => {
		if(result) {
			req.flash('message', {class:'danger', message:'User exists with that email.'});
			req.flash('message', {name:name, email:email, password:password});
			return res.redirect('/signup');
		}

		return;
	})
	.then(() => {

		crypto.randomBytes(32, (err, buffer) => {
			if(err) {
				return err;
			}

			token = buffer.toString('hex');

			return bcrypt.hash(password, 12)
			.then(hashedPassword => {
				const avatar = config.s3_file_link + 'users/anon.png';
				const user =  new User(name, email, hashedPassword, avatar, token, Date.now());
				user.save()
				.then(() => {
					const mailTemplatePath = path.join('public', 'mail', 'activate.html');
					const mailData = { path:mailTemplatePath, subject:'Confirm your email',
									   name:user.name.split(' ')[1], token:token};
                    mail(mailData)
                    .then(() => {
                        req.flash('message', {class:'success', message:'Registration successful. Check your email'});
					    res.redirect('/signup');
                    })
					
				})
			})
		})
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})
}


async function mail(data) {

	const mail = {...config.mail};
	mail.subject = data.subject;
	ejs.renderFile(data.path, { 
		name:data.name,
		appRoot:config.appRoot,
		token:data.token, 
		expiry: data.expiry ? data.expiry : null 
	}, (err, str) => {

		mail.html = str;
		mailgun.messages().send(mail, (err, body) => {
			if(err) {
				throw err;
			}
		})
	})
}

exports.getLogin = (req, res, next) => {
	const messages = req.flash('message');
	console.log(messages);
	let oldInput = {email:'', password:''};

	if(messages.length > 0 && messages[0] == 'Invalid email or password') {
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
		console.log(errors);
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
			console.log('wrong user');
			return res.redirect('/login');
		}

		userId = user._id;
		bcrypt.compare(password, user.password)
		.then(passwordMatch => {
			if(!passwordMatch || user.activation_token) {
				req.flash('message', {class:'danger', message:'Invalid email or password'});
				req.flash('message', {email:email, password:password});
				console.log('wrong password');
				return res.redirect('/login'); 
			}

			req.session.regenerate(() => {
				req.session.userId = user._id;
				req.session.cookieExpiry = new Date().getTime() + (30 * 86400000);
				return res.redirect('/dashboard');
			})
		})
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})
}


exports.getLogout = (req, res, next) => {
	req.session.destroy(err => {
		if(err) {
			console.log(err);
		}
		
		res.redirect('/login');
	})
}

exports.getActivate = (req, res, next) => {

	const token = req.params.token;

	User.findByToken(token)
	.then(user => {
		if(!user) {
			req.flash('message', {class:'danger', message:'Invalid token'});
			return res.redirect('/login');
		}

		return user;
	})
	.then(result => {

		const user = new User(result.name, result.email, result.password, result.avatar, null, result.created_at, result._id);
		return user.save()
	})
	.then(() => {

		req.flash('message', {class:'success', message:'Account activated successfully'});
		res.redirect('/login');
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})
}

exports.getConfirmEmail = (req, res, next) => {

	const messages = req.flash('message');
	let notification = null;
	let oldInput = {email:''};

	if(messages.length > 0) {
		notification = messages[0];
	}

	if(messages.length  == 2) {
		oldInput = messages[1];
	}

	res.render('auth/confirm_email', { 
	pageTitle:'Confirm Email',
	notification:notification,
	oldInput:oldInput
	});
}

exports.postConfirmEmail = (req, res, next) => {

	const errors = validationResult(req);
	const email = req.body.email;

	if(!errors.isEmpty()) {

		return res.redirect('/confirm/email');
	}

	User.findByEmail(email)
	.then(user => {
		if(!user) {
			req.flash('message', {class:'danger', message:'User does not exist for that email'});
			req.flash('message', {email:email});
			return res.redirect('/confirm/email');
		}

		crypto.randomBytes(32, (err, buffer) => {
			if(err) {
				return err;
			}

			const token = buffer.toString('hex');
            const date = new Date(Date.now() + (30 * 60000));
            let minutes;
            String(date.getMinutes()).length == 1 ? minutes = '0' + String(date.getMinutes()) : minutes = String(date.getMinutes());
			const expiry = `${date.getHours()}:${minutes}`; 
			const mailTemplatePath = path.join('public', 'mail', 'reset.html');
			const mailData = { path:mailTemplatePath, subject:'Change your password',
						  	   name:user.name.split(' ')[1], token:token, expiry:expiry,
						       };

			User.createResetToken(user._id, token, date)
			.then(() => {
				mail(mailData);
				req.flash('message', {class:'success', message:'Check your email.'});
				res.redirect('/confirm/email');
			})

		})
	})
}

exports.getResetPassword = (req, res, next) => {

	const messages = req.flash('message');
	let notification = null;
	let oldInput = {email:''};

	if(messages.length > 0) {
		notification = messages[0];
	}

	if(messages.length  == 2) {
		oldInput = messages[1];
	}

	const token = req.params.token;

	User.findByResetToken(token)
	.then(reset => {
		if(!reset) {
			req.flash('message', {class:'danger', message:'Invalid reset token'});
			return res.redirect('/confirm/email');
		}

		if(Date.now() > reset.expiry) {
			return User.deleteResetToken(reset.userId)
			.then(() => {
				req.flash('message', {class:'danger', message:'Reset token has expired!'});
				res.redirect('/confirm/email');
			})
		}		

		res.render('auth/reset_password', {
		pageTitle:'Reset Password',
		notification:null,
		userId:reset.userId,
		token:token
		});
	})
}

exports.postResetPassword = (req, res, next) => {
	
	const errors = validationResult(req);
	const token = req.params.token;
	const userId = req.body.userId;
	const password = req.body.password;

	console.log(userId);

	if(!errors.isEmpty()) {
		res.redirect(`/password/reset/${token}`);
	}

	bcrypt.hash(password, 12)
	.then(hashedPassword => {
		return User.resetPassword(userId, hashedPassword);
	})
	.then(() => {
		req.flash('message', {class:'success', message:'Password changed successfully'});
		res.redirect('/login');
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})
}


