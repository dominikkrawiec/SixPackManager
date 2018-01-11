
var paypal = require('paypal-rest-sdk');

module.exports.configure = function(amount, currency, subcardId, user){
  paypal.configure({
        'mode': 'sandbox', //sandbox or live
        'client_id': 'Acnsjzx8zsZnt-J24fPuTOWS7oZhz2_846RKmkddRYdz_JNHs3RHrkcCpy_keQsfLyzP_bAeHf0D8iMi',
        'client_secret': 'EOmjHFqxfuFyOpOelPqog6vtdlfM92iA95FHt5pFSggKR2-X9BjYQ_atPzQkj5aOkRt2oXeFaMhboYAT'
      });

      var payment = {
               "intent": "authorize",
      "payer": {
       "payment_method": "paypal"
      },
      "redirect_urls": {
       "return_url": "http://127.0.0.1:3000/payment/success/" + subcardId + '/' + user,
       "cancel_url": "http://127.0.0.1:3000/payment/err"
      },
      "transactions": [{
       "amount": {
         "total": amount,
         "currency": currency
       },
       "description": "subscription card"
      }]
       }

       return payment;
}
