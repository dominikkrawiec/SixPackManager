var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var moment = require('moment');

var GymSchema = mongoose.Schema({
  owner : {
      type: Schema.Types.ObjectId,
      ref: 'User'
  },

  name : {
    type: String
  },

  adress : {
    city: {
      type: String
    },

    street: {
      type: String
    },

    post: {
      type: String
    }
  },

  contact : {
    email : {
      type: String
    },

    phone : [{
      type: String
    }]
  },

  coverPhoto : {
    type: String
  }
});

var Gym = module.exports = mongoose.model('Gym', GymSchema);

module.exports.newGym = function(details, callback){
  var singleGym = new Gym(details);
  singleGym.save(callback);
}
