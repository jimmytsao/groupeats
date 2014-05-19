
var express = require('express');
var partials = require('express-partials');
var handler = require('./server/handler.js');
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

app.get('/', handler.sendIndex);
app.post('/login', handler.login);
app.post('/signup', handler.signup);

module.exports = app;
