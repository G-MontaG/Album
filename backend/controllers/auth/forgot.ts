import express = require('express');

import moment = require('moment');
import jwt = require('jsonwebtoken');

import * as cs from './constants';
const User = require('../../model/user');
import {ServerMessage} from '../../helpers/serverMessage';

export function forgotPasswordEmailHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
  req.checkBody('data.email', 'Email is not valid').isEmail();

  let errors = req.validationErrors();
  if (errors) {
    ServerMessage.error(next, 401, errors[0].msg);
  } else {
    let _data = req.body.data;
    new Promise((resolve, reject) => {
      User.findOne({email: _data.email}, (err, user) => {
        if (err) {
          ServerMessage.error(next, 500, 'Mongo database error');
          reject(err);
        }
        if (!user) {
          ServerMessage.error(next, 401, 'Email not found');
          reject();
        } else {
          cs.generateEmailToken(user, 'forgot');
          user.save((err) => {
            if (err) {
              ServerMessage.error(next, 500, 'Mongo database error');
              reject(err);
            }
            let mailOptions = {
              to: user.email,
              from: 'arthur.osipenko@gmail.com',
              subject: 'Forgot password',
              text: `Hello. This is a token for your account 
              ${user.forgotPasswordToken.value.slice(0, cs.emailTokenLength / 2)} ${user.forgotPasswordToken.value.slice(cs.emailTokenLength / 2, cs.emailTokenLength)}
              Please go back and enter it in forgot password form.`
            };
            cs.transporter.sendMail(mailOptions, function (err) {
              if (err) {
                ServerMessage.error(next, 500, 'Send email error');
                reject(err);
              }
              ServerMessage.message(res, 200, {message: 'Token has been sent', flag: true});
              resolve();
            });
          }).catch((err) => {
            console.error(err);
          });
        }
      });
    }).catch((err) => {
      console.error(err);
    });
  }
}

export function forgotPasswordTokenHandler(req, res, next) {
  req.checkBody('data.token', 'Token cannot be blank').notEmpty();
  req.checkBody('data.token', `Token length must be ${cs.emailTokenLength} digits`).len(cs.emailTokenLength, cs.emailTokenLength);

  let errors = req.validationErrors();
  if (errors) {
    ServerMessage.error(next, 401, errors[0].msg);
  } else {
    if (!req.session.forgotTokentAttempts || !req.session.forgotTokentAttemptsExp) {
      req.session.forgotTokentAttempts = 1;
      req.session.forgotTokentAttemptsExp = moment().add(cs.expTimeAttempts, 'hours');
    }
    if (moment() > moment(req.session.forgotTokentAttemptsExp)) {
      req.session.forgotTokentAttempts = 1;
      req.session.forgotTokentAttemptsExp = moment().add(cs.expTimeAttempts, 'hours');
    }
    if (req.session.forgotTokentAttempts > 3) {
      ServerMessage.error(next, 401, 'You have exceeded the number of attempts');
    } else {
      req.session.forgotTokentAttempts++;
      let _data = req.body.data;
      new Promise((resolve, reject) => {
        User.findOne({'forgotPasswordToken.value': _data.token}, (err, user) => {
          if (err) {
            ServerMessage.error(next, 500, 'Mongo database error');
            reject(err);
          }
          if (!user) {
            ServerMessage.error(next, 401, 'Token not found');
            reject();
          } else if (moment() > user.forgotPasswordToken.exp) {
            ServerMessage.error(next, 401, 'Token has expired');
            reject();
          } else {
            user.forgotPasswordToken = undefined;
            user.save((err) => {
              if (err) {
                ServerMessage.error(next, 500, 'Mongo database error');
                reject(err);
              }
              let _token = jwt.sign({
                id: user._id,
                'user-agent': req.headers['user-agent']
              }, process.env.JWT_SECRET, {
                algorithm: cs.tokenAlg,
                expiresIn: `${cs.tokenExp}d`,
                jwtid: process.env.JWT_ID
              });
              ServerMessage.message(res, 200, {message: 'Token is valid', flag: true, token: _token});
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

export function forgotPasswordNewPasswordHandler(req, res, next) {
  req.checkBody('data.password', 'Password cannot be blank').notEmpty();
  req.checkBody('data.password', `Password length must be from ${cs.passwordMinLength} to ${cs.passwordMaxLength}`)
    .len(cs.passwordMinLength, cs.passwordMaxLength);

  let errors = req.validationErrors();
  if (errors) {
    ServerMessage.error(next, 401, errors[0].msg);
  } else {
    let _data = req.body.data;
    new Promise((resolve, reject) => {
      User.findOne({_id: req.userId}, (err, user) => {
        if (err) {
          ServerMessage.error(next, 500, 'Mongo database error');
          reject(err);
        }
        if (!user) {
          ServerMessage.error(next, 401, 'User not found');
          reject();
        } else {
          user.password = _data.password;
          delete _data.password;
          user.cryptPassword().then(() => {
            user.save((err) => {
              if (err) {
                ServerMessage.error(next, 500, 'Mongo database error');
                reject(err);
              }
              ServerMessage.message(res, 200, {message: 'Password has been changed', flag: true});
              resolve();
            });
          }).catch((err) => {
            console.error(err);
          });
        }
      });
    }).catch((err) => {
      console.error(err);
    });
  }
}
