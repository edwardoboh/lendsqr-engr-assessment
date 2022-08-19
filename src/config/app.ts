export default {
    port: process.env.PORT || 3000,
    debug: process.env.DEBUG || false,
    prefix: "/api",
    tokenSecret: "cracked-the-lending-code",
    openRoutes: [
        '/login',
        '/signup'
    ],
    getOpenRoutes: function () {
        const open = this.openRoutes.map(route => `${this.prefix}${route}`)
        open.push('/')
        return open
    }
}

export const transaction_types = {
    CREDIT_FUND: 'CREDIT_FUND',
    CREDIT_BONUS: 'CREDIT_BONUS',
    CREDIT_RECIEVE: 'CREDIT_RECIEVE',
    DEBIT_WITHDRAW: 'DEBIT_WITHDRAW',
    DEBIT_EXPENSE: 'DEBIT_EXPENSE',
    DEBIT_TRANSFER: 'DEBIT_TRANSFER',
    OTHER: 'OTHER',
}

export const wallet_action_type = {
    WITHDRAWAL: 'WITHDRAWAL',
    DEPOSIT: 'DEPOSIT'
}

export const payment_integration = {
    public_key: process.env.PAYSTACK_PUBLIC_KEY,
    secret_key: process.env.PAYSTACK_SECRET_KEY,
    verification_url: 'https://api.paystack.co/transaction/verify/'
}

export const transfer_status = {
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED'
}
/**
 * This configuration would actually be pulled from the database on application launch
 * Pulling from a static file is only used here for simplicity
 */