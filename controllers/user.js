const User = require('../models/user');

exports.postChangeAvatar = (req, res, next) => {
	const path = req.file.path.replace(/\\/g, '/');
	
	User.updateAvatar(req.user._id, path)
	.then(result => {
		res.back();
	})
	.catch(err => {
		console.log(err);
	})

}