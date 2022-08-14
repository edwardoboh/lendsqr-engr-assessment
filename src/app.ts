import * as dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/../.env' });

import config from './config/app';
import express from 'express';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import { CommonRoutesConfig } from './common';
import { UserRoutes } from './users/user.routes.config';

export default function App() {

    const app: express.Application = express();
    const router = express.Router()
    const routes: Array<CommonRoutesConfig> = [];

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

    return {
        app,
        routes
    }
}
