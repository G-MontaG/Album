'use strict';

import fs = require('fs');
import path = require('path');

import express = require('express');
import cookieParser = require('cookie-parser');
import compress = require('compression');
import bodyParser = require('body-parser');
import logger = require('morgan');
//import lusca = require('lusca');
import dotenv = require('dotenv');
import session = require('express-session');
import expressValidator = require('express-validator');
import multer = require('multer');
const upload = multer({dest: path.join(__dirname, 'uploads')});

dotenv.config({path: '.env'});

import './db';

import {authRouter} from './controllers/auth';

import {ServerMessage} from './helpers/serverMessage';

class Server {
  public app:express.Application;

  constructor() {
    this.app = express();
    this.app.set('port', process.env.SERVER_PORT || 3000);

    this.app.use(compress(6));
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(expressValidator());
    this.app.use(cookieParser());
    this.app.use(session({
      resave: true,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET
    }));
    this.app.use(function (req:express.Request, res:express.Response, next:express.NextFunction) {
      if (req.path === '/api/upload') {
        next();
      } else {
        //lusca.csrf()(req, res, next);
        next();
      }
    });
    // this.app.use(lusca({
    //   csp: {/* ... */},
    //   xframe: 'SAMEORIGIN',
    //   p3p: 'ABCDEF',
    //   hsts: {maxAge: 31536000, includeSubDomains: true, preload: true},
    //   xssProtection: true
    // }));

    this.app.use(express.static(path.join(__dirname, '../frontend/public')));
    this.app.disable('x-powered-by');

    this.configureRoutes();

    this.app.get(new RegExp(`^\/(login|signup|signup\/local|google-auth\/response|facebook-auth\/response|
    verify|forgot|reset|dashboard)\/?$`), function (req:express.Request, res:express.Response) {
      res.sendFile("index.html", {root: path.join(__dirname, '../frontend/public')});
    });

    this.configureErrorHandlers();

    this.app.listen(this.app.get('port'), function () {
      console.log(`Server listening on port ${this.app.get('port')} in ${this.app.get('env')} mode`);
    }.bind(this));
  }

  addNamespace(namespace:string, router) {
    this.app.use(namespace, router);
  }

  configureRoutes() {
    this.addNamespace('/auth', authRouter);
  }

  configureErrorHandlers() {
    this.addNamespace('*', (req:express.Request, res:express.Response, next:express.NextFunction) => {
      var rootDir = path.join(__dirname, '../frontend/public');
      if (req.accepts('html')) {
        res.sendFile('error.html', {root: rootDir});
      } else if (req.accepts('json')) {
        ServerMessage.error(res, 404, 'Page not found');
      }
    });
  }
}

new Server();