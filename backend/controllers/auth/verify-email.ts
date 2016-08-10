import express = require('express');
import moment = require('moment');
import jwt = require('jsonwebtoken');

import * as cs from './constants';
const User = require('../../model/user');
import {ServerMessage} from '../../helpers/serverMessage';
import {RequestWithAuthSession} from "./requestSession";

export function verifyEmailTokenHandler(req: RequestWithAuthSession, res: express.Response) {
  req.checkBody('data.token', 'Token cannot be blank').notEmpty();
  req.checkBody('data.token', `Token length must be ${cs.emailTokenLength} digits`)
    .len(cs.emailTokenLength, cs.emailTokenLength);

  let errors = req.validationErrors();
  if (errors) {
    ServerMessage.error(req, res, 401, errors[0].msg);
  } else {
    if (!req.session.verifyTokenAttempts || !req.session.verifyTokenAttemptsExp) {
      req.session.verifyTokenAttempts = 1;
      req.session.verifyTokenAttemptsExp = moment().add(cs.expTimeAttempts, 'hours');
    }
    if (moment() > moment(req.session.verifyTokenAttemptsExp)) {
      req.session.verifyTokenAttempts = 1;
      req.session.verifyTokenAttemptsExp = moment().add(cs.expTimeAttempts, 'hours');
    }
    if (req.session.verifyTokenAttempts > 3) {
      ServerMessage.error(req, res, 401, 'You have exceeded the number of attempts');
    } else {
      req.session.verifyTokenAttempts++;
      let _data = req.body.data;
      new Promise((resolve, reject) => {
        User.findOne({'emailVerifyToken.value': _data.token}, (err, user) => {
          if (err) {
            ServerMessage.error(req, res, 500, 'Mongo database error');
            reject(err);
          }
          if (!user) {
            reject(ServerMessage.error(req, res, 401, 'Token not found'));
          } else if (moment() > user.forgotPasswordToken.exp) {
            reject(ServerMessage.error(req, res, 401, 'Token has expired'));
          } else {
            user.emailVerifyToken = undefined;
            user.emailConfirmed = true;
            user.save((err) => {
              if (err) {
                ServerMessage.error(req, res, 500, 'Mongo database error');
                reject(err);
              }
              ServerMessage.message(res, 200, {message: 'Email is confirmed', flag: true});
              resolve();
            });
          }
        });
      }).catch((err) => {
        console.error(err);
      });
    }
  }
}