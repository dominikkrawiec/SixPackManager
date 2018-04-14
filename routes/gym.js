var express = require('express');
var router = express.Router();

var Gym = require('../models/gym');

router.get('/:id', ensureAuthenticated, function(req, res){

  Gym.findGymById(req.params.id, function(err, gym){
    if(err) throw err;

    var details =  {
      id: req.params.id,
      name: gym.name,
      phone: gym.contact.phone,
      email: gym.contact.email,
      website: gym.contact.website,
      coverPhoto: gym.coverPhoto
    }

    res.render('singleGym', {
      gym: details
    });
  })


});

router.post('/search', ensureAuthenticated, function(req, res){
  var search = req.body.search;

  Gym.searchGym(search, function(err, gyms){
    if(err) throw err;

    res.render('search', {
      gyms : gyms
    })
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
