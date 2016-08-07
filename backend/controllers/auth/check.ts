import express = require('express');
const jwt = require('jsonwebtoken');

import {ServerMessage} from '../../helpers/serverMessage';
import {RequestWithAuthSession} from "./requestSession";

export function checkToken (req: RequestWithAuthSession, res: express.Response, next: express.NextFunction) {
  if (!req.get('Authorization')) {
    ServerMessage.error(res, 401, 'Token is undefined');
  }
  jwt.verify(req.get('Authorization').split(' ')[1], process.env.JWT_SECRET, {
    jwtid: process.env.JWT_ID
  }, (err, payload) => {
    if (err) {
      ServerMessage.error(res, 401, 'Invalid token');
    } else if (payload['user-agent'] !== req.headers['user-agent']) {
      ServerMessage.error(res, 401, "Invalid token. User agent doesn't match");
    } else {
      req.userId = payload.id;
      next();
    }
  });
}
