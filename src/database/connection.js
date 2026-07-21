import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const Pool = pg.Pool;

// Verifica se está a rodar localmente (localhost) ou na nuvem (Render)
const isLocal = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Ativa o SSL apenas se não for localhost
    ssl: isLocal ? false : { rejectUnauthorized: false }
});

export default pool;