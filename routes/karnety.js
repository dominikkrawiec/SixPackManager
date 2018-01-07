var express = require('express'),
router = express.Router();
var moment = require('moment');

var Karnet = require('../models/karnet.js');

router.get('/', ensureAuthenticated, function(req, res){

Karnet.getByUserId(req.user.id, function(err, rslt){

  rslt = Karnet.convertDate(rslt);

  res.render('karnety', {
      karnety : rslt
    });
  });


});

router.get('/add', ensureAuthenticated, function(req, res){
    res.render('newSubCard');
});

router.post('/add', function(req,res){
  var months = req.body.months,
      price = months * 10;
      callbck = function(){
        res.redirect('/karnety');
      }

    Karnet.addNewSubCard(req.user.id, months, price, callbck);
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
