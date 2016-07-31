import express = require('express');
import Moment = moment.Moment;

interface RequestWithAuthSession extends express.Request {
  Session?: {
    loginPasswordAttempts?: number,
    loginPasswordAttemptsExp?: Moment
  }
}

interface RequestWithUserId extends express.Request {
  userId?: string
}