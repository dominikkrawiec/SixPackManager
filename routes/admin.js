var express = require('express'),
router = express.Router();

var Karnet = require('../models/karnet.js');

router.get('/', requireAdmin(), ensureAuthenticated, function(req, res){

      res.render('admin', {

      });

});

router.get('/subcards', ensureAuthenticated, function(req, res) {
    res.render('admin/cards', {

    });
});

router.post('/subcards', ensureAuthenticated, function(req, res) {
  var cards = Karnet.getByEmail(req.body.email, function(err, cards){
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
          cards : rslt,
          msg: 'Item have been activated successfully!'
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
          cards : rslt,
          msg: 'Item have been removed successfully!'
        });
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
