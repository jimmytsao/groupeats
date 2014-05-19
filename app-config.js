
var express = require('express');
var partials = require('express-partials');
var userHandler = require('./server/userHandler.js');
var busHandler = require('./server/busHandler.js');
var dbConnect = require('./db/db-config.js');
var app = express();

// view engine setup
app.configure(function() {
  // app.set('views', __dirname + '/views');
  // app.set('view engine', 'ejs');
  // app.use(partials());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser('shhhh, very secret'));
  app.use(express.session());
});

//user routes
app.get('/', userHandler.sendIndex);
app.post('/login', userHandler.login);
app.post('/signup', userHandler.signup);


//business routes
app.get('/business', busHandler.sendBusIndex);
app.post('/business/login', busHandler.login);
app.post('/business/signup', busHandler.signup);

module.exports = app;
