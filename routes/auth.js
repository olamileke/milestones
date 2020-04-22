const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const guards = require('../guards/guards');
const { body } = require('express-validator/check');

router.get('/signup', guards.guestGuard , authController.getSignup);

router.post('/signup',[body('name')
					   .isLength({ min:5 })
					   .custom((value, { req }) => {
					   		let [fname, lname] = value.split(' ');
					   		if(!lname) {
					   			return Promise.reject('First and last name required');
					   		}
					   		fname = fname.charAt(0).toUpperCase() + fname.slice(1,).toLowerCase();
					   		lname = lname.charAt(0).toUpperCase() + lname.slice(1,).toLowerCase();
					   		req.body.name = fname + ' ' + lname;
					   		return true;
					   })
					   ,
					   body('email').isEmail(),
					   body('password').isLength({ min:8 })], authController.postSignup);

router.get('/login', guards.guestGuard, authController.getLogin);

router.post('/login', [body('email').isEmail(),
					  body('password').isLength({ min:8 })], authController.postLogin);

router.get('/logout', guards.authGuard , authController.getLogout);

module.exports = router;