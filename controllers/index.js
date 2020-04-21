
exports.getIndex = (req, res, next) => {
	if(req.session.userId) {
		res.render('auth-index', {pageTitle:'Milestones'});
	}
	else {
		res.render('index', {pageTitle:'Milestones'});
	}
}