import * as dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/../.env' });

import config from './config/app';
import express from 'express';
import * as http from 'http';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import debug from 'debug';

import { CommonRoutesConfig } from './common';
import { UserRoutes } from './users/user.routes.config';

const app: express.Application = express();
const router = express.Router()
const server: http.Server = http.createServer(app);
const port = config.port;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

app.use(express.json());
app.use(cors());

const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    )
}

if (config.debug) { loggerOptions.meta = false }

app.use(expressWinston.logger(loggerOptions));
app.use(config.prefix, router);

app.get('/', (request: express.Request, response: express.Response) => {
    response.send("Server Healthy");
});

routes.push(new UserRoutes(router));

server.listen(port, () => {
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Configuring..Route: ${route.getName()}`);
        route.configureRoutes()
    })
    console.log(`Server running on port: ${port}`);
});