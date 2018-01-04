var express = require('express'),
router = express.Router();

var Karnet = require('../models/karnet.js');

router.get('/', ensureAuthenticated, function(req, res){


  /* var karnet1 = new Karnet({
    user: req.user.id,
    amount: 30,
    dataStart: new Date,
    dataEnd: new Date
  }); */

  //karnet1.save();

  Karnet.getByUserId(req.user.id, function(err, rslt){

      for(var i = 0; i < rslt.length; i++){
        rslt[i].dayStart = rslt[i].dataStart.getDay();
        rslt[i].monthStart = rslt[i].dataStart.getMonth();
        rslt[i].yearStart = rslt[i].dataStart.getFullYear();

        rslt[i].start = rslt[i].dayStart + '-' + rslt[i].monthStart + '-' +rslt[i].yearStart

        rslt[i].dayEnd = rslt[i].dataEnd.getDay();
        rslt[i].monthEnd = rslt[i].dataEnd.getMonth() + 1;
        rslt[i].yearEnd = rslt[i].dataEnd.getFullYear();

        rslt[i].end= rslt[i].dayEnd + '-' + rslt[i].monthEnd + '-' +rslt[i].yearEnd
      }

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
      price = req.body.price,
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
