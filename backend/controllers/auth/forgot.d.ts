import express = require('express');
import { RequestWithAuthSession } from "./requestSession";
export declare function forgotPasswordEmailHandler(req: express.Request, res: express.Response): void;
export declare function forgotPasswordTokenHandler(req: RequestWithAuthSession, res: express.Response): void;
export declare function forgotPasswordNewPasswordHandler(req: RequestWithAuthSession, res: express.Response): void;
