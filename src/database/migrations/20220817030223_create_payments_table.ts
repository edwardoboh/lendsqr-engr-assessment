import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('payments', function (table) {
        table.increments('id').primary();
        table.string('payment_reference').notNullable();
        table.decimal('amount').notNullable();
        table.enum('status', ['SUCCESS', 'FAILED']).defaultTo('SUCCESS');
        table.string('username').notNullable();
        table.json('payment_data');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('payments')
}

