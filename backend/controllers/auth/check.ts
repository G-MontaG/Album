import express = require('express');
const jwt = require('jsonwebtoken');

import {ServerMessage} from '../../helpers/serverMessage';
import {RequestWithUserId} from "./requestSession";

export function checkToken (req: RequestWithUserId, res: express.Response, next: express.NextFunction) {
  if (!req.get('Authorization')) {
    ServerMessage.error(next, 401, 'Token is undefined');
  }
  jwt.verify(req.get('Authorization').split(' ')[1], process.env.JWT_SECRET, {
    jwtid: process.env.JWT_ID
  }, (err, payload) => {
    if (err) {
      ServerMessage.error(next, 401, 'Invalid token');
    } else if (payload['user-agent'] !== req.headers['user-agent']) {
      ServerMessage.error(next, 401, "Invalid token. User agent doesn't match");
    } else {
      req.userId = payload.id;
      next();
    }
  });
}
