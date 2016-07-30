import express = require('express');

const moment = require('moment');
const jwt = require('jsonwebtoken');

export function loginHandler(req:express.Request, res:express.Response) {
  res.send({
    message: 'work',
  });
}