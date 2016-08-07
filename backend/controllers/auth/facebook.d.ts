import express = require('express');
import { RequestWithAuthSession } from "./requestSession";
export declare function facebookCodeHandler(req: express.Request, res: express.Response): void;
export declare function facebookTokenHandler(req: RequestWithAuthSession, res: express.Response): void;
export declare function facebookUserHandler(req: RequestWithAuthSession, res: express.Response): void;
