import { Request, Response } from 'express';
import usersService from './users.service';
import HTTP from '../common/httpCodes'

class UsersController {
    async getUserById(req: Request, res: Response) {
        const { userId } = req.params
        const resp = await usersService.getUserById(userId)
        res.send(resp)
    }

    async getAllUsers(req: Request, res: Response) {
        const resp = await usersService.fetchUsers()
        res.send(resp);
    }

    async createUser(req: Request, res: Response) {
        const userBody = req.body;
        // call validation function here
        const resp = await usersService.createUser(userBody)
        res.status(HTTP.CREATED).json(resp)
    }

    async updateUser(req: Request, res: Response) {
        const userBody = req.body;
        // validate response body
        const resp = await usersService.updateUser(userBody)
        res.status(HTTP.UPDATED).json(resp)
    }

    async disableUser(req: Request, res: Response) {
        const { userId } = req.params
        const resp = await usersService.disableUser(userId)
        res.status(HTTP.OK).json(resp)
    }
}

export default new UsersController();