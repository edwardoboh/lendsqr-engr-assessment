import usersService from "../users/users.service";
import AccountService from "../account/account.service";
import CommonUtil from "../common/common.util";
import _ from 'lodash';

class AuthService {
    async login(credentials: { email: string, password: string }) {
        const { email, password } = credentials;
        const user = await usersService.getUserByEmail(email);
        if (user) {
            // compare password with supplied password
            // in practice, the password word be hashed and compared using a module like argon or bcrypt
            if (password !== user?.password) {
                // return throw error on fail
                return null
            }
            const { account_number } = await AccountService.fetchAccountByUser(user.id)
            const token = CommonUtil.generateToken({ ...user, account_number })

            return { token, user: _.omit(user, 'password') }
        }
    }

    async register(userData: any) {
        const user = await usersService.createUser(userData);
        const account = await AccountService.createAccont(user[0])
        return { user, account }
    }

    async whoami(userId: string) {
        const user = await usersService.getUserById(userId);
        if (!user) return null;
        return { user }
    }
}

export default new AuthService();