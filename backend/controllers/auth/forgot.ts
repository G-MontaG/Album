import express = require('express');

import moment = require('moment');
import jwt = require('jsonwebtoken');

import * as cs from './constants';
const User = require('../../model/user');
import {UserType} from '../../model/user';
import {ServerMessage} from '../../helpers/serverMessage';
import {RequestWithAuthSession, AuthData} from "./requestSession";

export function forgotPasswordEmailHandler(req: express.Request, res: express.Response) {
  req.checkBody('data.email', 'Email is not valid').isEmail();

  let errors = req.validationErrors();
  if (errors) {
    ServerMessage.error(req, res, 401, errors[0].msg);
  } else {
    let _data = req.body.data;
    let currentUser: UserType;
    User.findOne({email: _data.email}).exec().then((user) => {
      if (!user) {
        let err: ServerError = new Error("Email not found");
        err.status = 401;
        throw err;
      } else {
        cs.generateEmailToken(user, 'forgot');
        currentUser = user;
        return currentUser.save();
      }
    }).then(() => {
      let mailOptions = {
        to: currentUser.email,
        from: 'arthur.osipenko@gmail.com',
        subject: 'Forgot password',
        text: `Hello. This is a token for your account 
              ${currentUser.forgotPasswordToken.value.slice(0, cs.emailTokenLength / 2)} ${currentUser.forgotPasswordToken.value.slice(cs.emailTokenLength / 2, cs.emailTokenLength)}
              Please go back and enter it in forgot password form.`
      };
      cs.transporter.sendMail(mailOptions, function (err) {
        if (err) {
          let err: ServerError = new Error("Send email error");
          err.status = 500;
          throw err;
        }
        ServerMessage.message(res, 200, {message: 'Token has been sent', flag: true});
      });
    }).catch((err) => {
      ServerMessage.error(req, res, err.status || 500, err.message || 'Mongo database find user error');
      return err;
    });
  }
}

export function forgotPasswordTokenHandler(req: RequestWithAuthSession, res: express.Response) {
  req.checkBody('data.token', 'Token cannot be blank').notEmpty();
  req.checkBody('data.token', `Token length must be ${cs.emailTokenLength} digits`).len(cs.emailTokenLength, cs.emailTokenLength);

  let errors = req.validationErrors();
  if (errors) {
    ServerMessage.error(req, res, 401, errors[0].msg);
  } else {
    if (!req.session.forgotTokenAttempts || !req.session.forgotTokenAttemptsExp) {
      req.session.forgotTokenAttempts = 1;
      req.session.forgotTokenAttemptsExp = moment().add(cs.expTimeAttempts, 'hours');
    }
    if (moment() > moment(req.session.forgotTokenAttemptsExp)) {
      req.session.forgotTokenAttempts = 1;
      req.session.forgotTokenAttemptsExp = moment().add(cs.expTimeAttempts, 'hours');
    }
    if (req.session.forgotTokenAttempts > 3) {
      ServerMessage.error(req, res, 401, 'You have exceeded the number of attempts');
    } else {
      req.session.forgotTokenAttempts++;
      let _data = req.body.data;
      User.findOne({'forgotPasswordToken.value': _data.token}).exec().then((user) => {
        if (!user) {
          let err: ServerError = new Error("Token not found");
          err.status = 401;
          throw err;
        } else if (moment() > user.forgotPasswordToken.exp) {
          let err: ServerError = new Error("Token has expired");
          err.status = 401;
          throw err;
        } else {
          delete user.forgotPasswordToken;
          return user.save();
        }
      }).then((user) => {
        let _token = jwt.sign({
          id: user._id,
          'user-agent': req.headers['user-agent']
        }, process.env.JWT_SECRET, {
          algorithm: cs.tokenAlg,
          expiresIn: `${cs.tokenExp}d`,
          jwtid: process.env.JWT_ID
        });
        ServerMessage.message(res, 200, {message: 'Token is valid', flag: true, token: _token});
      }).catch((err) => {
        ServerMessage.error(req, res, err.status || 500, err.message || 'Mongo database find user error');
        return err;
      });
    }
  }
}

export function forgotPasswordNewPasswordHandler(req: RequestWithAuthSession, res: express.Response) {
  req.checkBody('data.password', 'Password cannot be blank').notEmpty();
  req.checkBody('data.password', `Password length must be from ${cs.passwordMinLength} to ${cs.passwordMaxLength}`)
    .len(cs.passwordMinLength, cs.passwordMaxLength);

  let errors = req.validationErrors();
  if (errors) {
    ServerMessage.error(req, res, 401, errors[0].msg);
  } else {
    let _data = req.body.data;
    let currentUser: UserType;
    User.findOne({_id: req.userId}).exec().then((user) => {
      if (!user) {
        let err: ServerError = new Error("User not found");
        err.status = 401;
        throw err;
      } else {
        user.password = _data.password;
        delete _data.password;
        currentUser = user;
        return user.cryptPassword();
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
