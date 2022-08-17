import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('accounts', function (table) {
        table.increments('id').primary();
        table.string('account_number').notNullable();
        table.decimal('balance').defaultTo(0);
        table.integer('user_id', 11).unsigned().references('id').inTable('users');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('accounts')
}

