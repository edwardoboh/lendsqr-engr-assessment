import express from "express";
import { CommonRoutesConfig } from "../common";

class AccountRoutes extends CommonRoutesConfig {
    constructor(router: express.Router) {
        super(router, 'AccountRoutes');
    }

    configureRoutes(): express.Router {
        this.router
            .route('/account')
            .get()

        this.router
            .route('/transfer')
            .post()

        this.router
            .route('/deposit')
            .post()

        this.router
            .route('/withdraw')
            .post()

        this.router
            .route('/transactions')
            .get()

        return this.router
    }
}