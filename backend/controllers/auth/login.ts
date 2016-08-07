import express = require('express');
import moment = require('moment');
import jwt = require('jsonwebtoken');

import * as cs from './constants';
const User = require('../../model/user');
import {ServerMessage} from '../../helpers/serverMessage';
import {RequestWithAuthSession} from "./requestSession";

export function loginHandler(req:RequestWithAuthSession, res:express.Response) {
  req.checkBody('data.email', 'Email is not valid').isEmail();
  req.checkBody('data.password', 'Password cannot be blank').notEmpty();
  req.checkBody('data.password', `Password length must be from ${cs.passwordMinLength} to ${cs.passwordMaxLength}`)
    .len(cs.passwordMinLength, cs.passwordMaxLength);

  let errors = req.validationErrors();
  if (errors) {
    ServerMessage.error(res, 401, errors[0].msg);
  } else {
    if (!req.session.loginPasswordAttempts || !req.session.loginPasswordAttemptsExp) {
      req.session.loginPasswordAttempts = 1;
      req.session.loginPasswordAttemptsExp = moment().add(cs.expTimeAttempts, 'hours');
    }
    if (moment() > moment(req.session.loginPasswordAttemptsExp)) {
      req.session.loginPasswordAttempts = 1;
      req.session.loginPasswordAttemptsExp = moment().add(cs.expTimeAttempts, 'hours');
    }
    if (req.session.loginPasswordAttempts > 10) {
      ServerMessage.error(res, 401, 'You have exceeded the number of attempts');
    } else {
      req.session.loginPasswordAttempts++;
      let _data = req.body.data;
      new Promise((resolve, reject) => {
        User.findOne({email: _data.email}, (err, user) => {
          if (err) {
            ServerMessage.error(res, 500, 'Mongo database error');
            reject();
          }
          if (!user) {
            ServerMessage.error(res, 401, 'Email not found');
            reject();
          } else {
            user.checkPassword(_data.password).then((result) => {
              if (!result) {
                ServerMessage.error(res, 401, "Password didn't match");
                reject();
              } else {
                delete _data.email;
                delete _data.password;
                resolve(user);
              }
            }).catch((err) => {
              console.error(err);
            });
          }
        });
      }).then((user:any) => {
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
        console.error(err);
      });
    }
  }
}