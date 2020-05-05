const getDB = require('../utils/database').getDB;
const ObjectId = require('mongodb').ObjectId;
const Action = require('./action');

class Activity {

	constructor(name, link, description, imageUrl , created_at, userId, milestones) {

		this.name = name;
		this.link = link;
		this.description = description;
		this.imageUrl = imageUrl;
		this.is_completed = false;
		this.created_at = created_at;
		this.userId = userId;
		this.milestones = milestones;
	}


	save() {

		const db = getDB();
		return db.collection('activities').insertOne(this);
	}


	static complete(id, incomplete) {

		const db = getDB();

		if(incomplete) {
		
			return db.collection('activities').updateOne({ _id:new ObjectId(id) }, { $set:{is_completed:false} });
		}

		return db.collection('activities').updateOne({ _id:new ObjectId(id) }, { $set:{is_completed:true} });
	}


	static getAll(userId) {

		const db = getDB();
		return db.collection('activities').find({ userId:new ObjectId(userId) }).sort({ created_at:-1 }).toArray();
	}


	static getStats(userId) {

		const db = getDB();
		let activities;

		return Activity.getAll(userId)
				.then(result => {
					
					activities =  result;
				})
				.then(() => {

					const db = getDB();
					return db.collection('activities').find({ is_completed:true }).count();
				})
				.then(completedCount => {

					const uncompletedCount = activities.length - completedCount;
					return { activities:activities, completed:completedCount, uncompleted:uncompletedCount };
				})
				.catch(err => {
					console.log(err);
				})
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

		const milestones = [...activity.milestones];

		milestones.push(milestone);

		const db = getDB();
		return db.collection('activities').updateOne({ _id:activity._id }, { $set:{'milestones':milestones} })
		.then(() => {

			milestone['activityId'] = activity._id;
			milestone['activityName'] = activity.name;
			const action = new Action('Create Milestone', userId, Date.now(), milestone);
			return action.save()
		})

	}

	static editMilestone(activity, milestoneId, description, imageUrl) {

		const milestones = [...activity.milestones];

		const idx = milestones.findIndex(milestone => milestone._id.toString() === milestoneId.toString());

		if(typeof idx == "number") {

			milestones[idx].description = description;
			imageUrl ? milestone.imageUrl = imageUrl : '';
		}

		const db = getDB();
		return db.collection('activities').updateOne({ _id:new ObjectId(activity._id) }, { $set:{'milestones':milestones} })
		.then(() => {

			const milestone = milestones[idx];
			milestone['activityId'] = activity._id;
			milestone['activityName'] = activity.name;
			const action = new Action('Edit Milestone', activity.userId, Date.now(), milestone);
			return action.save();
		})
	}


	static deleteMilestone(activity, milestoneId) {

		const milestones = [...activity.milestones];

		const idx = milestones.findIndex(milestone => milestone._id.toString() === milestoneId.toString() );

		milestones.splice(idx, 1);

		const db = getDB();
		return db.collection('activities').updateOne({ _id:new ObjectId(activity._id) }, { $set:{'milestones':milestones} })
		.then(() => {

			return Action.deleteMilestoneActions(milestoneId);
		})
	}
}

module.exports = Activity;