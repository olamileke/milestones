const getDB = require('../utils/database').getDB;
const ObjectId = require('mongodb').ObjectId;

class User {
	constructor(name, email, password, avatar, activation_token, created_at, _id) {
		this.name = name;
		this.email = email;
		this.password = password;
		this.avatar = avatar;
		this.activation_token = activation_token;
		this.created_at = created_at;
		_id ? this._id = _id : '';
	}

	save() {

		const db = getDB();

		if(!this._id) {
			return db.collection('users').insertOne(this);
		}

		return db.collection('users').updateOne({ _id:new ObjectId(this._id) }, { $set:this });
	}
	
	static findById(id) {
		const db = getDB();
		return db.collection('users').findOne({ _id:new ObjectId(id) });
	}

	static findByToken(token) {
		const db = getDB();
		return db.collection('users').findOne({ activation_token:token });
	}

	static findByEmail(email) {
		const db = getDB();
		return db.collection('users').findOne({ email:email });
	}

	static findByResetToken(token) {
		const db = getDB();
		return db.collection('passwordresets').findOne({ token:token });
	}

	static createResetToken(id, token, date) {
		const db = getDB();
		const expiry = date.getTime();

		return db.collection('passwordresets').insertOne({ userId:new ObjectId(id), token:token, expiry:expiry  });
	}

	static deleteResetToken(id) {
		const db = getDB();
		return db.collection('passwordresets').deleteOne({ userId:new ObjectId(id) });
	}

	static resetPassword(id, password) {
		const db = getDB();
		return db.collection('users').updateOne({ _id:new ObjectId(id) }, { $set:{password:password} })
		.then(() => {
			return User.deleteResetToken(id);
		})
	}
}


module.exports = User;