import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
class AccountMiddleware {
    validateAccountTransfer(req: Request, res: Response, next: NextFunction) {
        const requestBody = req.body;

        const schema = Joi.object({
            amount: Joi.number().positive().required(),
            pin: Joi.string().required(),
            to_account_number: Joi.string().required(),
        })

        const { error } = schema.validate(requestBody, { abortEarly: false })
        if (error) {
            const errorMessage = error.details.map(detail => detail.message)
            throw new Error(`${errorMessage}`)
        }
        const { account_number } = req.user
        req.body['from_account_number'] = account_number

        next();
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

    validateAdminFundAccount(req: Request, res: Response, next: NextFunction) {
        const requestBody = req.body;

        const schema = Joi.object({
            amount: Joi.number().positive().required(),
            account_number: Joi.string().required(),
        })

        const { error } = schema.validate(requestBody, { abortEarly: false })
        if (error) {
            const errorMessage = error.details.map(detail => detail.message)
            throw new Error(`${errorMessage}`)
        }

        next();
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

    async secureAccountTransfer(req: Request, res: Response, next: NextFunction) {
        // Ensure transfer is intiated by account owner
        const { pin, from_account_number, to_account_number } = req.body
        const { id } = req.user
        // Get user from token
        // Authorize with user pin: To be implemented later

        // user cannot transfer to themselves
        if (from_account_number == to_account_number) {
            next(new Error("You Cannot transfer funds to Yourself"))
        }
        next();

    }
}

export default new AccountMiddleware();