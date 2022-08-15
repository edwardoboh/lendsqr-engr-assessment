import knex from "knex";
import KnexConfig from "../../knexfile"
const env = process.env.NODE_ENV || 'development';

export default knex(KnexConfig[env]);