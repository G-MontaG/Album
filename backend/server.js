'use strict';
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');
//import lusca = require('lusca');
const dotenv = require('dotenv');
const session = require('express-session');
const expressValidator = require('express-validator');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, 'uploads') });
dotenv.config({ path: '.env' });
require('./db');
const index_1 = require('./auth/index');
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
        this.app.use('/', express.static(path.join(__dirname, '../frontend/public'), { maxAge: 31557600000 }));
        this.configureRoutes();
        this.configureErrorHandlers();
        this.app.listen(this.app.get('port'), function () {
            console.log(`Server listening on port ${this.app.get('port')} in ${this.app.get('env')} mode`);
        }.bind(this));
    }
    addNamespace(namespace, router) {
        this.app.use(namespace, router);
    }
    configureRoutes() {
        this.addNamespace('/auth', index_1.authRouter);
    }
    configureErrorHandlers() {
        this.addNamespace('*', (req, res, next) => {
            res.status(404);
            var rootDir = path.join(__dirname, '../frontend/public');
            if (req.accepts('html')) {
                res.sendFile('error.html', { root: rootDir }, function (err) {
                    if (err) {
                        console.log(err);
                        res.status(err.status).end();
                    }
                });
            }
            else if (req.accepts('json')) {
                res.json({
                    errors: [
                        { message: 'Not found' }
                    ]
                });
            }
        });
    }
}
new Server();
