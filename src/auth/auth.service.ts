import usersService from "../users/users.service";

class AuthService {
    async login(credentials: { email: string, password: string }) {
        const { email, password } = credentials;
        const user = await usersService.getUserByEmail(email);
        // compare password with supplied password
        // return throw error on fail
        // return token on success
        return { token: `sample_token_${user?.id}`, user }
    }

    async register(userData: any) {
        const user = await usersService.createUser(userData);
        return { token: `sample_token_${user[0]}`, user }
    }

    async whoami(userId: string) {
        const user = await usersService.getUserById(userId);
        if (!user) return null;
        return { user }
    }
}

export default new AuthService();