const User = require('../models/user');

exports.postChangeAvatar = (req, res, next) => {
	User.updateAvatar(req.user._id, req.file.path)
	.then(result => {
		res.back();
	})
	.catch(err => {
		console.log(err);
	})

}