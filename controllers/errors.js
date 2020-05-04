
exports.get404 = (req, res, next) => {

	res.status(404).render('error', {pageTitle:'404'});
}

exports.throwError = (err, next) => {

	const error = new Error(err);
	error.httpStatusCode = 500;
	return next(error);
}