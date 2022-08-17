import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('transfers', function (table) {
        table.increments('id').primary();
        table.string('from_account_number').notNullable();
        table.string('to_account_number').notNullable();
        table.decimal('amount').notNullable();
        table.enum('status', ['SUCCESS', 'FAILED']).defaultTo('SUCCESS');
        table.integer('transaction_id', 11).unsigned().references('id').inTable('transactions')
        table.json('transfer_data');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('transfers');
}

