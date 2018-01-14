var express = require('express');
var router = express.Router();


router.get('/', ensureAuthenticated, function(req,res){
	// Google Callendar

	var eventsArray = [];
	var Calendar = require('../quickstart.js');
	var events = Calendar(function(events){
		console.log(events);

		events.forEach(function(el){
			el.title = el.summary;
			el.start = el.start.dateTime;
			el.end = el.end.dateTime;
		});

		res.render('calendar', {
			events: events
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
