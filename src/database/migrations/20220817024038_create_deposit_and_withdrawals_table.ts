import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('deposit_and_withdrawals', function (table) {
        table.increments('id').primary();
        table.string('account_number').notNullable();
        table.integer('user_id', 11).unsigned().references('id').inTable('users');
        table.integer('transaction_id', 11).unsigned().references('id').inTable('transactions')
        table.decimal('amount').notNullable();
        table.string('action_type').notNullable();
        table.json('brank_data');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('deposit_and_withdrawals')
}

