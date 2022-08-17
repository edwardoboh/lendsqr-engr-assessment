import { Request, Response, NextFunction } from 'express'

class CommonAuthMiddleware {
    dataFromToken(req: Request, res: Response, next: NextFunction) {
        // This function to be implemeted later if time permits
        console.log("Token Tada!!")
        const token = req.headers.authorization?.split(' ')[1]
        if (token) {
            req.user = {
                id: token.slice(-1),
                username: "sample_username",
                email: "sample@email.com",
                account_number: "6152321298"
            }

            return next();
        }
        throw new Error('Invalid Token string')
    }
}

export default new CommonAuthMiddleware()