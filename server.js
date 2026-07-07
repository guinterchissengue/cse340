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

// Reusable helper that renders an EJS page and safely handles errors.
// A callback is passed to res.render so we can await the generated HTML and
// return a clean 500 response if a template fails to render.
const renderPage = async (res, view, title) => {
    try {
        const html = await new Promise((resolve, reject) => {
            res.render(view, { title }, (error, rendered) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(rendered);
                }
            });
        });
        res.send(html);
    } catch (error) {
        console.error(`Failed to render "${view}":`, error.message);
        res.status(500).send('Internal Server Error');
    }
};

// Home page route
app.get('/', async (req, res) => {
    await renderPage(res, 'index', 'Home');
});

// Organizations page route
app.get('/organizations', async (req, res) => {
    await renderPage(res, 'organizations', 'Organizations');
});

// Service Projects page route
app.get('/projects', async (req, res) => {
    await renderPage(res, 'projects', 'Service Projects');
});

// Project Categories page route
app.get('/categories', async (req, res) => {
    await renderPage(res, 'categories', 'Project Categories');
});

// Start the Express server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
