import _ = require('lodash');

import {RouterConfiguration, handlerFunction, middlewareFunction} from "../../routerConfiguration";
export let apiRouter = require('express').Router();

import {checkToken} from '../auth/check';
import {dashboardHandler} from './dashboard';

export class ApiController {
  public configurations:Array<RouterConfiguration>;
  public checkToken:middlewareFunction;
  private dashboard:handlerFunction;

  constructor() {
    this.checkToken = checkToken;
    this.dashboard = dashboardHandler;

    this.configurations = [
      {
        type: 'get', route: '/dashboard', handler: this.dashboard,
        middleware: [this.checkToken]
      }
    ];

    _.forEach(this.configurations, (c) => {
      if (c.middleware) {
        apiRouter[c.type](c.route, c.middleware, c.handler);
      } else {
        apiRouter[c.type](c.route, c.handler);
      }
    });
  }
}

export const apiController = new ApiController();