import { Request, Response, NextFunction } from 'express'
import AccountService from "./account.service";
import PaymentService from '../payment/payment.service';
import httpCodes from "../common/httpCodes";

class AccountController {

    async getAllAccounts(req: Request, res: Response, next: NextFunction) {
        let accounts = await AccountService.fetchAllAccounts()

        res.status(httpCodes.OK).json(accounts)
    }

    async getAccountDetails(req: Request, res: Response, next: NextFunction) {
        const { account_number } = req.user

        let resp = await AccountService.fetchAccountByNumber(account_number)
        if (!resp) next(new Error("Invalid Account number"))

        res.status(httpCodes.OK).json(resp)
    }

    async getAccountTransfers(req: Request, res: Response, next: NextFunction) {
        const { account_number } = req.user

        const transfers = await AccountService.fetchAccountTransfers(account_number)

        res.status(httpCodes.OK).json({ transfers })
    }

    async getAccountWithdrawals(req: Request, res: Response, next: NextFunction) {
        const { account_number } = req.user

        const withdrawals = await AccountService.fetchAccountWithdrawals(account_number)

        res.status(httpCodes.OK).json({ withdrawals })
    }

    async getAccountDeposits(req: Request, res: Response, next: NextFunction) {
        const { account_number } = req.user

        const deposits = await AccountService.fetchAccountDeposits(account_number)

        res.status(httpCodes.OK).json({ deposits })
    }

    async transferFundsToUser(req: Request, res: Response, next: NextFunction) {
        const {
            from_account_number,
            to_account_number,
            amount
        } = req.body

        const resp = await AccountService.transferToAccount({ from_account_number, to_account_number, amount })
        if (resp?.error) next(new Error(resp?.error))

        res.status(httpCodes.CREATED).json(resp)
    }

    async fundAccount(req: Request, res: Response, next: NextFunction) {
        const { payment_reference, username, account_number } = req.body

        const valid_payment = await PaymentService.verifyPayment(payment_reference)
        if (!valid_payment) {
            throw new Error("Payment is invalid. Check Payment reference")
        }

        const payment = await PaymentService.addPayment(valid_payment, username)
        const { updated_account } = await AccountService.depositIntoAccount({ account_number, amount: payment.amount })

        res.status(httpCodes.CREATED).json({ payment, updated_account })
    }

    async adminFundAccount(req: Request, res: Response, next: NextFunction) {
        const { account_number, amount } = req.body
        const depositResponse = await AccountService.depositIntoAccount({ account_number, amount })

        res.status(httpCodes.CREATED).json(depositResponse)
    }

    async wihtdrawFunds(req: Request, res: Response, next: NextFunction) {
        const { bank_account_number, bank_code, amount, account_number } = req.body

        const withdrawal_resp = await AccountService.withdrawFromAccount({ amount, account_number })
        if (!withdrawal_resp) {
            throw new Error("Funds withdrawal from account failed")
        }

        const transfer = await PaymentService.bankTransfer({ bank_account_number, bank_code })
        if (transfer.status != 'success') {
            throw new Error("Transfer to bank account failed")
        }

        res.status(httpCodes.CREATED).json({ transfer, withdrawal: withdrawal_resp })
    }
}

export default new AccountController();