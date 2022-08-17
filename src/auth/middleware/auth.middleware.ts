import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import UsersService from '../../users/users.service';

class AuthMiddleware {
    validateUserRegister(req: Request, res: Response, next: NextFunction) {
        const requestBody = req.body;

        const schema = Joi.object({
            username: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            address: Joi.string().required(),
            phone_number: Joi.string().required(),
        })

        const { error } = schema.validate(requestBody, { abortEarly: false })
        if (error) {
            const errorMessage = error.details.map(detail => detail.message)
            throw new Error(`${errorMessage}`)
        }
        next();

    }

    validateUserLogin(req: Request, res: Response, next: NextFunction) {
        const requestBody = req.body;

        const schema = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
        })

        const { error } = schema.validate(requestBody, { abortEarly: false })
        if (error) {
            const errorMessage = error.details.map(detail => detail.message)
            throw new Error(`${errorMessage}`)
        }
        next();
    }

    async validateUniqueEmailAndUsername(req: Request, res: Response, next: NextFunction) {
        const { email, username } = req.body;
        const [emailExist, usernameExist] = await Promise.all([
            UsersService.getUserByEmail(email),
            UsersService.getUserByUsername(username)
        ])
        if (emailExist || usernameExist) {
            return next(new Error("User with email or username already exists"));
        }
        next()
    }
}

export default new AuthMiddleware();