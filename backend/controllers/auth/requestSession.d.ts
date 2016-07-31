import express = require('express');
import Moment = moment.Moment;
import Session = Express.Session;

interface RequestWithAuthSession extends express.Request {
  session:SessionForAuth,
  userId?:string
}

interface SessionForAuth extends Session {
  loginPasswordAttempts?:number,
  loginPasswordAttemptsExp?:Moment,
  resetPasswordAttempts?:number,
  resetPasswordAttemptsExp?:Moment,
  verifyTokenAttempts?:number,
  verifyTokenAttemptsExp?:Moment,
  facebookUserData:any,
  googleUserData:any
}

interface AuthData {
  access_token: string,
}