const User = require('../models/user');
const errorsController = require('./errors');
const file = require('../utils/file');
const config = require('../utils/config');

exports.postChangeAvatar = (req, res, next) => {
	
	const defaultAvatar = config.s3_file_link + 'users/anon.png';
	if(req.user.avatar != defaultAvatar) {
		file.delete(req.user.avatar, next)
	}

    file.upload(req, res, next, 'users', avatar => {
        const user = new User(req.user.name, req.user.email, req.user.password, avatar,
        req.user.activation_token, req.user.created_at, req.user._id);

        user.save()
        .then(result => {
            res.back();
        })
    })
    .catch(err => {
        errorsController.throwError(err, next);
    })

}