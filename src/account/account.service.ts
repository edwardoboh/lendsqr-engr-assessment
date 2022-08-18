import debug from 'debug'
import { Knex } from 'knex'
import knex from '../database'
import logger from '../common/logger'
import TransactionService from '../transaction/transaction.service'
import { transaction_types as TType, wallet_action_type as WType } from '../config/app'

class AccountService {
    log: debug.IDebugger;
    Account: Knex.QueryBuilder<any, any>;
    Transfer: Knex.QueryBuilder<any, any>;
    DepositWithdrawal: Knex.QueryBuilder<any, any>;

    constructor() {
        this.log = logger('account service:')
        this.Account = knex('accounts')
        this.Transfer = knex('transfers')
        this.DepositWithdrawal = knex('deposit_and_withdrawals')
    }

    generateAccountNumber() {
        // generates a 10 digit account number
        return Math.floor(((Math.random() * 10000000000 + 1000000000) % 10000000000)).toString()
    }

    async createAccont(user_id: number): Promise<any> {
        const account_number = this.generateAccountNumber()
        return this.Account.insert({ user_id, account_number })
    }

    async fetchAllAccounts(): Promise<any> {
        return this.Account.select();
    }

    async fetchAllTransfers(): Promise<any> {
        return this.Transfer.select();
    }

    async fetchAccountById(id: string): Promise<any> {
        const account = await this.Account.select().where('id', id);
        if (!account.length) {
            return null
        }
        return account[0]
    }

    async fetchAccountByUser(user_id: string): Promise<any> {
        const account = await this.Account.select().where({ user_id });
        if (!account.length) {
            return null
        }
        return account[0]
    }

    async fetchAccountByNumber(account_number: string): Promise<any> {
        const account = await this.Account.select().where({ account_number });
        if (!account.length) {
            return null
        }
        return account[0]
    }

    async fetchAccountTransfers(account_number: string): Promise<any> {
        return this.Transfer.select().where({ from_account_number: account_number });
    }

    async fetchAccountWithdrawals(account_number: string): Promise<any> {
        return this.DepositWithdrawal.select().where({ account_number, action_type: WType.WITHDRAWAL })
    }

    async fetchAccountDeposits(account_number: string): Promise<any> {
        return this.DepositWithdrawal.select().where({ account_number, action_type: WType.DEPOSIT })
    }

    // Transfer funds from one user's account into another
    async transferToAccount(transferData: any): Promise<any> {
        const {
            from_account_number,
            to_account_number,
            amount
        } = transferData


        try {

            await knex.transaction(async (transact) => {
                const [from_account, to_account] = await Promise.all([
                    this.Account.select()
                        .where({ account_number: from_account_number })
                        .first()
                        .transacting(transact),
                    this.Account.select()
                        .where({ account_number: to_account_number })
                        .first()
                        .transacting(transact)
                ])

                if (from_account.balance < amount) {
                    throw new Error("Insufficient Balance to make transfer")
                }

                let from_new_balance = from_account.balance - amount
                let to_new_balance = to_account.balance + amount

                const [new_from_account, new_to_account] = await Promise.all([
                    this.Account.where({ account_number: from_account_number })
                        .update(
                            { balance: from_new_balance },
                            ['id', 'balance', 'account_number']
                        )
                        .first()
                        .transacting(transact),
                    this.Account.where({ account_number: to_account_number })
                        .update(
                            { balance: to_new_balance },
                            ['id', 'balance', 'account_number']
                        )
                        .first()
                        .transacting(transact)
                ])

                // Use events to:
                // create a transfer entry in the transfer table
                // create two transactions for each user - CREDIT and DEBIT
                await TransactionService.createTransaction([{
                    account_id: from_account.id,
                    user_id: from_account.user_id,
                    transaction_type: TType.DEBIT_TRANSFER,
                    transaction_data: JSON.stringify({ from_account, to_account, new_from_account, new_to_account }),
                    balance_before: from_account.balance,
                    balance_after: new_from_account.balance
                }, {
                    account_id: to_account.id,
                    user_id: to_account.user_id,
                    transaction_type: TType.CREDIT_RECIEVE,
                    transaction_data: JSON.stringify({ from_account, to_account, new_from_account, new_to_account }),
                    balance_before: to_account.balance,
                    balance_after: new_to_account.balance
                }])

                return { from_account, to_account, new_from_account, new_to_account }
            })
        } catch (error: any) {
            this.log(error.message)
        }
    }

    // Credit a user's account after deposit from a bank account
    async depositIntoAccount(depositData: any): Promise<any> {
        const {
            amount,
            account_number
        } = depositData;

        try {
            await knex.transaction(async transact => {
                const [user_account, updated_account] = await Promise.all([
                    this.Account.where({ account_number }).first().transacting(transact),
                    this.Account.where({ account_number }).increment('balance', amount).transacting(transact)
                ])

                // Use events to:
                // create a new deposit entry in the deposit_and_withdrawal table
                // create a new transaction entry in the transactions table
                const new_transaction = await TransactionService.createTransaction([{
                    account_id: user_account.id,
                    user_id: user_account.user_id,
                    transaction_type: TType.CREDIT_FUND,
                    transaction_data: JSON.stringify({ user_account, updated_account }),
                    balance_before: user_account.balance,
                    balance_after: user_account.balance + amount
                }])
                return { user_account, new_transaction, updated_account }
            })
        } catch (error: any) {
            this.log(error.message)
        }
    }


    // Debit a user account after withdrawal of funds into bank account
    async withdrawFromAccount(withdrawalData: any): Promise<any> {
        const {
            amount,
            account_number
        } = withdrawalData;

        try {
            await knex.transaction(async transact => {
                const [user_account, updated_account] = await Promise.all([
                    this.Account.where({ account_number }).first().transacting(transact),
                    this.Account.where({ account_number }).decrement('balance', amount).transacting(transact)
                ])
                // if the new balance is negative, throw error to roleback transaction
                // Else, Proceed to make call payment service and transfer funds

                // Use events to:
                // create a new withdrawal entry in the deposit_and_withdrawal table
                // create a new transaction entry in the transactions table
                const new_transaction = await TransactionService.createTransaction([{
                    account_id: user_account.id,
                    user_id: user_account.user_id,
                    transaction_type: TType.DEBIT_WITHDRAW,
                    transaction_data: JSON.stringify({ user_account, updated_account }),
                    balance_before: user_account.balance,
                    balance_after: user_account.balance - amount
                }])
                return { user_account, new_transaction, updated_account }
            })
        } catch (error: any) {
            this.log(error.message)
        }
    }

}

export default new AccountService();