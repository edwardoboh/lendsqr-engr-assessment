import jwt from 'jsonwebtoken';
import _ from 'lodash'
import config from '../config/app'


type TokenType = {
    id: string
    email: string
    username: string
    account_number: string
    iat: number
    exp: number
}

class CommonUtil {
    generateToken(
        body: {
            id: string,
            username: string,
            email: string,
            account_number: string
        }
    ) {
        const user = _.pick(body, ['id', 'username', 'email', 'account_number'])
        return jwt.sign(user, config.tokenSecret)
    }

    verifyToken(token: string) {
        return jwt.verify(token, config.tokenSecret) as TokenType
    }
}

export default new CommonUtil()