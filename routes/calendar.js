var express = require('express');
var router = express.Router();

var Calendar = require('../models/calendar');
var GoogleCalendar = require('../quickstart.js');

router.get('/', ensureAuthenticated, function(req,res){
	// Google Callendar

	var eventsArray = [];

	var events = GoogleCalendar(function(events){

		if(typeof events == 'object'){
			events.forEach(function(el){
				el.title = el.summary;
				el.start = el.start.dateTime;
				el.end = el.end.dateTime;
				Calendar.newEvent(el, function(){
					console.log('New Event (id: ' + el.id +') added to the database!');
				});

			});

			res.render('calendar', {
				events: events
			});


		} else {
			res.render('calendar', { });
		}

	});
});

router.get('/event/:id', ensureAuthenticated, function(req, res){
		Calendar.findEvent(req.params.id, function(event){

			Calendar.checkStatus(req.user.id, req.params.id, function(msg, isGoing){
				event[0].status = msg;

				if(isGoing) {
					event[0].actionBtn = 'not-going';
				} else {
					event[0].actionBtn = 'going'
				}

				res.render('singleEvent', {
					event: event
				});

			});


		})
});

router.get('/event/:action/:id', ensureAuthenticated, function(req, res){
		switch(req.params.action){
			case 'going':
			Calendar.goingToEvent(req.params.id, req.user.id, function(){
				console.log('Registered on event');

				Calendar.findEvent(req.params.id, function(event){
						event[0].status = "I'll be there";
						event[0].actionBtn = 'not-going';


				})
			});
			break;

			case 'not-going':
			Calendar.notGoingToEvent(req.params.id, req.user.id, function(){
				console.log('Unregistered from event');

				Calendar.findEvent(req.params.id, function(event){
					event[0].status = "Going!";
					event[0].actionBtn = 'going';


				})
			});
			break;
		}

		res.redirect('../' + req.params.id);

});

router.get('/personal', ensureAuthenticated, function(req, res){

		Calendar.getEventsByUser(req.user.id, function(events){
				res.render('personalCalendar', {
					events : events
				});
		});

});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}


module.exports = router;
