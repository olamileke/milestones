const getDB = require('../utils/database').getDB;
const ObjectId = require('mongodb').ObjectId;

class Activity {
	constructor(name, link, description, imageUrl, created_at, userId) {
		this.name = name;
		this.link = link;
		this.description = description;
		this.imageUrl = imageUrl;
		this.created_at = created_at;
		this.userId = userId;
	}


	save() {
		const db = getDB();
		return db.collection('activities').insertOne(this);
	}


	static getAll() {
		const db = getDB();
		return db.collection('activities').find().toArray();
	}

	static getCount(userId) {
		const db = getDB();
		return db.collection('activities').find({ userId:new ObjectId(userId) }).count();
	}
}

module.exports = Activity;