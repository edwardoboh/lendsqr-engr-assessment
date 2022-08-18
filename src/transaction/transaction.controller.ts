import { Request, Response, NextFunction } from 'express'
import httpCodes from '../common/httpCodes';
import TransactionService from "./transaction.service";

class TransactionController {
    async getAccountTransactions(req: Request, res: Response, next: NextFunction) {
        const user_id = req.user.id
        const transactions = await TransactionService.fetchAccountTransactions(user_id)
        res.status(httpCodes.OK).json({ transactions })
    }
}

export default new TransactionController();