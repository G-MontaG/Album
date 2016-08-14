import express = require('express');
import moment = require('moment');
import jwt = require('jsonwebtoken');

import * as cs from './constants';
const User = require('../../model/user');
import {UserType} from '../../model/user';
import {ServerMessage} from '../../helpers/serverMessage';
import {RequestWithAuthSession} from "./requestSession";

export function resetPasswordHandler(req: RequestWithAuthSession, res: express.Response) {
  req.checkBody('data.password', 'Password cannot be blank').notEmpty();
  req.checkBody('data.password', `Password length must be from ${cs.passwordMinLength} to ${cs.passwordMaxLength}`)
    .len(cs.passwordMinLength, cs.passwordMaxLength);
  req.checkBody('data.newPassword', 'New password cannot be blank').notEmpty();
  req.checkBody('data.newPassword', `New password length must be from ${cs.passwordMinLength} to ${cs.passwordMaxLength}`)
    .len(cs.passwordMinLength, cs.passwordMaxLength);

  let errors = req.validationErrors();
  if (errors) {
    ServerMessage.error(req, res, 401, errors[0].msg);
  } else {
    if (!req.session.resetPasswordAttempts || !req.session.resetPasswordAttemptsExp) {
      req.session.resetPasswordAttempts = 1;
      req.session.resetPasswordAttemptsExp = moment().add(cs.expTimeAttempts, 'hours');
    }
    if (moment() > moment(req.session.resetPasswordAttemptsExp)) {
      req.session.resetPasswordAttempts = 1;
      req.session.resetPasswordAttemptsExp = moment().add(cs.expTimeAttempts, 'hours');
    }
    if (req.session.resetPasswordAttempts > 10) {
      ServerMessage.error(req, res, 401, 'You have exceeded the number of attempts');
    } else {
      req.session.resetPasswordAttempts++;
      let _data = req.body.data;
      let currentUser: UserType;
      User.findOne({_id: req.userId}).exec().then((user) => {
        if (!user) {
          let err: ServerError = new Error("User not found");
          err.status = 401;
          throw err;
        } else {
          currentUser = user;
          return currentUser.checkPassword(_data.password);
        }
      }).then((result) => {
        if (!result) {
          let err: ServerError = new Error("Password didn't match");
          err.status = 401;
          throw err;
        } else {
          currentUser.password = _data.newPassword;
          delete _data.password;
          delete _data.newPassword;
          return currentUser.cryptPassword();
        }
      }).then(() => {
        return currentUser.save();
      }).then(() => {
        ServerMessage.message(res, 200, {message: 'Password has been changed', flag: true});
      }).catch((err) => {
        ServerMessage.error(req, res, err.status || 500, err.message || 'Mongo database find user error');
        return err;
      });
    }
  }
}