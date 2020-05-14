
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

	static get(userId, start, limit) {
		const db = getDB();
		if(start) {
			return db.collection('actions').find({ userId:new ObjectId(userId) }).sort({ created_at:-1 }).skip(start).limit(limit).toArray();
		}

		return db.collection('actions').find({ userId:new ObjectId(userId) }).sort({ created_at:-1 }).limit(limit).toArray();
	}

	static getCount(userId) {
		const db = getDB();
		return db.collection('actions').find({ userId: new ObjectId(userId) }).count();
	}

	static getCreatedInDateCount(userId, date) {
		const db = getDB();
		return db.collection('actions').find({ userId: new ObjectId(userId), created_at:{$gt:date} }).count();
	}

	static updateActivity(activity) {
		const db = getDB();
		return db.collection('actions')
		.updateMany({ "activity._id":new ObjectId(activity._id) } , { $set:{ activity:activity } })
		.then(() => {
			return db.collection('actions')
			.updateMany({ "milestone.activityId":new ObjectId(activity._id) }, { $set:{'milestone.activityName':activity.name} });
		})
	}

	static deleteCompleteActivity(activityId) {
		const db = getDB();
		return db.collection('actions').deleteOne({ "activity._id":activityId, name:'Complete Activity' });
	}

	static updateMilestone(milestoneId, description, imageUrl) {
		const db = getDB();

		if(imageUrl) {
			return db.collection('actions')
			.updateMany({ "milestone._id":new ObjectId(milestoneId) }, { $set:{ "milestone.description":description, "milestone.imageUrl":imageUrl } });
		}

		return db.collection('actions')
		.updateMany({ "milestone._id":new ObjectId(milestoneId) }, { $set:{ "milestone.description":description } });
	}

	static deleteMilestoneActions(milestoneId) {
		const db = getDB();
		return db.collection('actions').deleteMany({ 'milestone._id':new ObjectId(milestoneId) });
	}

	static deleteActivityActions(activityId) {
		const db = getDB();
		const id = new ObjectId(activityId);
		return db.collection('actions').deleteMany({ $or:[{ "activity._id":new ObjectId(id) }, { "milestone.activityId":new ObjectId(id) }] });
	}
}


module.exports = Action;