import type { Knex } from "knex";
import dbConfig from "./src/config/database";

const {
  client, database, host, password, user
} = dbConfig()

const config: { [key: string]: Knex.Config } = {
  development: {
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
      tableName: 'knex_migrations',
      directory: './src/database/migrations'
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
      tableName: 'knex_migrations',
      directory: './src/database/migrations',
      extension: 'ts'
    }
  }
};

export default config;
