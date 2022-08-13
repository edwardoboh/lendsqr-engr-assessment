export default function dbConfig() {
    const env = process.env.NODE_ENV
    let prefix = 'DEV'
    if (env == 'production') prefix = 'PROD';

    return {
        client: process.env.DB_CLIENT || 'mysql2',
        port: process.env[`${prefix}_DB_PORT`] || 3306,
        host: process.env[`${prefix}_DB_HOST`],
        user: process.env[`${prefix}_DB_USER`],
        password: process.env[`${prefix}_DB_PASSWORD`],
        database: process.env[`${prefix}_DB_DATABASE`]
    }
}