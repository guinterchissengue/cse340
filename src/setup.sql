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
-- Green Earth Alliance (5 projects)
((SELECT organization_id FROM organization WHERE name = 'Green Earth Alliance'), 'Riverside Clean-Up Day', 'Join a morning of trail and riverbank clean-up to keep our green spaces healthy and welcoming.', 'Riverside Park', '2026-09-12'),
((SELECT organization_id FROM organization WHERE name = 'Green Earth Alliance'), 'Community Tree Planting', 'Help plant native trees to restore the city greenbelt and improve air quality.', 'City Greenbelt', '2026-09-20'),
((SELECT organization_id FROM organization WHERE name = 'Green Earth Alliance'), 'Recycling Awareness Workshop', 'Teach neighbors practical tips for recycling correctly and reducing household waste.', 'Public Library', '2026-10-01'),
((SELECT organization_id FROM organization WHERE name = 'Green Earth Alliance'), 'Urban Garden Build', 'Build raised garden beds for a new community vegetable garden.', 'Maple Street Lot', '2026-10-15'),
((SELECT organization_id FROM organization WHERE name = 'Green Earth Alliance'), 'Coastal Shoreline Restoration', 'Remove invasive plants and restore native dune grasses along the shoreline.', 'Harbor Point Beach', '2026-11-02'),
-- Bright Futures Education (5 projects)
((SELECT organization_id FROM organization WHERE name = 'Bright Futures Education'), 'After-School Reading Buddies', 'Spend an hour a week helping elementary students build confidence and a love of reading.', 'Lincoln Elementary School', '2026-09-05'),
((SELECT organization_id FROM organization WHERE name = 'Bright Futures Education'), 'Weekend Math Tutoring', 'Provide one-on-one math tutoring for middle schoolers preparing for exams.', 'Jefferson Middle School', '2026-09-19'),
((SELECT organization_id FROM organization WHERE name = 'Bright Futures Education'), 'School Supply Drive', 'Collect and pack backpacks and school supplies for students in need.', 'Bright Futures Office', '2026-10-04'),
((SELECT organization_id FROM organization WHERE name = 'Bright Futures Education'), 'Teen Mentorship Circle', 'Mentor high school students through weekly discussion and goal-setting sessions.', 'Roosevelt High School', '2026-10-22'),
((SELECT organization_id FROM organization WHERE name = 'Bright Futures Education'), 'Summer Literacy Camp Prep', 'Prepare learning materials and activities for the upcoming summer literacy camp.', 'Community Learning Center', '2026-11-08'),
-- Neighborhood Care Network (5 projects)
((SELECT organization_id FROM organization WHERE name = 'Neighborhood Care Network'), 'Community Food Drive', 'Help collect, sort, and distribute food to families served by the local food bank.', 'Downtown Community Center', '2026-10-03'),
((SELECT organization_id FROM organization WHERE name = 'Neighborhood Care Network'), 'Senior Home Repair Day', 'Assist elderly residents with small home repairs and yard clean-up.', 'Maple Grove Neighborhood', '2026-09-27'),
((SELECT organization_id FROM organization WHERE name = 'Neighborhood Care Network'), 'Winter Coat Collection', 'Gather and distribute warm coats ahead of the winter season.', 'Neighborhood Care Office', '2026-11-14'),
((SELECT organization_id FROM organization WHERE name = 'Neighborhood Care Network'), 'Holiday Meal Packing', 'Pack holiday meal boxes for families across the neighborhood.', 'Downtown Community Center', '2026-11-21'),
((SELECT organization_id FROM organization WHERE name = 'Neighborhood Care Network'), 'Neighborhood Cleanup & Outreach', 'Clean up local streets while connecting residents with community resources.', 'Elm Street Corridor', '2026-12-05'),
-- Wellness Together (5 projects)
((SELECT organization_id FROM organization WHERE name = 'Wellness Together'), 'Neighborhood Health Fair', 'Volunteer at a free health fair offering screenings, resources, and wellness activities.', 'Central City Plaza', '2026-10-18'),
((SELECT organization_id FROM organization WHERE name = 'Wellness Together'), 'Mental Health Awareness Walk', 'Support a community walk raising awareness for mental health resources.', 'Lakeside Park', '2026-09-13'),
((SELECT organization_id FROM organization WHERE name = 'Wellness Together'), 'Free Vision Screening Clinic', 'Help run a free vision screening clinic for underserved residents.', 'Wellness Together Clinic', '2026-10-25'),
((SELECT organization_id FROM organization WHERE name = 'Wellness Together'), 'Blood Drive Volunteer Day', 'Assist with check-in and refreshments at a community blood drive.', 'Central City Plaza', '2026-11-07'),
((SELECT organization_id FROM organization WHERE name = 'Wellness Together'), 'Yoga for Seniors Program', 'Support a free weekly yoga program designed for senior residents.', 'Sunrise Community Center', '2026-11-29');

