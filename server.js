import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

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

// Reusable helper function to render EJS pages
const renderPage = async (req, res, view, title) => {
    try {
        // Render the requested page and pass the page title
        res.render(view, { title });
    } catch (error) {
        // Return a generic error message if rendering fails
        res.status(500).send('Server Error');
    }
};

// Home page route
app.get('/', async (req, res) => {
    await renderPage(req, res, 'index', 'Home');
});

// Organizations page route
app.get('/organizations', async (req, res) => {
    await renderPage(req, res, 'organizations', 'Organizations');
});

// Service Projects page route
app.get('/projects', async (req, res) => {
    await renderPage(req, res, 'projects', 'Service Projects');
});

// Project Categories page route
app.get('/categories', async (req, res) => {
    await renderPage(req, res, 'categories', 'Project Categories');
});

// Start the Express server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});