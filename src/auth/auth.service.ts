import usersService from "../users/users.service";
class AuthService {
    async login(credentials: { email: string, password: string }) {
        const { email, password } = credentials;
        const user = await usersService.getUserByEmail(email);
        // compare password with supplied password
        // return throw error on fail
        // return token on success
        return { token: "", user }
    }

    async register(userData: any) {
        const user = await usersService.createUser(userData);
        return { token: "", user }
    }

    async whoami(token: string) {
        // decrypt token
        // get user id
        let userId = "";
        const user = await usersService.getUserById(userId);
        return { token, user }
    }
}

export default new AuthService();