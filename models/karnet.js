var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var moment = require('moment');

moment().format();

var SubscruptionCardSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
   },

  amount : {
    type: Number,
    min: 0
  },

  dataStart : {
    type: Date
  },

  dataEnd : {
    type: Date
  },

  status: {
    type: String
}

});

var Karnet = module.exports = mongoose.model('Karnet', SubscruptionCardSchema);

module.exports.getByUserId = function(id, callback){
  Karnet.find({ user: id}, callback);
}

module.exports.getByEmail = function(email, callback){
//get User Id by Email

  var User = require('../models/user');
  User.getUserByEmail(email, function(err, user){
    if(err) throw err;
    
    //var userId = user._id;
    Karnet.find({ user: userId}, callback);

  });

}


module.exports.addNewSubCard = function(userId, months, price, callback){

  var subCardEndDate = moment().add(months, 'months');

  var subCard = new Karnet({
    user: userId,
    amount: price,
    dataStart: moment(),
    dataEnd: subCardEndDate,
    status: 'Unpaid'
  });

subCard.save(function(err){
  //  if (err) return console.error(err);
  });

  callback();

}

module.exports.convertDate = function(rslt){
  for(var i = 0; i < rslt.length; i++){
    rslt[i].dayStart = rslt[i].dataStart.getDate();
    rslt[i].monthStart = rslt[i].dataStart.getMonth() + 1;
    rslt[i].yearStart = rslt[i].dataStart.getFullYear();
    console.log('Day:' + rslt[i].dataStart);

    rslt[i].start = rslt[i].dayStart + '-' + rslt[i].monthStart + '-' +rslt[i].yearStart

    rslt[i].dayEnd = rslt[i].dataEnd.getDate();
    rslt[i].monthEnd = rslt[i].dataEnd.getMonth() + 1;
    rslt[i].yearEnd = rslt[i].dataEnd.getFullYear();

    rslt[i].end = rslt[i].dayEnd + '-' + rslt[i].monthEnd + '-' +rslt[i].yearEnd
  }

    return rslt;
}
