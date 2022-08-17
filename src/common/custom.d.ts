declare namespace Express {
    export interface Request {
        user: {
            id: string | number,
            email: string,
            username: string,
            account_number: string
        }
    }
}