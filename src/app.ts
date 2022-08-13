import * as dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/../.env' });

import config from './config'
import express from 'express';
import * as http from 'http';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';

import cors from 'cors';
import debug from 'debug';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = config.port;
const routes: Array<String> = [];
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

if (config.debug) {
    loggerOptions.meta = false;
}

app.use(expressWinston.logger(loggerOptions));
// routes.push[AllRoutes]
app.get('/', (request: express.Request, response: express.Response) => {
    response.send("Server Healthy");
});

server.listen(port, () => {
    // output message for each configured route
    console.log(`Server running on port: ${port}`);
});