import { Request, Response } from 'express';
import { read } from 'fs';
class AuthController {

    async loginUser(req: Request, res: Response) {
        res.send("Login");
    }

    async signupUser(req: Request, res: Response) {
        res.send("SignUp");
    }

    async whoIsUser(req: Request, res: Response) {
        res.send("You are the user");
    }

    async verifyPin(req: Request, res: Response) {
        res.send("Check pin");
    }
}

export default new AuthController;