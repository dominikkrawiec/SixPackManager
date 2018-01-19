var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var moment = require('moment');

var CalendarSchema = mongoose.Schema({
  eventId : {
    type: String
  },

  name: {
    type: String
  },

  dataStart: {
    type: Date
  },

  description: {
    type: String
  },

  people: [{ type: Schema.Types.ObjectId, ref: 'EventRegistration' }]
});

var EventRegistrationSchema = mongoose.Schema({
  userId: {
    type: String
  } ,

  eventId : {
    type: String
  },

  calendarId: { type: Schema.Types.ObjectId, ref: 'Calendar' },

  calendar: [{ type: Schema.Types.ObjectId, ref: 'Calendar' }]
});

var Calendar = module.exports = mongoose.model('Calendar', CalendarSchema);

var EventRegistration = module.exports = mongoose.model('EventRegistration', EventRegistrationSchema, 'calendars');

module.exports.newEvent = function(newEvent, callback){
    Calendar.find({ eventId: newEvent.id }, function(err, event){
      if(err) throw err;

      if(!event.length){
          var singleEvent = new Calendar({
            eventId: newEvent.id,
            name: newEvent.title,
            dataStart: newEvent.start,
            description: newEvent.description
          });

          singleEvent.save(callback);
      }
    });
}

module.exports.findEvent = function(id, callback){
  Calendar.find({eventId: id}, function(err, ev){
    if(err) throw err;

    if(ev.length){
      callback(ev);

    }
  })
}

module.exports.goingToEvent = function(event, user, callback){

  var calendarId = Calendar.findOne({ eventId: event}, function(err, singleEvent){

    EventRegistration.find({
      eventId: event,
      userId: user
    }, function(err, ev){
      if(err) throw err;

        if(!ev.length){
          new EventRegistration({
            calendarId: singleEvent._id,
            eventId: event,
            userId: user
          }).save(callback);

        } else {

        }
      });
  });




}

module.exports.notGoingToEvent = function(event, user, callback){
    EventRegistration.find({
      eventId: event,
      userId: user
    }, function(err, ev){
      if(err) throw err;

      if(ev.length){
        EventRegistration.remove({
          eventId: event,
          userId: user
        }, callback);
      }

    })

}

module.exports.checkStatus = function(user, event, callback){
  EventRegistration.find({
    eventId: event,
    userId: user
  }, function(err, ev){
    if(err) throw err;

    if(!ev.length) {
    callback('Going!', false);
    } else {
    callback("I'll be there!", true);
    }
  });
}

module.exports.getEventsByUser = function(userId, callback) {

  EventRegistration.find({userId : userId}).
    populate('calendarId').
    exec(function(err, events){
      if(err) throw err;
      events.forEach(function(el){
        el.summary = el.calendarId.name;
        el.start = el.calendarId.dataStart;
        el.end = '';
      });

      callback(events);
    });
};
