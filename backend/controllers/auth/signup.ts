import express = require('express');
import moment = require('moment');
import jwt = require('jsonwebtoken');

import * as cs from './constants';
const User = require('../../model/user');
import {ServerMessage} from '../../helpers/serverMessage';

export function signupLocalHandler(req:express.Request, res:express.Response) {
  req.checkBody('data.profile.firstname', 'Firstname cannot be blank').notEmpty();
  req.checkBody('data.profile.lastname', 'Lastname cannot be blank').notEmpty();
  req.checkBody('data.email', 'Email is not valid').isEmail();
  req.checkBody('data.password', 'Password cannot be blank').notEmpty();
  req.checkBody('data.password', `Password length must be from ${cs.passwordMinLength} to ${cs.passwordMaxLength}`)
    .len(cs.passwordMinLength, cs.passwordMaxLength);

  let errors = req.validationErrors();
  if (errors) {
    ServerMessage.error(res, 401, errors[0].msg);
  } else {
    let _data = req.body.data;
    new Promise((resolve, reject) => {
      User.findOne({email: _data.email}, (err, user) => {
        if (err) {
          ServerMessage.error(res, 500, 'Mongo database error');
          reject(err);
        }
        if (user) {
          ServerMessage.error(res, 401, 'Email is already in use');
          reject();
        } else {
          let newUser = new User(_data);
          delete _data.email;
          delete _data.password;
          cs.generateEmailToken(newUser, 'verify');
          newUser.cryptPassword().then(() => {
            newUser.save((err, user) => {
              if (err) {
                ServerMessage.error(res, 500, 'Mongo database error');
                reject();
              }
              let mailOptions = {
                to: user.email,
                from: 'arthur.osipenko@gmail.com',
                subject: 'Hello on XXX',
                text: `Hello. This is a token for your account 
                ${user.emailVerifyToken.value.slice(0, cs.emailTokenLength / 2)} ${user.emailVerifyToken.value.slice(cs.emailTokenLength / 2, cs.emailTokenLength)}
                Please go back and enter it in your profile to verify your email.`
              };
              cs.transporter.sendMail(mailOptions, function (err) {
                if (err) {
                  ServerMessage.error(res, 500, 'Send email error');
                  reject();
                }
                resolve();
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
              console.error(err);
            });
          });
        }
      });
    }).catch((err) => {
      console.error(err);
    });
  }
}