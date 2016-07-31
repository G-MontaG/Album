import express = require('express');
import { RequestWithAuthSession } from "./requestSession";
export declare function googleCodeHandler(req: express.Request, res: express.Response, next: express.NextFunction): void;
export declare function googleTokenHandler(req: RequestWithAuthSession, res: express.Response, next: express.NextFunction): void;
export declare function googleUserHandler(req: RequestWithAuthSession, res: express.Response, next: express.NextFunction): void;
