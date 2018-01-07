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
    console.log(cards)

    var convertedCards = Karnet.convertDate(cards);
    return convertedCards;
  });


    res.render('admin/list', {
      cards : cards
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
    if (req.user.username != 'admin') {
      res.redirect('/');
    } else {
      next();
    }
  }
}

module.exports = router;
