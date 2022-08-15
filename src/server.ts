import * as http from 'http';
import config from './config/app';
import App from './app';
import debug from 'debug';

const { app, routes } = App()

const debugLog: debug.IDebugger = debug('app');
const server: http.Server = http.createServer(app);
const port = config.port;

server.listen(port, () => {
    routes.forEach((route) => {
        debugLog(`Configuring..Route: ${route.getName()}`);
        route.configureRoutes()
    })
    console.log(`Server running on port: ${port}`);
});