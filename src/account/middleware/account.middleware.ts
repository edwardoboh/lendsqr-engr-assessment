import { Request, Response, NextFunction } from 'express'
class AccountMiddleware {
    validateAccountTransfer(req: Request, res: Response, next: NextFunction) {
        // Function to validate request body
        const error = false
        if (error) {
            throw new Error("Error in request body")
        } else {
            next()
        }
    }

    validateFundAccount(req: Request, res: Response, next: NextFunction) {
        // Ensure request body has a 'payment_reference' field and nothing else
        const error = false
        if (error) {
            throw new Error("Error in request body")
        } else {
            req.body['username'] = req.user.username;
            req.body['account_number'] = req.user.account_number;

            next()
        }
    }

    validateAccountWithdrawal(req: Request, res: Response, next: NextFunction) {
        // Ensure request body has:
        // { bank_account_number, bank_code, amount }
        const error = false
        if (error) {
            throw new Error("Error in request body")
        } else {
            req.body['account_number'] = req.user.account_number;

            next()
        }
    }
}

export default new AccountMiddleware();