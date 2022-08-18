import * as dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/../.env' });

import config from './config/app';
import express from 'express';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';

import { CommonRoutesConfig } from './common/common.routes.config';
import { AuthRoutes } from './auth/auth.routes.config';
import { UserRoutes } from './users/user.routes.config';
import { AccountRoutes } from './account/account.routes.config';
import { TransactionRoute } from './transaction/transaction.route.config';
import commonAuthMiddleware from './common/middleware/common.auth.middleware';

export default function App() {

    const app: express.Application = express();
    const router = express.Router()
    const routes: Array<CommonRoutesConfig> = [
        new AuthRoutes(router),
        new UserRoutes(router),
        new AccountRoutes(router),
        new TransactionRoute(router)
    ];

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
    app.use(
        commonAuthMiddleware.tokenVerifyWrapper(
            commonAuthMiddleware.dataFromToken
        ))
    app.use(config.prefix, router);

    app.get('/', (request: express.Request, response: express.Response) => {
        response.send("Server Healthy");
    });

    return {
        app,
        routes
    }
}
