import express from "express";
import { CommonRoutesConfig } from "../common";
import CommonAuthMiddleware from "../common/middleware/common.auth.middleware";
import AccountController from './account.controller';
import AccountMiddleware from "./middleware/account.middleware";

export class AccountRoutes extends CommonRoutesConfig {
    constructor(router: express.Router) {
        super(router, 'AccountRoutes');
    }

    configureRoutes(): express.Router {
        this.router
            .route('/accounts')
            .all(CommonAuthMiddleware.dataFromToken)
            .get([
                AccountController.getAccountDetails
            ])

        this.router
            .route('/transfers')
            .get([AccountController.getAccountTransfers])
            .post([
                AccountMiddleware.validateAccountTransfer,
                AccountController.transferFundsToUser
            ])

        this.router
            .route('/deposits')
            .get(AccountController.getAccountDeposits)
            .post([
                AccountMiddleware.validateFundAccount,
                AccountController.fundAccount
            ])

        this.router
            .route('/withdrawals')
            .get(AccountController.getAccountWithdrawals)
            .post([
                AccountMiddleware.validateAccountWithdrawal,
                AccountController.wihtdrawFunds
            ])

        return this.router
    }
}