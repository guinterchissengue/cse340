-- =========================================================================
-- COMMUNITY SERVICE HUB — DATABASE SETUP
-- Tables: organizations, projects, categories, project_categories (join)
-- =========================================================================

-- Drop in dependency order so this script can be re-run safely.
DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organization;

-- -------------------------------------------------------------------------
-- ORGANIZATION
-- Partner organizations that lead volunteer efforts.
-- -------------------------------------------------------------------------
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name             VARCHAR(150) NOT NULL UNIQUE,
    description      TEXT NOT NULL,
    contact_email    VARCHAR(150) NOT NULL,
    logo_url         VARCHAR(255)
);

-- -------------------------------------------------------------------------
-- PROJECT
-- Each project belongs to exactly one organization (one-to-many).
-- -------------------------------------------------------------------------
CREATE TABLE project (
    project_id      SERIAL PRIMARY KEY,
    organization_id INT NOT NULL REFERENCES organization(organization_id) ON DELETE CASCADE,
    title           VARCHAR(150) NOT NULL,
    description     TEXT NOT NULL,
    location        VARCHAR(150) NOT NULL,
    date            DATE NOT NULL
);

-- -------------------------------------------------------------------------
-- CATEGORIES
-- Themes that a project can belong to.
-- -------------------------------------------------------------------------
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE
);

-- -------------------------------------------------------------------------
-- PROJECT_CATEGORIES (join table)
-- A project can have multiple categories, and a category can belong to
-- multiple projects (many-to-many).
-- -------------------------------------------------------------------------
CREATE TABLE project_categories (
    project_id  INT NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- =========================================================================
-- SEED DATA
-- =========================================================================

INSERT INTO organization (name, description, contact_email, logo_url) VALUES
('Green Earth Alliance', 'Leads clean-up drives, tree planting, and sustainability education to protect local habitats.', 'contact@greenearthalliance.org', '/images/org-green-earth.svg'),
('Bright Futures Education', 'Provides tutoring, mentoring, and school supply drives for students of every age.', 'info@brightfutureseducation.org', '/images/org-bright-futures.svg'),
('Neighborhood Care Network', 'Organizes food drives, home repairs, and local outreach to build stronger neighborhoods.', 'hello@neighborhoodcarenetwork.org', '/images/org-neighborhood-care.svg'),
('Wellness Together', 'Supports clinics and wellness events that promote physical and mental health for all.', 'support@wellnesstogether.org', '/images/org-wellness-together.svg');

INSERT INTO project (organization_id, title, description, location, date) VALUES
((SELECT organization_id FROM organization WHERE name = 'Green Earth Alliance'), 'Riverside Clean-Up Day', 'Join a morning of trail and riverbank clean-up to keep our green spaces healthy and welcoming.', 'Riverside Park', '2026-09-12'),
((SELECT organization_id FROM organization WHERE name = 'Bright Futures Education'), 'After-School Reading Buddies', 'Spend an hour a week helping elementary students build confidence and a love of reading.', 'Lincoln Elementary School', '2026-09-05'),
((SELECT organization_id FROM organization WHERE name = 'Neighborhood Care Network'), 'Community Food Drive', 'Help collect, sort, and distribute food to families served by the local food bank.', 'Downtown Community Center', '2026-10-03'),
((SELECT organization_id FROM organization WHERE name = 'Wellness Together'), 'Neighborhood Health Fair', 'Volunteer at a free health fair offering screenings, resources, and wellness activities.', 'Central City Plaza', '2026-10-18');

INSERT INTO categories (name) VALUES
('Environmental'),
('Education'),
('Social Support'),
('Health & Wellness');

INSERT INTO project_categories (project_id, category_id) VALUES
((SELECT project_id FROM project WHERE title = 'Riverside Clean-Up Day'), (SELECT category_id FROM categories WHERE name = 'Environmental')),
((SELECT project_id FROM project WHERE title = 'After-School Reading Buddies'), (SELECT category_id FROM categories WHERE name = 'Education')),
((SELECT project_id FROM project WHERE title = 'Community Food Drive'), (SELECT category_id FROM categories WHERE name = 'Social Support')),
((SELECT project_id FROM project WHERE title = 'Community Food Drive'), (SELECT category_id FROM categories WHERE name = 'Education')),
((SELECT project_id FROM project WHERE title = 'Neighborhood Health Fair'), (SELECT category_id FROM categories WHERE name = 'Health & Wellness'));
