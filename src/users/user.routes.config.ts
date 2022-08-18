import express from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config'
import UsersController from './users.controller';

export class UserRoutes extends CommonRoutesConfig {
    constructor(router: express.Router) {
        super(router, 'UserRoute');
    }

    configureRoutes(): express.Router {

        this.router
            .route('/users/:userId')
            .get([UsersController.getUserById])

        this.router
            .route('/users')
            .get([UsersController.getAllUsers])
            .post([UsersController.createUser])

        return this.router;
    }
}