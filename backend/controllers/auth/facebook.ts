import https = require('https');
import express = require('express');
import moment = require('moment');
import jwt = require('jsonwebtoken');

import * as cs from './constants';
const User = require('../../model/user');
import {ServerMessage} from '../../helpers/serverMessage';
import {RequestWithAuthSession, AuthData} from "./requestSession";

const getFacebookCodeUrl = `https://www.facebook.com/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&scope=public_profile%2Cemail&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fapi%2Ffacebook-auth%2Fresponse&response_type=code`;

export function facebookCodeHandler(req: express.Request, res: express.Response) {
  res.send({redirectUrl: getFacebookCodeUrl});
}

export function facebookTokenHandler(req: RequestWithAuthSession, res: express.Response) {
  if (req.query.error) {
    ServerMessage.error(req, res, 401, 'Facebook authentication error');
    console.error('Facebook authentication error');
  } else if (!req.query.code) {
    ServerMessage.error(req, res, 401, 'Facebook authentication error. Can not get code');
    console.error('Facebook authentication error. Can not get code');
  } else {
    new Promise((resolve, reject) => {
      let tokenReq = https.get(`https://graph.facebook.com/v2.6/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${req.query.code}&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fapi%2Ffacebook-auth%2Fresponse`, (resToken) => {
        let data = '';
        resToken.on('data', (chunk) => {
          data += chunk;
        });
        resToken.on('end', () => {
          resolve(JSON.parse(data));
        });
      });
      tokenReq.on('error', () => {
        let err: ServerError = new Error("Facebook authentication error. Can not get token");
        err.status = 401;
        reject(err);
      });
    }).then((authData: AuthData) => {
      let userDataReq = https.get(`https://graph.facebook.com/v2.6/me?fields=id,email,first_name,last_name,gender,picture,locale&access_token=${authData.access_token}`, (resUser) => {
        let data = '';
        resUser.on('data', (chunk) => {
          data += chunk;
        });
        resUser.on('end', () => {
          req.session.facebookUserData = JSON.parse(data);
          res.redirect('http://127.0.0.1:3000/facebook-auth/response');
        });
      });
      userDataReq.on('error', () => {
        let err: ServerError = new Error("Facebook authentication error. Can not get user info");
        err.status = 401;
        throw err;
      });
      return userDataReq;
    }).catch((err) => {
      ServerMessage.error(req, res, err.status || 500, err.message || 'Mongo database find user error');
      return err;
    });
  }
}

export function facebookUserHandler(req: RequestWithAuthSession, res: express.Response) {
  User.findOne({email: req.session.facebookUserData.email}).exec().then((user) => {
    if (!user) {
      let _data = {
        email: req.session.facebookUserData.email,
        password: '',
        profile: {
          firstname: req.session.facebookUserData.first_name,
          lastname: req.session.facebookUserData.last_name,
          gender: req.session.facebookUserData.gender,
          picture: {
            url: req.session.facebookUserData.picture.data.url,
            source: 'facebook'
          },
          language: req.session.facebookUserData.locale
        }
      };
      let newUser = new User(_data);
      delete req.session.facebookUserData;
      delete _data.email;
      _data.password = newUser.createPassword();
      cs.generateEmailToken(newUser, 'verify');
      newUser.cryptPassword().then(() => {
        return newUser.save().exec();
      }).then((user) => {
        let mailOptions = {
          to: user.email,
          from: 'arthur.osipenko@gmail.com',
          subject: 'Hello on XXX',
          text: `Hello. This is credentials for your account.
                    You no need google account every time. You can use this
                    Email: ${user.email}
                    Password: ${_data.password}
                    
                    This is a token for your account 
                    ${user.emailVerifyToken.value.slice(0, cs.emailTokenLength / 2)} ${user.emailVerifyToken.value.slice(cs.emailTokenLength / 2, cs.emailTokenLength)}
                    Please go back and enter it in your profile to verify your email.`
        };
        delete _data.password;
        cs.transporter.sendMail(mailOptions, function (err) {
          if (err) {
            let err: ServerError = new Error("Send email error");
            err.status = 500;
            throw err;
          }
          return user;
        });
      }).then((user) => {
        // if you keep in token sensitive info encrypt it before use jwt.sign()
        let _token = jwt.sign({
          id: user._id,
          'user-agent': req.headers['user-agent']
        }, process.env.JWT_SECRET, {
          algorithm: cs.tokenAlg,
          expiresIn: `${cs.tokenExp}d`,
          jwtid: process.env.JWT_ID
        });
        ServerMessage.message(res, 200, {message: 'User is authorized', token: _token});
      }).catch((err) => {
        ServerMessage.error(req, res, err.status || 500, err.message || 'Mongo database save user error');
        return err;
      });
    } else {
      if (user.profile.picture.source === 'facebook') {
        user.picture = req.session.facebookUserData.picture.data.url;
      }
      user.save().exec().then((user) => {
        delete req.session.facebookUserData;
        // if you keep in token sensitive info encrypt it before use jwt.sign()
        let _token = jwt.sign({
          id: user._id,
          'user-agent': req.headers['user-agent']
        }, process.env.JWT_SECRET, {
          algorithm: cs.tokenAlg,
          expiresIn: `${cs.tokenExp}d`,
          jwtid: process.env.JWT_ID
        });
        ServerMessage.message(res, 200, {message: 'User is authorized', token: _token});
      }).catch((err) => {
        ServerMessage.error(req, res, err.status || 500, err.message || 'Mongo database find user error');
        return err;
      });
    }
  }).catch((err) => {
    ServerMessage.error(req, res, err.status || 500, err.message || 'Mongo database find user error');
    return err;
  });
}