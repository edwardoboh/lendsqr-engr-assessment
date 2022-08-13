import { Request, Response } from 'express';
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
}

export default new AuthController;