import * as http from 'http';
import config from './config/app';
import App from './app';
import debug from 'debug';
import CommonErrorMiddleware from './common/middleware/common.error.middleware';

const { app, routes } = App()

const debugLog: debug.IDebugger = debug('app');
const server: http.Server = http.createServer(app);
const port = config.port;

server.listen(port, () => {
    routes.forEach((route) => {
        debugLog(`Configuring..Route: ${route.getName()}`);
        route.configureRoutes()
    })
    app.use(CommonErrorMiddleware.handleServerError)
    app.use(CommonErrorMiddleware.handleRouteNotFound)
    console.log(`Server running on port: ${port}`);
});