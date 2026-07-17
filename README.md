# Community Service Hub (CSE 340)

A server-rendered web application built for the **CSE 340 – Web Backend** course. The site connects volunteers with local organizations, service projects, and causes, using **Node.js**, **Express**, and **EJS** templates.

## Features

- Node.js and Express server with EJS as the view engine
- Pages for **Home**, **Organizations**, **Service Projects**, and **Categories**, all rendered from live PostgreSQL data
- `organizations` → `projects` one-to-many relationship, and `projects` ↔ `categories` many-to-many relationship (via the `project_categories` join table)
- Reusable `header` and `footer` EJS partials shared across every page
- Static CSS and images served from the `public/` folder
- Responsive, accessible, professional styling

## Project structure

```
cse340/
├── public/
│   ├── css/styles.css        # Site styles
│   └── images/               # SVG logos and hero illustration
├── src/
│   ├── database/
│   │   └── connection.js     # Shared pg Pool, reads DATABASE_URL from .env
│   ├── models/
│   │   ├── organizations.js  # getAllOrganizations()
│   │   ├── projects.js       # getAllProjects()
│   │   └── categories.js     # getAllCategories()
│   ├── routes/
│   │   └── index.js          # All page routes, wired to the models above
│   └── setup.sql             # Schema + seed data for organizations, projects, categories
├── views/
│   ├── partials/
│   │   ├── header.ejs        # Shared head + navigation
│   │   └── footer.ejs        # Shared footer + copyright
│   ├── index.ejs             # Home
│   ├── organizations.ejs     # Organizations (dynamic, renders images)
│   ├── projects.ejs          # Service Projects (dynamic, shows org + categories)
│   └── categories.ejs        # Project Categories (dynamic)
├── .env.example              # Sample environment variables
├── .gitignore
├── package.json
└── server.js                 # Express app setup, mounts src/routes/index.js
```

## Running locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file (or copy the sample) and set your `DATABASE_URL`:
   ```bash
   cp .env.example .env
   ```
3. Create the database and load the schema + seed data:
   ```bash
   createdb cse340
   psql -d cse340 -f src/setup.sql
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open <http://localhost:3000> in your browser.

## Deployment (Render)

- **Build Command:** `npm install`
- **Start Command:** `npm start`

Render provides the `PORT` environment variable automatically, and the server reads it via `process.env.PORT`.

---

Developed by **Guinter Chissengue**.
