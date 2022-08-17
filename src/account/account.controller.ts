import { Request, Response } from 'express'
import AccountService from "./account.service";
import PaymentService from '../payment/payment.service';
import httpCodes from "../common/httpCodes";

class AccountController {

    async getAccountDetails(req: Request, res: Response) {
        const { account_number } = req.user

        let resp = await AccountService.fetchAccountByNumber(account_number)

        res.status(httpCodes.OK).json(resp)
    }

    async getAccountTransfers(req: Request, res: Response) {
        const { account_number } = req.user

        const resp = await AccountService.fetchAccountTransfers(account_number)

        res.status(httpCodes.OK).json(resp)
    }

    async getAccountWithdrawals(req: Request, res: Response) {
        const { account_number } = req.user

        const resp = await AccountService.fetchAccountWithdrawals(account_number)

        res.status(httpCodes.OK).json(resp)
    }

    async getAccountDeposits(req: Request, res: Response) {
        const { account_number } = req.user

        const resp = await AccountService.fetchAccountDeposits(account_number)

        res.status(httpCodes.OK).json(resp)
    }

    async transferFundsToUser(req: Request, res: Response) {
        const {
            from_account_number,
            to_account_number,
            amount
        } = req.body

        const resp = await AccountService.transferToAccount({ from_account_number, to_account_number, amount })
        res.status(httpCodes.CREATED).json(resp)
    }

    async fundAccount(req: Request, res: Response) {
        const { payment_reference, username, account_number } = req.body

        const valid_payment = await PaymentService.verifyPayment(payment_reference)
        if (!valid_payment) {
            throw new Error("Payment is invalid. Check Payment reference")
        }

        const payment = await PaymentService.addPayment(valid_payment, username)
        const { updated_account } = await AccountService.depositIntoAccount({ account_number, amount: payment.amount })

        res.status(httpCodes.CREATED).json({ payment, updated_account })
    }

    async wihtdrawFunds(req: Request, res: Response) {
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