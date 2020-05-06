const fs = require('fs');

exports.deleteFiles = paths => {

	paths.forEach(path => {
		
		fs.unlink(path, err => {

			if(err) {

				throw err;
			}
		})
	})
}