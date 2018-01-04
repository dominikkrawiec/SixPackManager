var express = require('express');
var ejs = require('ejs');
var Gym = require("./controllers/gymController");
var userRouter = require("./controllers/userController");

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('./assets'));
var serv = app.listen(process.env.PORT || 3000)
app.use('/', userRouter);


// Set Port


//Gym.init();
