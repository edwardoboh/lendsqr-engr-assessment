import express from 'express';
import { CommonRoutesConfig } from "../common";

export class AuthRoutes extends CommonRoutesConfig {
    constructor(router: express.Router) {
        super(router, 'AuthRoute');
    }

    configureRoutes(): express.Router {
        this.router
            .route('/whoami')
            .get()

        this.router
            .route('/login')
            .post()

        this.router
            .route('/signup')
            .post()

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