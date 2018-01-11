var express = require('express'),
    router = express.Router(),
    paypal = require('paypal-rest-sdk');

paypal.configure({
      'mode': 'sandbox', //sandbox or live
      'client_id': 'Acnsjzx8zsZnt-J24fPuTOWS7oZhz2_846RKmkddRYdz_JNHs3RHrkcCpy_keQsfLyzP_bAeHf0D8iMi',
      'client_secret': 'EOmjHFqxfuFyOpOelPqog6vtdlfM92iA95FHt5pFSggKR2-X9BjYQ_atPzQkj5aOkRt2oXeFaMhboYAT'
    });

router.get('/:amount/:currency/:subcardId/:user', function(req,res) {
  // add subcard to the db with status 'unpaid'

  // paypal payment
  var Paypal = require('../models/paypal.js');

  var payment = Paypal.configure(req.params.amount, req.params.currency, req.params.subcardId, req.params.user);

   createPay( payment )
        .then( ( transaction ) => {
            var id = transaction.id;
            var links = transaction.links;
            var counter = links.length;
            while( counter -- ) {
                if ( links[counter].method == 'REDIRECT') {
					// redirect to paypal where user approves the transaction
                    return res.redirect( links[counter].href )
                }
            }
        })
        .catch( ( err ) => {
            console.log( err );
            res.redirect('payment/err');
        });

});

var createPay = ( payment ) => {
    return new Promise( ( resolve , reject ) => {
        paypal.payment.create( payment , function( err , payment ) {
         if ( err ) {
             reject(err);
         }
        else {
            resolve(payment);
        }
        });
    });
}

router.get('/success/:subcardId/:user', function(req,res){
  // change status on the db
  var Karnet = require('../models/karnet.js');

  Karnet.activate(req.params.subcardId, function(err){
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


  res.render('paypal/success');
});

router.get('/err', function(req,res){
  res.render('paypal/err');
});

module.exports = router;
