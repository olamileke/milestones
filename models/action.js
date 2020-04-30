
const getDB = require('../utils/database').getDB;
const ObjectId = require('mongodb').ObjectId;

class Action {

	constructor(name, userId, created_at, action) {
		this.name = name;
		this.userId = userId;
		this.created_at = created_at;
		name.toLowerCase().includes('activity') ? this.activity = action : this.milestone = action;
	}

	save() {
		const db = getDB();
		return db.collection('actions').insertOne(this);
	}

	static getLastFour(userId) {
		const db = getDB();
		return db.collection('actions').find({ userId:new ObjectId(userId) }).sort({ created_at:-1 }).limit(4).toArray();
	}

	static getCount(userId) {
		const db = getDB();
		return db.collection('actions').find({ userId: new ObjectId(userId) }).count();
	}


	static deleteActivityActions(activityId) {
		const db = getDB();
		const id = new ObjectId(activityId);
		return db.collection('actions').deleteMany({ $or:[{ "activity._id":id }, { "milestone.activityId":id }] });
	}
}


module.exports = Action;