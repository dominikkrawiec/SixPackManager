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
  }

});

var Karnet = module.exports = mongoose.model('Karnet', SubscruptionCardSchema);

module.exports.getByUserId = function(id, callback){
  Karnet.find({ user: id}, callback);
}



module.exports.addNewSubCard = function(userId, months, price, callback){
  var orderDate = moment();
  subCardEndDate = moment().add(months, 'months');

  var subCard = new Karnet({
    user: userId,
    amount: price,
    dataStart: moment(),
    dataEnd: subCardEndDate
  });

subCard.save(function(err){
  //  if (err) return console.error(err);
  });

  callback();

}
