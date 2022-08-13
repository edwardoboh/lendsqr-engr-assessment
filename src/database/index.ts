import knex from "knex";
import KnexConfig from "./knex/knexfile"

export default function () {
    const env = process.env.NODE_ENV || 'development';
    try {
        knex(KnexConfig[env]);
        console.log("database connected")
    } catch (err) {
        console.error(err)
    }
}