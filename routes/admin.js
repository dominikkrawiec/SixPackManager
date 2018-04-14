var express = require('express'),
router = express.Router();

var Karnet = require('../models/karnet.js');
var User = require('../models/user.js');
var Events = require('../models/calendar.js');
var Gym = require('../models/gym.js');

router.get('/', requireAdmin(), ensureAuthenticated, function(req, res){

      /* Staticstics */
      User.getUsersCount(function(err, count){
        if(err) throw err;

        Karnet.getSubCardsByMonth(function(err, cards){
          if(err) throw err;

          res.render('admin', {
            stats: {
              users: count,
              cards: cards
            }
          });
        });
      });
});

router.get('/subcards', ensureAuthenticated, function(req, res) {
  Karnet.listAll(function(err, cards){
    if(err) throw err;
    var convertedCards = Karnet.convertDate(cards);
    res.render('admin/listAll', {
      cards: convertedCards
    });
  })
});

router.post('/subcards/search', ensureAuthenticated, function(req, res) {
  var cards = Karnet.getByEmail(req.body.email, function(err, cards){
    if(err) throw err;

    var convertedCards = Karnet.convertDate(cards);
    res.render('admin/search', {
      cards : convertedCards
    });

  });


});

router.get('/subcards/:email', ensureAuthenticated, function(req, res) {
  var cards = Karnet.getByEmail(req.params.email, function(err, cards){
    if(err) throw err;

    var convertedCards = Karnet.convertDate(cards);
    res.render('admin/list', {
      cards : convertedCards
    });

  });


});

router.get('/subcards/activate/:user/:subcard', ensureAuthenticated, function(req, res) {
  var subcardId = req.params.subcard;

  Karnet.activate(subcardId, function(err){
    if(err) throw err;

    Karnet.getByUserId(req.params.user, function(err, rslt){
      rslt = Karnet.convertDate(rslt);
      console.log(rslt);
      res.render('admin/list', {
          cards : rslt
        });
    })
  });
});

router.get('/subcards/unactivate/:user/:subcard', ensureAuthenticated, function(req, res) {
  var subcardId = req.params.subcard;

  Karnet.unactivate(subcardId, function(err){
    if(err) throw err;

    Karnet.getByUserId(req.params.user, function(err, rslt){
      rslt = Karnet.convertDate(rslt);
      console.log(rslt);
      res.render('admin/list', {
          cards : rslt
        });
    })
  });
});

router.get('/subcards/remove/:user/:subcard', ensureAuthenticated, function(req, res) {
  var subcardId = req.params.subcard;

  Karnet.remove(subcardId, function(err){
    if(err) throw err;

    Karnet.getByUserId(req.params.user, function(err, rslt){
      rslt = Karnet.convertDate(rslt);
      res.render('admin/list', {
          cards : rslt
        });
    })
  });
});

router.get('/events', function(req, res){
  Events.allEvents(function(err, events){
    if(err) throw err;

    res.render('admin/events', {
      events: events
    });


  });
});

router.get('/event/remove/:id', function(req, res){
  Events.removeEvent(req.params.id, function(err){
    if(err) throw err;

    res.redirect('/admin/events');
  })
})

router.get('/event/new', requireAdmin(), ensureAuthenticated, function(req, res){

  allGyms = Gym.allGyms(function(err, gym){
    if(err) throw err;

    console.log(gym);

    res.render('newEvent', {
      gyms: gym
    });

  })
});

router.post('/event/new/finish', function(req, res){
  var name = req.body.name;
  var gym = req.body.gyms;
  var date = req.body.date;

  console.log(name + ' ' + gym + ' ' + date);

  Events.newEvent({
    name: name,
    gymId: gym,
    dataStart: date
  }, function(err, ev){

    if(err) throw err;

    res.redirect('/calendar/event/' + ev._id);
  });
});

router.get('/gym/new/', requireAdmin(), ensureAuthenticated, function(req, res){
  res.render('newgym-steps', {});
});

router.post('/gym/new/finish', function(req, res){

// form fields
  var name = req.body.gymname;
  var street = req.body.street;
  var city = req.body.city;
  var country = req.body.country;

  var phone = req.body.phone,
        email = req.body.email,
        site = req.body.site;

  var upload = req.body.photo;

  details = {
    owner: req.user.id,
    name: name,
    adress: {
      street: street,
      city: city,
      country: country
    },

    contact: {
      email: email,
      phone: phone,
      website: site
    },

    coverPhoto: upload
  }

  Gym.newGym(details, function(err, gym){
    if(err) throw err;
    console.log('gym added');

    res.redirect('/gym/' + gym.id);
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

function requireAdmin(){
  return function(req, res, next) {
    if (req.user == null || req.user.username != 'admin' ) {
      res.redirect('/');
    } else {
      next();
    }
  }
}

module.exports = router;
