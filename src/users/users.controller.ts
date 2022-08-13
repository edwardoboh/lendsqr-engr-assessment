import { Request, Response } from 'express';

class UsersController {
    async getUserById(req: Request, res: Response) {
        res.send("Get a single user by ID");
    }

    async getAllUsers(req: Request, res: Response) {
        res.send("Get all the users in DB");
    }

    async createUser(req: Request, res: Response) {
        res.send("Create a user Endpoint");
    }

    async updateUser() {

    }

    async disableUser() {

    }
}

export default new UsersController;