import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('transactions', function (table) {
        table.increments('id').primary();
        table.integer('account_id', 11).unsigned().references('id').inTable('accounts');
        table.integer('user_id', 11).unsigned().references('id').inTable('users');
        table.string('transaction_type').notNullable();
        table.json('transaction_data');
        table.decimal('balance_before').notNullable();
        table.decimal('balance_after').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('transactions');

}

