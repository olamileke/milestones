const getDB = require('../utils/database').getDB;
const ObjectId = require('mongodb').ObjectId;
const Action = require('./action');

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
		return db.collection('activities').find({ userId:new ObjectId(userId) }).sort({ created_at:-1 }).toArray();
	}


	static findById(id) {

		const db = getDB();
		return db.collection('activities').findOne({ _id:new ObjectId(id) });
	}


	static update(activity) {

		const db = getDB();
		return db.collection('activities').updateOne({ _id:new ObjectId(activity._id) }, { $set:activity });
	}


	static delete(activityId) {

		const db = getDB();
		return db.collection('activities').deleteOne({ _id:new ObjectId(activityId) });
	}

	static addMilestone(activity, description, imageUrl, userId) {

		const milestone = { _id:new ObjectId(),
		description:description,
		imageUrl:imageUrl,
		created_at:Date.now()
		}

		activity.milestones.push(milestone);

		const db = getDB();
		return db.collection('activities').updateOne({ _id:activity._id }, { $set:{'milestones':activity.milestones} })
		.then(() => {

			milestone['activityId'] = activity._id;
			milestone['activityName'] = activity.name;
			const action = new Action('Create Milestone', userId, Date.now(), milestone);
			return action.save()
		})

	}
}

module.exports = Activity;