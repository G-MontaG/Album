import express = require('express');
import { RequestWithUserId } from "./requestSession";
export declare function checkToken(req: RequestWithUserId, res: express.Response, next: express.NextFunction): void;
