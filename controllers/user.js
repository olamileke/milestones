const User = require('../models/user');
const errorsController = require('./errors');

exports.postChangeAvatar = (req, res, next) => {

	const user = new User(req.user.name, req.user.email, req.user.password, req.file.path,
	 req.user.activation_token, req.user.created_at, req.user._id);

	user.save()
	.then(result => {
		res.back();
	})
	.catch(err => {
		errorsController.throwError(err, next);
	})

}