// run-setup.js
// Runs src/setup.sql against the database pointed to by DATABASE_URL.
// This is what actually creates the tables and seed data -- run it
// once locally (npm run db:setup) and again any time the Render
// database needs to be (re)initialized, e.g. from the Render Shell,
// or automatically on every deploy if it's added to the Build Command
// (see README "Deployment (Render)" section for the exact command).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import pool from './src/database/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Grading/demo admin account. The password is hashed below rather than
// stored in setup.sql because setup.sql is plain SQL and can't call
// bcrypt -- this is the "seed script" that creates it instead.
const ADMIN_NAME = 'Site Administrator';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'cse340!';

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

        // Seed the admin grading account now that app_user exists.
        // ON CONFLICT makes this safe to re-run (e.g. every Render
        // deploy) without erroring or duplicating the account.
        const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await pool.query(
            `INSERT INTO app_user (name, email, password_hash, role)
             VALUES ($1, $2, $3, 'admin')
             ON CONFLICT (email) DO NOTHING;`,
            [ADMIN_NAME, ADMIN_EMAIL, passwordHash]
        );
        console.log(`Admin account ready (${ADMIN_EMAIL}).`);

        process.exit(0);
    } catch (error) {
        console.error('Error running setup.sql:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

runSetup();
