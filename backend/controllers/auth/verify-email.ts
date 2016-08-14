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
      User.findOne({'emailVerifyToken.value': _data.token}).exec().then((user) => {
        if (!user) {
          let err: ServerError = new Error("Token not found");
          err.status = 401;
          throw err;
        } else if (moment() > user.forgotPasswordToken.exp) {
          let err: ServerError = new Error("Token has expired");
          err.status = 401;
          throw err;
        } else {
          user.emailVerifyToken = undefined;
          user.emailConfirmed = true;
          return user.save();
        }
      }).then(() => {
        ServerMessage.message(res, 200, {message: 'Email is confirmed', flag: true});
      }).catch((err) => {
        ServerMessage.error(req, res, err.status || 500, err.message || 'Mongo database find token error');
        return err;
      });
    }
  }
}