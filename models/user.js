var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},

	gyms:[{
		type: Schema.Types.ObjectId,
		ref: 'Gym'
	}],

	followed: [{
		type: Schema.Types.ObjectId,
		ref: 'Gym'
	}],

	password: {
		type: String
	},

	email: {
		type: String
	},
	name: {
		type: String
	},

	karnety : [{
		type: Schema.Types.ObjectId,
    ref: 'Karnet'
	}]
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.updateUser = function(id, user, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(user.password, salt, function(err, hash) {
	        user.password = hash;
	        User.update(
						{_id : id},
						{
							name: user.name,
							email: user.email,
							password: hash
						},
						{ multi: false },
						callback
					);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.getUserByEmail = function(email, calback){
	var query = {email: email};
	User.findOne(query, calback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}


/* Admin functions */

module.exports.getUsersCount = function(callback){
		User.count({}, callback);
}
