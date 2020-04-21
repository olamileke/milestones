const getDB = require('../utils/database').getDB;

class User {
	constructor(name, email, password, avatar, isActivated, created_at) {
		this.name = name;
		this.email = email;
		this.password = password;
		this.avatar = avatar;
		this.isActivated = isActivated;
		this.created_at = created_at;
	}

	save() {
		const db = getDB();
		return db.collection('users').insertOne(this);
	}

	static findByEmail(email) {
		const db = getDB();
		return db.collection('users').findOne({email:email});
	}
}


module.exports = User;