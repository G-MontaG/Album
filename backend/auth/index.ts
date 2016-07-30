import _ = require('lodash');

import {routerConfiguration, handlerFunction} from "../routerConfiguration";
export const authRouter = require('express').Router();

import {loginHandler} from './login';

export class AuthController {
  constructor(public configurations: Array<routerConfiguration>,
  public login: handlerFunction) {
    this.login = loginHandler;

    this.configurations = [
      {type: 'post', route: '/login', handler: this.login},
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