const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const connString = require('./config').connectionString;
let _db;

const mongoConnect = callback => {
	mongoClient.connect(connString)
	.then(client => {
		_db = client.db();
		callback();
	})
	.catch(err => {
		console.log(err);
		throw err;
	}) 
}

const getDB = () => {
	if(_db) {
		return _db;
	}
	throw 'No database connection';
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;

