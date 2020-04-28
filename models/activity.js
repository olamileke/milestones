const getDB = require('../utils/database').getDB;
const ObjectId = require('mongodb').ObjectId;

class Activity {
	constructor(name, link, description, imageUrl, created_at, userId, milestones) {
		this.name = name;
		this.link = link;
		this.description = description;
		this.imageUrl = imageUrl;
		this.created_at = created_at;
		this.userId = userId;
		this.milestones = milestones;
	}


	save() {
		const db = getDB();
		return db.collection('activities').insertOne(this);
	}


	static getAll(userId) {
		const db = getDB();
		return db.collection('activities').find({ userId:new ObjectId(userId) }).toArray();
	}


	static findById(id) {
		const db = getDB();
		return db.collection('activities').findOne({ _id:new ObjectId(id) });
	}

	static getMilestonesCount(activities) {

		let num;

		activities.forEach(activity => {

			num = num + activity.milestones.length;
		})

		return num;
	}
}

module.exports = Activity;