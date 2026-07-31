# Community Service Hub (CSE 340)

A server-rendered web application built for the **CSE 340 – Web Backend** course. The site connects volunteers with local organizations, service projects, and causes, using **Node.js**, **Express**, and **EJS** templates.

## Features

- Node.js and Express server with EJS as the view engine
- Pages for **Home**, **Organizations**, **Service Projects**, and **Categories**, all rendered from live PostgreSQL data
- `organization` → `project` one-to-many relationship, and `project` ↔ `category` many-to-many relationship (via the `project_category` join table)
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
│   │   ├── organizations.js  # getAllOrganizations(), getOrganizationById()
│   │   ├── projects.js       # getAllProjects(), getProjectsByOrganizationId() (includes categories)
│   │   └── categories.js     # getAllCategories()
│   ├── routes/
│   │   └── index.js          # All page routes, wired to the models above
│   └── setup.sql             # Schema + seed data for organization, project, category, project_category
├── run-setup.js               # Runs src/setup.sql against DATABASE_URL (npm run db:setup)
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
3. Create the database and load the schema + seed data. Either use `psql` directly:
   ```bash
   createdb cse340
   psql -d cse340 -f src/setup.sql
   ```
   or use the Node script, which reads `DATABASE_URL` from `.env` and works the same way locally and on Render:
   ```bash
   npm run db:setup
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open <http://localhost:3000> in your browser.

## Deployment (Render)

- **Build Command:** `npm install && node run-setup.js`
- **Start Command:** `npm start`

The build command installs dependencies and then runs `src/setup.sql` against the database at `DATABASE_URL` (set this env var on the Render web service to your Postgres instance's **Internal Database URL**). `setup.sql` drops and recreates every table on each run, so the schema is always in sync with this repo — this is what fixes the `relation "organization" does not exist` error, which happens whenever the Postgres database itself has no tables yet because setup.sql was never executed against it.

Also set a `SESSION_SECRET` environment variable on the Render service (any long random string) — it signs the session cookie, which now backs both flash messages and logged-in sessions (stored in a `session` table in Postgres via `connect-pg-simple`, created automatically on first run, so logins survive a redeploy). The app falls back to a built-in default if it's missing, so this isn't strictly required to run, but a real deployment shouldn't rely on that default.

If you'd rather not re-run setup.sql on every deploy, use `npm install` as the build command and instead run `npm run db:setup` once from the Render Shell (Dashboard → your web service → **Shell**) after the database is provisioned.

Render provides the `PORT` environment variable automatically, and the server reads it via `process.env.PORT`.

---

Developed by **Guinter Chissengue**.
