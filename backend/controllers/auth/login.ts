import express = require('express');
import moment = require('moment');
import jwt = require('jsonwebtoken');

import * as cs from './constants';
const User = require('../../model/user');
import {ServerMessage} from '../../helpers/serverMessage';
import {RequestWithAuthSession} from "./requestSession";
import {UserType} from "../../model/user";

export function loginHandler(req: RequestWithAuthSession, res: express.Response) {
  req.checkBody('data.email', 'Email is not valid').isEmail();
  req.checkBody('data.password', 'Password cannot be blank').notEmpty();
  req.checkBody('data.password', `Password length must be from ${cs.passwordMinLength} to ${cs.passwordMaxLength}`)
    .len(cs.passwordMinLength, cs.passwordMaxLength);

  let errors = req.validationErrors();
  if (errors) {
    ServerMessage.error(req, res, 401, errors[0].msg);
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
      ServerMessage.error(req, res, 401, 'You have exceeded the number of attempts');
    } else {
      req.session.loginPasswordAttempts++;
      let _data = req.body.data;
      let currentUser: UserType;
      User.findOne({email: _data.email}).exec().then((user) => {
        if (!user) {
          let err:ServerError = new Error('Email not found');
          err.status = 401;
          throw err;
        } else {
          currentUser = user;
          return user.checkPassword(_data.password);
        }
      }).then((result) => {
        if (!result) {
          let err:ServerError = new Error("Password didn't match");
          err.status = 401;
          throw err;
        } else {
          delete _data.email;
          delete _data.password;
        }
      }).then(() => {
        let _token = jwt.sign({
          id: currentUser._id,
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
  }
}