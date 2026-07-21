// run-setup.js
// Runs src/setup.sql against the database pointed to by DATABASE_URL.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './src/database/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSetup() {
    try {
        console.log('Connecting to the database and running src/setup.sql ...');

        // IMPORTANT: setup.sql lives in src/, not in the project root.
        // Building the path from this file's own directory (instead of
        // process.cwd()) makes it work the same way locally and on
        // Render, no matter what directory the process is started from.
        const sqlPath = path.join(__dirname, 'src', 'setup.sql');
        const sqlQuery = fs.readFileSync(sqlPath, 'utf8');

        await pool.query(sqlQuery);
        console.log('Tables created and seeded successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error running setup.sql:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

runSetup();
