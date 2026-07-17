// src/database/connection.js
// Single shared PostgreSQL connection pool, reused by every model file.
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Render's managed Postgres requires SSL; local development typically does not.
    ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com')
        ? { rejectUnauthorized: false }
        : false
});

pool.on('error', (error) => {
    console.error('Unexpected error on idle PostgreSQL client:', error.message);
});

export default pool;
