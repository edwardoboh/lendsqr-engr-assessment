import { Request, Response, NextFunction } from 'express'

class CommonAuthMiddleware {
    dataFromToken(req: Request, res: Response, next: NextFunction) {
        // This function to be implemeted later if time permits
        console.log("Token Tada!!")
        const token = req.headers.authorization?.split(' ')[1]
        const tokenValid = true;
        if (tokenValid) {
            req.user = {
                id: 1,
                username: "edwardoboh",
                email: "obohedwardoboh",
                account_number: "6152321298"
            }

            next();
        }
        throw new Error('Invalid Token string')
    }
}

export default new CommonAuthMiddleware()