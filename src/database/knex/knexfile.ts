import type { Knex } from "knex";
import dbConfig from "../../config/database";

const {
  client, database, host, password, user
} = dbConfig()

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      database,
      user,
      password,
      host
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client,
    connection: {
      database,
      user,
      password,
      host
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};

export default config;
