import express = require('express');
import moment = require('moment');
import jwt = require('jsonwebtoken');

import * as cs from './constants';
const User = require('../../model/user');
import {UserType} from '../../model/user';
import {ServerMessage} from '../../helpers/serverMessage';

export function signupLocalHandler(req: express.Request, res: express.Response) {
  req.checkBody('data.profile.firstname', 'Firstname cannot be blank').notEmpty();
  req.checkBody('data.profile.lastname', 'Lastname cannot be blank').notEmpty();
  req.checkBody('data.email', 'Email is not valid').isEmail();
  req.checkBody('data.password', 'Password cannot be blank').notEmpty();
  req.checkBody('data.password', `Password length must be from ${cs.passwordMinLength} to ${cs.passwordMaxLength}`)
    .len(cs.passwordMinLength, cs.passwordMaxLength);

  let errors = req.validationErrors();
  if (errors) {
    ServerMessage.error(req, res, 401, errors[0].msg);
  }
  else {
    let _data = req.body.data;
    let newUser = new User(_data);
    User.findOne({email: _data.email}).exec().then((user) => {
      if (user) {
        let err: ServerError = new Error("Email is already in use");
        err.status = 401;
        throw err;
      } else {
        delete _data.email;
        delete _data.password;
        cs.generateEmailToken(newUser, 'verify');
        return newUser.cryptPassword();
      }
    }).then(() => {
      return newUser.save().exec();
    }).then((user) => {
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
          let err: ServerError = new Error("Send email error");
          err.status = 500;
          throw err;
        }
      });
    }).then(() => {
      // if you keep in token sensitive info encrypt it before use jwt.sign()
      let _token = jwt.sign({
        id: newUser._id,
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
  }
}