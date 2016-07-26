'use strict';
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const session = require('express-session');
const expressValidator = require('express-validator');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, 'uploads') });
dotenv.config({ path: '.env' });
require('./db');
class Server {
    constructor() {
        this.app = express();
        this.app.set('port', process.env.SERVER_PORT || 3000);
        this.app.use(compress(6));
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(expressValidator());
        this.app.use(cookieParser());
        this.app.use(session({
            resave: true,
            saveUninitialized: true,
            secret: process.env.SESSION_SECRET
        }));
        this.app.use(function (req, res, next) {
            if (req.path === '/api/upload') {
                next();
            }
            else {
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
        this.app.use(express.static(path.join(__dirname, '../frontend/public'), { maxAge: 31557600000 }));
        this.configureRoutes();
        this.app.listen(this.app.get('port'), function () {
            console.log(`Server listening on port ${this.app.get('port')} in ${this.app.get('env')} mode`);
        }.bind(this));
    }
    configureRoutes() {
        this.app.all("/*", function (req, res, next) {
            res.sendfile("index.html", { root: path.join(__dirname, '../frontend/public') });
        });
        this.app.use(function (req, res, next) {
            let err = new Error("Not Found");
            next(err);
        });
        this.app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.json({
                error: {},
                message: err.message
            });
        });
    }
}
new Server();
