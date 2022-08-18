import { CommonRoutesConfig } from "../common/common.routes.config";
import { Router } from 'express'
import TransactionController from "./transaction.controller";

export class TransactionRoute extends CommonRoutesConfig {
    constructor(router: Router) {
        super(router, 'TransactionRoute')
    }

    configureRoutes(): Router {
        this.router
            .route('/transactions')
            .get(TransactionController.getAccountTransactions)

        return this.router
    }
}