import { NextFunction, Request, Response } from 'express';
import AuthService from './auth.service'
import httpCodes from '../common/httpCodes';
class AuthController {

    async loginUser(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body
        const resp = await AuthService.login({ email, password })
        if (!resp) return next(new Error("Invalid login credentials"))
        res.status(httpCodes.OK).json(resp)
    }

    async signupUser(req: Request, res: Response, next: NextFunction) {
        const newUser = req.body
        const resp = await AuthService.register(newUser)
        res.status(httpCodes.CREATED).json(resp)
    }

    async whoIsUser(req: Request, res: Response, next: NextFunction) {
        const { id: userId } = req.user
        const resp = await AuthService.whoami(userId)
        if (!resp) next(new Error('User not found'))
        res.status(httpCodes.OK).json(resp)
    }

    async verifyPin(req: Request, res: Response, next: NextFunction) {
        res.send("Check pin");
    }
}

export default new AuthController;