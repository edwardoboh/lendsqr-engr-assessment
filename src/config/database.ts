import dotenv from 'dotenv';
dotenv.config();

export default function dbConfig() {
    const env = process.env.NODE_ENV
    let prefix = 'DEV'
    if (env == 'production') prefix = 'PROD';

    return {
        client: 'mysql2',
        port: process.env[`${prefix}_DB_PORT`] || 3306,
        host: process.env[`${prefix}_DB_HOST`] || 'localhost',
        user: process.env[`${prefix}_DB_USER`] || 'root',
        password: process.env[`${prefix}_DB_PASSWORD`] || 'password',
        database: process.env[`${prefix}_DB_DATABASE`] || 'example'
    }
}