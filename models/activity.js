const getDB = require('../utils/database').getDB;
const ObjectId = require('mongodb').ObjectId;
const Action = require('./action');
const file = require('../utils/file');

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

	static complete(activity, incomplete) {

		const db = getDB();

		if(incomplete) { 
			return db.collection('activities').updateOne({ _id:new ObjectId(activity._id) }, { $set:{is_completed:false} })
			.then(() => {
				return Action.deleteCompleteActivity(activity._id);
			})
		}

		return db.collection('activities').updateOne({ _id:new ObjectId(activity._id) }, { $set:{is_completed:true} })
		.then(() => {
			const action = new Action('Complete Activity', activity.userId, Date.now(), activity);
			return action.save();
		})
    }
    
    static count(userId) {

        const db = getDB();

        return db.collection('activities').find({ userId:new ObjectId(userId) }).count();
    }

	static get(userId, limit=null, skip=null) {

        const db = getDB();

        if(limit && !skip)
        {
		    return db.collection('activities').find({ userId:new ObjectId(userId) }).sort({ created_at:-1 }).limit(limit).toArray();
        }

        if(limit && skip) 
        {
		    return db.collection('activities').find({ userId:new ObjectId(userId) }).sort({ created_at:-1 }).skip(skip).limit(limit).toArray();
        }

        return db.collection('activities').find({ userId:new ObjectId(userId) }).sort({ created_at:-1 }).toArray();
    }

	static getStats(userId) {

		let db = getDB();
		let activities;

		return Activity.get(userId)
		.then(result => {
			
			activities =  result;
		})
		.then(() => {

			return db.collection('activities').find({ $and:[{ userId:new ObjectId(userId) }, { is_completed:true }]}).count();
		})
		.then(completedCount => {

			const uncompletedCount = activities.length - completedCount;
			return { activities:activities, completed:completedCount, uncompleted:uncompletedCount };
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

	static delete(activity, next) {

		const db = getDB();

		const imagePaths = activity.milestones.map(milestone => milestone.imageUrl);

		// deleting the activity and milestone images 

        imagePaths.forEach(path => {
            file.delete(path, next);
        })

		return db.collection('activities').deleteOne({ _id:new ObjectId(activity._id) });
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

	static editMilestone(activity, idx) {

        const db = getDB();
		return db.collection('activities').updateOne({ _id:new ObjectId(activity._id) }, { $set:{'milestones':activity.milestones} })
		.then(() => {

			const milestone = activity.milestones[idx];
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