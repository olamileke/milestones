const path = require('path');

exports.connectionString = "mongodb+srv://olamileke:Arsenalfc1886@milestones-cluster-2hezc.mongodb.net/milestones?retryWrites=true&w=majority"

exports.secretString = "yWkKdUHeKGQGDA2JEK3BTMHZJZFuncJL";

exports.appRoot = 'http://localhost:4000/';

exports.API_KEY = "key-618e6125c452b712ee91e57f028fbd0f";

exports.DOMAIN = "sandboxb3e06f45528541edbc677fe253ca0c00.mailgun.org";

exports.aws_access_key_id = "AKIAWQHYH6CU7J76DLG2";

exports.aws_secret_key = "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";

exports.aws_region = "us-east-2";

exports.aws_bucket_name = "themilestonesbucket";

exports.s3_file_link = "https://s3-us-east-2.amazonaws.com/themilestonesbucket/";

exports.mail = {
    from:'Milestones <me@samples.milestones.org>',
    to:'olamileke.dev@gmail.com',
    subject:'',
    html:'',
    inline:path.join(path.dirname(process.mainModule.filename), 'public', 'images', 'favicon', 'icon.png')
}; 