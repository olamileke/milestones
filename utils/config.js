const path = require('path');

exports.connectionString = " "

exports.secretString = " ";

exports.appRoot = 'http://localhost:4000/';

exports.API_KEY = " ";

exports.DOMAIN = " ";

exports.aws_access_key_id = " ";

exports.aws_secret_key = " ";

exports.aws_region = " ";

exports.aws_bucket_name = " ";

exports.s3_file_link = " ";

exports.mail = {
    from:'Milestones <admin@admin.milestones.org>',
    to:'',
    subject:'',
    html:'',
    inline:path.join(path.dirname(process.mainModule.filename), 'public', 'images', 'favicon', 'icon.png')
}; 