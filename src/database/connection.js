import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const Pool = pg.Pool;

// Ensures secure SSL support in cloud environments (Render) while remaining flexible for local development.
const isProduction = process.env.NODE_ENV === 'production' || (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com'));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

export default pool;