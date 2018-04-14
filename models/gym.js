var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var moment = require('moment');
var textSearch = require('mongoose-text-search');

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

    country: {
      type: String
    }
  },

  contact : {
    email : {
      type: String
    },

    phone : [{
      type: String
    }],

    website : {
      type: String
    }
  },

  coverPhoto : {
    type: String
  }
});

GymSchema.plugin(textSearch);

var Gym = module.exports = mongoose.model('Gym', GymSchema);

module.exports.newGym = function(details, callback){
  var singleGym = new Gym(details);
  singleGym.save(callback);
}

module.exports.allGyms = function(callback){
  var gyms = Gym.find({}, callback);
}

module.exports.findGymById = function(id, callback){
  var gym = Gym.findOne({_id : id}, callback);
}

module.exports.searchGym = function(search, callback){
  Gym.find({"name" : {$regex : search,
  '$options' : 'i'}}, callback);

}
