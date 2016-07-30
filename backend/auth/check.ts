'use strict';

const jwt = require('jsonwebtoken');

const helper = require('../../../backend/helpers/serverMessage');

export function checkToken (req, res, next) {
  if (!req.get('Authorization')) {
    helper.error(next, 401, 'Token is undefined');
  }
  jwt.verify(req.get('Authorization').split(' ')[1], process.env.JWT_SECRET, {
    jwtid: process.env.JWT_ID
  }, (err, payload) => {
    if (err) {
      helper.error(next, 401, 'Invalid token');
    } else if (payload['user-agent'] !== req.headers['user-agent']) {
      helper.error(next, 401, "Invalid token. User agent doesn't match");
    } else {
      req.userId = payload.id;
      next();
    }
  });
}
