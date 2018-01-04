var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1/GymUsers', {
  useMongoClient: true
});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var schema = new mongoose.Schema({
  email : String,
  pass : String
});

var UserModel =  mongoose.model('userModel', schema, 'colections');

var User = {
  userDb : function(){


  },

  users : [],
  model: UserModel,

  getUserData : function(){

    var users = this.model.find(function(error, result) {
        if(error) throw error;
     }).cursor();

     return users
  },

  createUser : function(newUser, callback){

    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.pass, salt, function(err, hash) {
        // Store hash in your password DB.
        newUser.pass = hash;
        console.log(newUser.pass);
        user = new UserModel(newUser);
        user.save(function (err) {
          if (err) return handleError(err);
          // saved!
        })

    });
});
},

  comparePassword : function(candidatePassword, hash, callback){
  	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      console.log(err);
        callback(null, isMatch);
  });
},

  getUserByUsername : function(email, callback){
	   var query = {email: email};
	    UserModel.findOne(query, callback);
},



  getUserById : function(id, callback){
	   UserModel.findById(id, callback);
   }
}



module.exports = User;
