const config = require('./config');
const AWS = require('aws-sdk');
const path = require('path');
const date = require('./date');
const PDFDocument = require('pdfkit');
const request = require('request');
const errorController = require('../controllers/errors');

const s3bucket = new AWS.S3({
    accessKeyId:config.aws_access_key_id,
    secretAccessKey:config.aws_secret_key,
    region:config.aws_region
})


exports.upload = async function upload(req, res, next, folder, cb) {
    const file = req.file;
    const s3FileUrl = config.s3_file_link;
    const fileName = new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;

    const fileParams = {
        Bucket:config.aws_bucket_name,
        Key:folder + '/' + fileName,
        Body:file.buffer,
        ContentType:file.mimetype,
        ACL:"public-read"
    };

    s3bucket.upload(fileParams, function(err, data) {
        if(err) {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
            return;
        }

        const imageUrl = s3FileUrl + folder + '/' + fileName;
        return cb(imageUrl);
    })
}

exports.delete = async function deleteImage(filePath, next) {
    const fileParams = {
        Bucket:config.aws_bucket_name,
        Key:filePath.split(config.s3_file_link)[1]
    }

    s3bucket.deleteObject(fileParams, (err, data) => {
        if(err) {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        }

        return;
    })
}

exports.download = async function download(activity, req, res, next) {

	const filename = req.user.name.toLowerCase().replace(' ', '_') + '_' + activity.name.toLowerCase().replace(' ', '_') + '.pdf';
	res.setHeader('Content-Disposition', 'attachment; filename="'+ filename + '"');
    const fontPath = path.join('fonts', 'Quicksand.ttf');
    const pdf = new PDFDocument();
    pdf.pipe(res);

    await request({ url:activity.imageUrl, encoding:null }, (error, response, body) => {
        
        if(response.statusCode == 200) {
            const image = new Buffer(body, 'base64');
            pdf.image(image, 72, 72, {fit:[150, 150]});
            
            pdf.font(fontPath).fontSize(15).text(activity.name, 240, 75);
            pdf.moveDown(0.5);
            pdf.fontSize(12).text(activity.description);
            pdf.moveDown(0.25);
            pdf.text(`${activity.milestones.length} milestones. Created ${date.getDateString(activity.created_at)}`);
            let yCursor = 200;
            pdf.text('', 72, yCursor);
            
            addMilestones(pdf, activity, yCursor)
            .then(() => {
                pdf.end();
            })
        }
    })
}

async function addMilestones(pdf, activity, yCursor) {

    return new Promise(async function(resolve, reject) {

        let count = 0;

        for(let i=0; i < activity.milestones.length; i++) {

            let yC = yCursor + (i * 75);
            const milestone = activity.milestones[i];
            await request({ url: milestone.imageUrl, encoding: null }, (error, response, body) => {
                
                if (response.statusCode == 200) {
                    const milestoneImage = new Buffer(body, 'base64');
                    pdf.image(milestoneImage, { fit: [90, 90] });
                    pdf.fontSize(12).text(milestone.description, 180, yC);
                    pdf.moveDown(0.4);
                    pdf.fontSize(10).text(`${date.getDateString(milestone.created_at)}`);
                    pdf.text('', 72, yC);
                    count++;

                    if(count == activity.milestones.length) {
                        resolve('completed');
                    }
                }
            })
        }
    })
}
