import { Knex } from 'knex';
import knex from '../database';
import _ from 'lodash'
class UserService {
    User: Knex.QueryBuilder<any, any>;

    constructor() {
        this.User = knex('users');
    }

    async fetchUsers() {
        return this.User.select();
    }

    async getUserById(id: string) {
        const user = await this.User.select().where('id', id);
        if (!user.length) return null;
        return _.pick(user[0], 'username', 'email', 'id', 'first_name', 'last_name', 'phone_number');
    }

    async getUserByEmail(email: string) {
        const user = await this.User.select().where({ email })
        if (!user.length) return null;
        return _.pick(user[0], 'username', 'email', 'id', 'first_name', 'last_name', 'phone_number', 'password');
    }

    async getUserByUsername(username: string) {
        const user = await this.User.select().where({ username })
        if (!user.length) return null;
        return _.pick(user[0], 'username', 'email', 'id', 'first_name', 'last_name', 'phone_number');
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