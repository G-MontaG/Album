import express = require('express');
import { RequestWithAuthSession } from "./requestSession";
export declare function checkToken(req: RequestWithAuthSession, res: express.Response, next: express.NextFunction): void;
