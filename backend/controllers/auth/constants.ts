'use strict';

import moment = require('moment');
import crypto = require('crypto');

import nodemailer = require('nodemailer');

export const passwordMinLength = 8;
export const passwordMaxLength = 30;

export const tokenAlg = 'HS512';
export const tokenExp = 7; // days

export const emailTokenLength = 8; // целое число или допиши округление в postForgotPasswordEmail
export const emailTokenExp = 0.5; //hours

export const expTimeAttempts = 1; //hours

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  debug: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

export function generateEmailToken(user, type) {
  if (type === 'forgot') {
    user.forgotPasswordToken.value = crypto.randomBytes(64).toString('base64').slice(0, emailTokenLength);
    user.forgotPasswordToken.exp = moment().add(emailTokenExp, 'hours');
    return user.forgotPasswordToken.value;
  } else if (type === 'reset') {
    user.passwordResetToken.value = crypto.randomBytes(64).toString('base64').slice(0, emailTokenLength);
    user.passwordResetToken.exp = moment().add(emailTokenExp, 'hours');
    return user.passwordResetToken.value;
  } else if (type === 'verify') {
    user.emailVerifyToken.value = crypto.randomBytes(64).toString('base64').slice(0, emailTokenLength);
    user.emailVerifyToken.exp = moment().add(emailTokenExp, 'hours');
    return user.passwordResetToken.value;
  } else {
    return null;
  }
}