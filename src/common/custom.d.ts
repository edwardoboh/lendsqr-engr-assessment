declare namespace Express {
    export interface Request {
        user: {
            id: string,
            email: string,
            username: string,
            account_number: string
        }
    }
}