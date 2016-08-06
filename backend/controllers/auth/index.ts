import _ = require('lodash');

import {RouterConfiguration, handlerFunction, middlewareFunction} from "../../routerConfiguration";
export let authRouter = require('express').Router();

import {checkToken} from './check';
import {loginHandler} from './login';
import {signupLocalHandler} from './signup';
import {verifyEmailTokenHandler} from './verify-email';
import {forgotPasswordEmailHandler, forgotPasswordTokenHandler, forgotPasswordNewPasswordHandler} from './forgot';
import {resetPasswordHandler} from './reset';

import {facebookCodeHandler, facebookTokenHandler, facebookUserHandler} from './facebook';
import {googleCodeHandler, googleTokenHandler, googleUserHandler} from './google';

export class AuthController {
  public configurations:Array<RouterConfiguration>;
  public checkToken:middlewareFunction;
  private login:handlerFunction;
  private signupLocal:handlerFunction;
  private verifyEmailToken:handlerFunction;
  private forgotPasswordEmail:handlerFunction;
  private forgotPasswordToken:handlerFunction;
  private forgotPasswordNewPassword:handlerFunction;
  private resetPassword:handlerFunction;

  private facebookCode:handlerFunction;
  private facebookToken:handlerFunction;
  private facebookUser:handlerFunction;

  private googleCode:handlerFunction;
  private googleToken:handlerFunction;
  private googleUser:handlerFunction;

  constructor() {
    this.checkToken = checkToken;
    this.login = loginHandler;
    this.signupLocal = signupLocalHandler;
    this.verifyEmailToken = verifyEmailTokenHandler;
    this.forgotPasswordEmail = forgotPasswordEmailHandler;
    this.forgotPasswordToken = forgotPasswordTokenHandler;
    this.forgotPasswordNewPassword = forgotPasswordNewPasswordHandler;
    this.resetPassword = resetPasswordHandler;

    this.facebookCode = facebookCodeHandler;
    this.facebookToken = facebookTokenHandler;
    this.facebookUser = facebookUserHandler;

    this.googleCode = googleCodeHandler;
    this.googleToken = googleTokenHandler;
    this.googleUser = googleUserHandler;

    this.configurations = [
      {type: 'post', route: '/login', handler: this.login},
      {type: 'post', route: '/signup', handler: this.signupLocal},
      {type: 'post', route: '/forgot-password/email', handler: this.forgotPasswordEmail},
      {type: 'post', route: '/forgot-password/token', handler: this.forgotPasswordToken},
      {
        type: 'post', route: '/forgot-password/new-password', handler: this.forgotPasswordNewPassword,
        middleware: [this.checkToken]
      },
      {
        type: 'post', route: '/reset-password', handler: this.resetPassword,
        middleware: [this.checkToken]
      },
      {
        type: 'post', route: '/verify-email', handler: this.verifyEmailToken,
        middleware: [this.checkToken]
      },
      {type: 'get', route: '/facebook-auth', handler: this.facebookCode},
      {type: 'get', route: '/facebook-auth/response', handler: this.facebookToken},
      {type: 'get', route: '/facebook-auth/user', handler: this.facebookUser},
      {type: 'get', route: '/google-auth', handler: this.googleCode},
      {type: 'get', route: '/google-auth/response', handler: this.googleToken},
      {type: 'get', route: '/google-auth/user', handler: this.googleUser},
    ];

    _.forEach(this.configurations, (c) => {
      if (c.middleware) {
        authRouter[c.type](c.route, c.middleware, c.handler);
      } else {
        authRouter[c.type](c.route, c.handler);
      }
    });
  }
}

export const authController = new AuthController();