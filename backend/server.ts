'use strict';

const fs = require('fs');
const path = require('path');

const express = require('express');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');
const lusca = require('lusca');
const dotenv = require('dotenv');
const session = require('express-session');
const expressValidator = require('express-validator');
const multer = require('multer');
const upload = multer({dest: path.join(__dirname, 'uploads')});

dotenv.load({path: '.env'});

require('./db');

const app = express();
app.set('port', process.env.SERVER_PORT || 3000);

app.use(compress(6));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET
}));
app.use(function (req, res, next) {
  if (req.path === '/api/upload') {
    next();
  } else {
    //lusca.csrf()(req, res, next);
    next();
  }
});
// app.use(lusca({
//   csp: {/* ... */},
//   xframe: 'SAMEORIGIN',
//   p3p: 'ABCDEF',
//   hsts: {maxAge: 31536000, includeSubDomains: true, preload: true},
//   xssProtection: true
// }));

app.use(express.static(path.join(__dirname, '../frontend/public'), {maxAge: 31557600000}));

app.all("/*", function(req, res, next) {
  res.sendfile("index.html", {root: path.join(__dirname, '../frontend/public')});
});

app.use(function(req, res, next) {
  let err = new Error("Not Found");
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message
  });
});

app.listen(app.get('port'), function () {
  console.log(`Server listening on port ${app.get('port')} in ${app.get('env')} mode`);
});

module.exports = app;