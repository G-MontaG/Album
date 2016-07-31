import express = require('express');
import { RequestWithAuthSession } from "./requestSession";
export declare function resetPasswordHandler(req: RequestWithAuthSession, res: express.Response, next: express.NextFunction): void;
