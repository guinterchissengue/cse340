# Community Service Hub (CSE 340)

A server-rendered web application built for the **CSE 340 – Web Backend** course. The site connects volunteers with local organizations, service projects, and causes, using **Node.js**, **Express**, and **EJS** templates.

## Features

- Node.js and Express server with EJS as the view engine
- Pages for **Home**, **Organizations**, **Service Projects**, and **Categories**
- Reusable `header` and `footer` EJS partials shared across every page
- Static CSS and images served from the `public/` folder
- Responsive, accessible, professional styling

## Project structure

```
cse340/
├── public/
│   ├── css/styles.css        # Site styles
│   └── images/               # SVG logos and hero illustration
├── views/
│   ├── partials/
│   │   ├── header.ejs        # Shared head + navigation
│   │   └── footer.ejs        # Shared footer + copyright
│   ├── index.ejs             # Home
│   ├── organizations.ejs     # Organizations (renders images)
│   ├── projects.ejs          # Service Projects
│   └── categories.ejs        # Project Categories
├── .env.example              # Sample environment variables
├── .gitignore
├── package.json
└── server.js                 # Express app and routes
```

## Running locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file (or copy the sample):
   ```bash
   cp .env.example .env
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open <http://localhost:3000> in your browser.

## Deployment (Render)

- **Build Command:** `npm install`
- **Start Command:** `npm start`

Render provides the `PORT` environment variable automatically, and the server reads it via `process.env.PORT`.

---

Developed by **Guinter Chissengue**.
