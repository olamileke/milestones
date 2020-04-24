const getDB = require('../utils/database').getDB;

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
}

module.exports = Activity;