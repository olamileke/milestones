
exports.getIndex = (req, res, next) => {
	res.render('index', {pageTitle:'Milestones'});
}