INSERT INTO categories (name) VALUES
('Environmental'),
('Education'),
('Social Support'),
('Health & Wellness');

INSERT INTO project_categories (project_id, category_id) VALUES
-- Green Earth Alliance projects
((SELECT project_id FROM project WHERE title = 'Riverside Clean-Up Day'), (SELECT category_id FROM categories WHERE name = 'Environmental')),
((SELECT project_id FROM project WHERE title = 'Community Tree Planting'), (SELECT category_id FROM categories WHERE name = 'Environmental')),
((SELECT project_id FROM project WHERE title = 'Recycling Awareness Workshop'), (SELECT category_id FROM categories WHERE name = 'Environmental')),
((SELECT project_id FROM project WHERE title = 'Recycling Awareness Workshop'), (SELECT category_id FROM categories WHERE name = 'Education')),
((SELECT project_id FROM project WHERE title = 'Urban Garden Build'), (SELECT category_id FROM categories WHERE name = 'Environmental')),
((SELECT project_id FROM project WHERE title = 'Coastal Shoreline Restoration'), (SELECT category_id FROM categories WHERE name = 'Environmental')),
-- Bright Futures Education projects
((SELECT project_id FROM project WHERE title = 'After-School Reading Buddies'), (SELECT category_id FROM categories WHERE name = 'Education')),
((SELECT project_id FROM project WHERE title = 'Weekend Math Tutoring'), (SELECT category_id FROM categories WHERE name = 'Education')),
((SELECT project_id FROM project WHERE title = 'School Supply Drive'), (SELECT category_id FROM categories WHERE name = 'Education')),
((SELECT project_id FROM project WHERE title = 'School Supply Drive'), (SELECT category_id FROM categories WHERE name = 'Social Support')),
((SELECT project_id FROM project WHERE title = 'Teen Mentorship Circle'), (SELECT category_id FROM categories WHERE name = 'Education')),
((SELECT project_id FROM project WHERE title = 'Summer Literacy Camp Prep'), (SELECT category_id FROM categories WHERE name = 'Education')),
-- Neighborhood Care Network projects
((SELECT project_id FROM project WHERE title = 'Community Food Drive'), (SELECT category_id FROM categories WHERE name = 'Social Support')),
((SELECT project_id FROM project WHERE title = 'Community Food Drive'), (SELECT category_id FROM categories WHERE name = 'Education')),
((SELECT project_id FROM project WHERE title = 'Senior Home Repair Day'), (SELECT category_id FROM categories WHERE name = 'Social Support')),
((SELECT project_id FROM project WHERE title = 'Winter Coat Collection'), (SELECT category_id FROM categories WHERE name = 'Social Support')),
((SELECT project_id FROM project WHERE title = 'Holiday Meal Packing'), (SELECT category_id FROM categories WHERE name = 'Social Support')),
((SELECT project_id FROM project WHERE title = 'Neighborhood Cleanup & Outreach'), (SELECT category_id FROM categories WHERE name = 'Social Support')),
((SELECT project_id FROM project WHERE title = 'Neighborhood Cleanup & Outreach'), (SELECT category_id FROM categories WHERE name = 'Environmental')),
-- Wellness Together projects
((SELECT project_id FROM project WHERE title = 'Neighborhood Health Fair'), (SELECT category_id FROM categories WHERE name = 'Health & Wellness')),
((SELECT project_id FROM project WHERE title = 'Mental Health Awareness Walk'), (SELECT category_id FROM categories WHERE name = 'Health & Wellness')),
((SELECT project_id FROM project WHERE title = 'Free Vision Screening Clinic'), (SELECT category_id FROM categories WHERE name = 'Health & Wellness')),
((SELECT project_id FROM project WHERE title = 'Blood Drive Volunteer Day'), (SELECT category_id FROM categories WHERE name = 'Health & Wellness')),
((SELECT project_id FROM project WHERE title = 'Yoga for Seniors Program'), (SELECT category_id FROM categories WHERE name = 'Health & Wellness'));
