import express = require('express');
import { RequestWithAuthSession } from "./requestSession";
export declare function verifyEmailTokenHandler(req: RequestWithAuthSession, res: express.Response): void;
