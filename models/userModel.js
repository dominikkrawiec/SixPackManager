var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

mongoose.connect('mongodb://127.0.0.1/GymClients', {
  useMongoClient: true
});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function User() {
  this.users = [];
  this.schema  = new mongoose.Schema({
    firstname : String,
    secondname : String
  });

  this.model =  mongoose.model('userModel', this.schema, 'colections');
  this.getUserData = function(){

    var users = this.model.find(function(error, result) {
        if(error) throw error;
     }).cursor();

     return users
  }
}

module.exports = User;
