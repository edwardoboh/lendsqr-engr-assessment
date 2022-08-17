import express from 'express';
import { CommonRoutesConfig } from "../common";
import AuthController from './auth.controller'
import commonAuthMiddleware from '../common/middleware/common.auth.middleware';
import AuthMiddleware from './middleware/auth.middleware';

export class AuthRoutes extends CommonRoutesConfig {
    constructor(router: express.Router) {
        super(router, 'AuthRoute');
    }

    configureRoutes(): express.Router {
        this.router
            .route('/whoami')
            .get([
                commonAuthMiddleware.dataFromToken,
                AuthController.whoIsUser
            ])

        this.router
            .route('/login')
            .post([
                AuthMiddleware.validateUserLogin,
                AuthController.loginUser
            ])

        this.router
            .route('/signup')
            .post([
                AuthMiddleware.validateUserRegister,
                AuthMiddleware.validateUniqueEmailAndUsername,
                AuthController.signupUser
            ])

        this.router
            .route('pin')
            .all()
            .get()
            .post()
            .patch()

        this.router
            .route('forgot-password')
            .post()

        this.router
            .route('reset-password')
            .post()

        return this.router;
    }
}