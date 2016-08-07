import express = require('express');

interface RouterConfiguration {
  type:string,
  route:string,
  handler:handlerFunction,
  middleware?:Array<middlewareFunction>
}

interface handlerFunction {
  (req:express.Request, res:express.Response);
}

interface middlewareFunction {
  (req:express.Request, res:express.Response, next:express.NextFunction);
}