import https = require('https');
import express = require('express');
import moment = require('moment');

import {ServerMessage} from '../../helpers/serverMessage';

export function dashboardHandler(req: express.Request, res: express.Response) {
  res.send({data: "fgdfgh"});
}