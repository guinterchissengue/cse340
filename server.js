import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import routes from './src/routes/index.js';

// Create the Express application
const app = express();

// Use the port defined in the .env file or default to 3000
const PORT = process.env.PORT || 3000;

// Recreate __filename and __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure EJS as the template engine
app.set('view engine', 'ejs');

// Specify the location of the EJS view files
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images, JavaScript, etc.) from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// All page routes (home, organizations, projects, categories, and their
// :id detail pages) live in src/routes/index.js, which delegates to
// src/controllers/*, which pull data from src/models/*.
app.use('/', routes);

// ==========================================
// 404 Handler
// Runs when no route above matched the incoming request.
// ==========================================
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

// ==========================================
// Centralized Error Handler
// Any controller that calls next(error) ends up here, so every
// unexpected failure (bad query, lost DB connection, etc.) renders the
// same friendly 500 page instead of crashing the process or leaking a
// stack trace to the browser.
// ==========================================
app.use((err, req, res, next) => {
    console.error('Unhandled application error:', err);
    res.status(500).render('500', { title: 'Server Error' });
});

// Start the Express server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
