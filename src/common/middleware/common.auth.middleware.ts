import { Request, Response, NextFunction } from 'express'
import config from '../../config/app';
import CommonUtil from '../common.util';

class CommonAuthMiddleware {
    dataFromToken(req: Request, res: Response, next: NextFunction) {
        // This function to be implemeted later if time permits
        const token = req.headers.authorization?.split(' ')[1]
        if (token) {
            try {
                let userObj = CommonUtil.verifyToken(token)
                req.user = {
                    id: userObj.id,
                    username: userObj.username,
                    email: userObj.email,
                    account_number: userObj.account_number
                }
                return next();
            } catch (error: any) {
                if (error.name == 'TokenExpiredError') {
                    throw new Error('Token has expired. Try logging in again')
                }
                throw new Error('Invalid Token string')
            }
        }

        next(new Error('Cannot Authorize. No Token string in header'))

    }

    tokenVerifyWrapper(middleware: any) {
        const paths = config.getOpenRoutes()
        return function (req: Request, res: Response, next: NextFunction) {
            console.log(req.url)
            if (paths.includes(req.url)) {
                return next();
            } else {
                return middleware(req, res, next);
            }
        };
    }
}

export default new CommonAuthMiddleware()