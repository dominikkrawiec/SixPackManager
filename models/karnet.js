var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;


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

  var orderDate = new Date(),
  subCardEndDate = new Date().setMonth(orderDate.getMonth() + months);

  console.log(orderDate + ' ' + subCardEndDate);

  var subCard = new Karnet({
    user: userId,
    amount: price,
    dataStart: orderDate,
    dataEnd: subCardEndDate
  });

  subCard.save(function(err){
  //  if (err) return console.error(err);
  });

  callback();

}
