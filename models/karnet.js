var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var moment = require('moment');

moment().format();

var SubscruptionCardSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
   },

   gymId: {
     type: Schema.Types.ObjectId,
     ref: 'Gym'
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
  Karnet.find({ user: id}).populate('gymId', 'name').exec(callback);
}

module.exports.getByEmail = function(email, callback){
//get User Id by Email
  var User = require('../models/user');
  User.getUserByEmail(email, function(err, user){
    if(err) throw err;

    if(!user){
      console.log('Email not found')
    } else {
      var userId = user._id;
      console.log('User: ' + userId);
      Karnet.find({user: userId}, callback);
    }
  });

}


module.exports.addNewSubCard = function(userId, gymId, months, price, callback){

  var subCardEndDate = moment().add(months, 'months');

  var subCard = new Karnet({
    user: userId,
    gymId: gymId,
    amount: price,
    dataStart: moment(),
    dataEnd: subCardEndDate,
    status: 'Unpaid'
  });

var subcardId = subCard.save(function(err, card){
  if (err) throw error;
  callback(card._id);
  });





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

   // change action link
    if(rslt[i].status == 'Unpaid') {
      rslt[i].actionMsg = 'Activate';
      rslt[i].actionLink = '/activate/' + rslt[i].user + '/' + rslt[i]._id;

    } else {
      rslt[i].actionMsg = 'Unactivate';
      rslt[i].actionLink = '/unactivate/' + rslt[i].user + '/' + rslt[i]._id;
    }

      rslt[i].removeLink = '/remove/' + rslt[i].user + '/' + rslt[i]._id;
      rslt[i].removeMsg = 'Remove';
  }


    return rslt;
}

module.exports.activate = function(subcardId, callback){
  console.log(subcardId)
  var query = { '_id' : subcardId};
  var update = { 'status': 'Active'};
  Karnet.findOneAndUpdate(query, update , {upsert:true}, callback);

}

module.exports.unactivate = function(subcardId, callback){
  console.log(subcardId)
  var query = { '_id' : subcardId};
  var update = { 'status': 'Unpaid'};
  Karnet.findOneAndUpdate(query, update , {upsert:true}, callback);

}

module.exports.remove = function(subcardId, callback){
  console.log(subcardId)

  Karnet.findById(subcardId, function (err, doc) {
    if (err) throw err;

    doc.remove(callback); //Removes the document
})

}

/* Admin Staticstics */

module.exports.getSubCardsByMonth = function(callback){
  var month = moment().month();
  var year = moment().year();

  start = moment().date('1').month(month).year(year);
  end = moment().date('29').month(month).year(year);

  console.log(start.toString() + ' ::: ' + end.toString());
   Karnet.count({ dataStart:
    {
      $gte: start,
      $lt: end
    }
  }, callback);
}

module.exports.listAll = function(callback){
  Karnet.find({}).populate('user').exec(callback);
}
