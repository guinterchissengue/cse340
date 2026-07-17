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

// All page routes (home, organizations, projects, categories) live in
// src/routes/index.js and pull their data from the src/models files.
app.use('/', routes);

// Start the Express server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
