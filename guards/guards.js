
exports.guestGuard = (req, res, next) => {
	if(req.session.userId) {
		return res.redirect('/dashboard');
	}

	next();
}

exports.authGuard = (req, res, next) => {
	if(!req.session.userId) {
		return res.redirect('/login');
	}

	next();
}