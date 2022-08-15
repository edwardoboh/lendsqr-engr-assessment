import { Knex } from 'knex';
import knex from '../database';
class UserService {
    User: Knex.QueryBuilder<any, any>;

    constructor() {
        this.User = knex('users');
    }

    async fetchUsers() {
        return this.User.select();
    }

    async getUserById(id: string) {
        return this.User.select().where('id', id).first();
    }

    async getUserByEmail(email: string) {
        return this.User.select().where({ email }).first()
    }

    async createUser(user: {}) {
        return this.User.insert(user);
    }

    async updateUser(user: { id: string }) {
        return this.User.where({ id: user.id }).update(user);
    }

    async disableUser(id: string) {
        return this.User.update({ active: false })
    }

    async deleteUser(id: string) {
        return this.User.where({ id }).delete()
    }
}

export default new UserService();