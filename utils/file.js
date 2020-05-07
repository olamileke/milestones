const fs = require('fs');
const path = require('path');
const date = require('./date');
const PDFDocument = require('pdfkit');

exports.deleteFiles = paths => {

	paths.forEach(path => {
		
		fs.unlink(path, err => {

			if(err) {

				throw err;
			}
		})
	})
}


exports.download = (activity, req, res) => {

	const filename = req.user.name + '-' + activity.name + '.pdf';
	res.setHeader('Content-Disposition', 'attachment; filename="'+ filename + '"');
	const fontPath = path.join('fonts', 'Quicksand.ttf');

	const pdf = new PDFDocument();
	pdf.pipe(res);

	pdf.image(activity.imageUrl, 72, 72, {fit:[150, 150]});

	pdf.font(fontPath).fontSize(15).text(activity.name, 250, 75);

	pdf.moveDown(0.5);

	pdf.fontSize(12).text(activity.description, {
		lineGap:5
	});

	pdf.moveDown(0.25);

	pdf.text(`${activity.milestones.length} milestones. Created ${date.getDateString(activity.created_at)}`);

	let yCursor = 200;

	pdf.text('', 72, yCursor);

	activity.milestones.forEach(milestone => {

		pdf.image(milestone.imageUrl, { fit:[90, 90] });
		pdf.fontSize(12).text(milestone.description, 175, yCursor + 3)
		pdf.moveDown(0.4);
		pdf.fontSize(10).text(`${date.getDateString(milestone.created_at)}`);
		yCursor = yCursor + 75;
		pdf.text('', 72, yCursor);
	})	

	pdf.end();
}