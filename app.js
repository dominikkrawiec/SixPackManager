var express = require('express');
var ejs = require('ejs');
var Gym = require("./controllers/gymController");

var app = express();

app.set('view engine', 'ejs');
app.use(express.static('./assets'));

Gym.init();
