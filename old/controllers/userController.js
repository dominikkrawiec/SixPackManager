var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
router.use(expressValidator());

var session = require("express-session");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var bodyparser = require('body-parser');
var urlencodedParser = bodyparser.urlencoded({extenden: false});
var User = require('../models/userModel');


// Configuration

router.use(express.static("public"));
router.use(session({ secret: "cats" }));
router.use(bodyparser.urlencoded({ extended: false }));
router.use(passport.initialize());
router.use(passport.session());

  // Homepage
  router.get('/', function(req,res){
    res.render('main');
  });

  // Register
  router.get('/register', function(req,res){
    res.render('register', {
      errors : false
    });
  });

  // Register USER
  router.post('/register', urlencodedParser,  function(req,res){
    var password = req.body.pass;
    var pass2 = req.body.pass2;
    var email = req.body.email;

    req.checkBody('pass', 'Password is required').notEmpty();
    req.checkBody('pass2', 'Confirm your password').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();


    var errors = req.validationErrors();

    if(errors) {
      res.render('register', {
        errors: errors
      });
    } else {

      var newUser = User.createUser({
        email: email,
        pass: password
      });


      res.redirect('/login');

    }


  });

  // Login
  router.get('/login', function(req,res){
      res.render('login', {
        errors: false
      });

  });

  // Login USER
  passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pass'
  },
    function(username, password, done) {
      User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.pass, function(err, isMatch){
      console.log(password + ' : ' + user.pass);
      if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
});
}));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
});

router.post('/login',
passport.authenticate('login', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
function(req, res) {
  res.redirect('/');
});


  module.exports = router;
