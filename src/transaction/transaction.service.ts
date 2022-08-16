import { Knex } from 'knex';
import knex from '../database'

class TransactionService {

    Transaction: Knex.QueryBuilder<any, any>;

    constructor() {
        this.Transaction = knex('transactions');
    }

    async fetchSingleTransaction() {

    }

    async fetchAllTransactions() {

    }

    async fetchAccountTransactions() {

    }

    async createTransaction(newTransactions: any[]) {
        return this.Transaction.insert(newTransactions, ['id', 'account_id', 'transaction_type', 'balance_before', 'balance_after']);
    }
}

export default new TransactionService()