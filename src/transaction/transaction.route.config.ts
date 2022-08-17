import { CommonRoutesConfig } from "../common";
import { Router } from 'express'

export class TransactionRoute extends CommonRoutesConfig {
    constructor(router: Router) {
        super(router, 'TransactionRoute')
    }

    configureRoutes(): Router {
        this.router
            .route('/transactions')
            .get()
            .post()

        return this.router
    }
}