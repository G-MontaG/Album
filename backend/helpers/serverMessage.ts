import express = require('express');

export class ServerMessage {
  constructor() {

  }

  static error(next: express.NextFunction, status: number, message: string) {
    let _status = status || 500;
    let _message = message || '';
    let err = {
      status: _status,
      message: _message,
      error: new Error(_message)
    };
    next(err);
  };

  static message(res: express.Response, status: number, data: any) {
    let _status = status || 200;
    let _data = data || {};
    let _message = _data.message || '';
    let _params = _data.params;
    let _token = _data.token;
    let _flag = _data.flag;

    res.status(_status);
    res.send({
      message: _message,
      params: _params,
      token: _token,
      flag: _flag
    });
  };

  static data(res: express.Response, status: number, data: any) {
    let _status = status || 200;
    let _data = data || {};
    res.status(_status);
    res.send(_data);
  };
}