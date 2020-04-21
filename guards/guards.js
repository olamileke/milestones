
exports.guestGuard = (req, res, next) => {
	if(req.session.userId) {
		return res.redirect('/');
	}

	next();
}

exports.authGuard = (req, res, next) => {
	if(!req.session.userId) {
		return res.redirect('/');
	}

	next();
}