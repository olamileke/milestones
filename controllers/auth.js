
exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {pageTitle:'Signup on Milestones'})
}

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {pageTitle:'Login to Milestones'})
}

