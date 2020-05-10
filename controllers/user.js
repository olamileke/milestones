const User = require('../models/user');
const errorsController = require('./errors');
const path = require('path');
const file = require('../utils/file');

exports.postChangeAvatar = (req, res, next) => {

	const user = new User(req.user.name, req.user.email, req.user.password, req.file.path,
	 req.user.activation_token, req.user.created_at, req.user._id);
	
	const defaultPath = path.join('images', 'users', 'anon.png');
	if(req.user.avatar != defaultPath) {
		file.deleteFiles([req.user.avatar]);
	}

	user.save()
	.then(result => {
		res.back();
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})

}