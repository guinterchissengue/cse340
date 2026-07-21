-- =====================================================================
-- src/setup.sql

-- Drop child tables before the tables they reference so the
-- DROP statements never fail because of a foreign key constraint.
DROP TABLE IF EXISTS project_category CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS organization CASCADE;
DROP TABLE IF EXISTS category CASCADE;

-- ---------------------------------------------------------------------
-- category: the list of service themes a project can be tagged with
-- ---------------------------------------------------------------------
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- ---------------------------------------------------------------------
-- organization: the partner groups that lead service projects
-- ---------------------------------------------------------------------
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    website VARCHAR(255),
    contact_email VARCHAR(255) NOT NULL,
    image_path VARCHAR(255)
);

-- ---------------------------------------------------------------------
-- project: individual service projects, each led by one organization
-- ---------------------------------------------------------------------
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL REFERENCES organization(organization_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL
);

-- ---------------------------------------------------------------------
-- project_category: many-to-many join table between project and category
-- A project can have many categories, and a category can apply to many
-- projects. The composite UNIQUE constraint prevents duplicate tags.
-- ---------------------------------------------------------------------
CREATE TABLE project_category (
    project_category_id SERIAL PRIMARY KEY,
    project_id INT NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES category(category_id) ON DELETE CASCADE,
    UNIQUE (project_id, category_id)
);

-- =====================================================================
-- Sample data
-- =====================================================================

-- 5 categories -----------------------------------------------------------
INSERT INTO category (name) VALUES
('Education'),
('Environment'),
('Health & Wellness'),
('Community Support'),
('Technology');

-- 5 organizations ---------------------------------------------------------
INSERT INTO organization (name, description, website, contact_email, image_path) VALUES
('Bright Futures Youth', 'Empowering youth through education and mentorship.', 'https://brightfutures.example.com', 'contact@brightfutures.example.com', '/images/org-bright-futures.svg'),
('Green Earth Collective', 'Promoting environmental sustainability and community gardens.', 'https://greenearth.example.com', 'info@greenearth.example.com', '/images/org-green-earth.svg'),
('Wellness Together', 'Supporting mental health and overall well-being in the community.', 'https://wellnesstogether.example.com', 'hello@wellnesstogether.example.com', '/images/org-wellness-together.svg'),
('Neighborhood Care', 'Providing essential resources and support for local families.', 'https://neighborhoodcare.example.com', 'support@neighborhoodcare.example.com', '/images/org-neighborhood-care.svg'),
('Community Tech Alliance', 'Closing the digital divide with hands-on tech training and device access.', 'https://communitytech.example.com', 'hello@communitytech.example.com', '/images/org-community-tech.svg');

-- 5 projects for Organization 1 (Bright Futures Youth) ---------------------
INSERT INTO project (organization_id, title, description, location, date) VALUES
(1, 'After-School Tutoring Program', 'Free tutoring for K-12 students in math and science.', 'Community Center Room A', '2026-02-15'),
(1, 'Youth Coding Bootcamp', 'Introductory web development for teens.', 'Public Library Computer Lab', '2026-03-01'),
(1, 'STEM Mentorship Program', 'Pairing high school students with STEM professionals.', 'High School Auditorium', '2026-04-10'),
(1, 'College Prep Workshop', 'Guidance on college applications and financial aid.', 'Community Center Room B', '2026-05-05'),
(1, 'Summer Science Camp', 'Hands-on science experiments and field trips for children.', 'City Park Pavilion', '2026-06-20');

-- 5 projects for Organization 2 (Green Earth Collective) --------------------
INSERT INTO project (organization_id, title, description, location, date) VALUES
(2, 'Community Garden Cleanup', 'Weekly cleanup and planting at the downtown community garden.', 'Downtown Community Garden', '2026-02-20'),
(2, 'Recycling Drive', 'Collecting electronic waste and hard-to-recycle plastics.', 'City Hall Parking Lot', '2026-03-15'),
(2, 'Tree Planting Day', 'Planting 100 native trees in the local park.', 'Riverside Park', '2026-04-22'),
(2, 'Composting Workshop', 'Learn how to start a compost bin at home.', 'Green Earth Headquarters', '2026-05-18'),
(2, 'Urban Foraging Tour', 'Guided walk to learn about edible wild plants in the city.', 'City Outskirts Trail', '2026-06-12');

-- 5 projects for Organization 3 (Wellness Together) -------------------------
INSERT INTO project (organization_id, title, description, location, date) VALUES
(3, 'Mental Health Awareness Workshop', 'Seminar on recognizing and managing stress and anxiety.', 'Main Library Auditorium', '2026-02-28'),
(3, 'Free Yoga in the Park', 'Beginner-friendly yoga session open to everyone.', 'Sunset Park', '2026-03-25'),
(3, 'Nutrition and Cooking Class', 'Learn how to prepare affordable, healthy meals.', 'Community Kitchen', '2026-04-15'),
(3, 'Support Group: Caregivers', 'A safe space for those caring for elderly or sick family members.', 'Wellness Center Room 1', '2026-05-10'),
(3, 'Fitness Challenge Kickoff', 'Launch of the 30-day community fitness and step challenge.', 'City Stadium', '2026-06-05');

-- 5 projects for Organization 4 (Neighborhood Care) --------------------------
INSERT INTO project (organization_id, title, description, location, date) VALUES
(4, 'Winter Coat Drive', 'Collecting and distributing winter coats for families in need.', 'Neighborhood Care Office', '2026-10-15'),
(4, 'Food Pantry Restock', 'Sorting and organizing donations at the local food pantry.', 'Central Food Bank', '2026-03-10'),
(4, 'Back-to-School Supply Giveaway', 'Providing backpacks and school supplies to local children.', 'Elementary School Gym', '2026-08-20'),
(4, 'Senior Tech Support Day', 'Helping seniors learn to use smartphones and computers.', 'Senior Center', '2026-04-05'),
(4, 'Holiday Meal Delivery', 'Preparing and delivering hot meals to homebound individuals.', 'Community Kitchen', '2026-11-26');

-- 5 projects for Organization 5 (Community Tech Alliance) --------------------
INSERT INTO project (organization_id, title, description, location, date) VALUES
(5, 'Digital Literacy Workshop', 'Teaching essential computer and internet skills to adult learners.', 'Public Library Training Room', '2026-02-18'),
(5, 'Community Wi-Fi Setup Day', 'Installing free public Wi-Fi access points in underserved neighborhoods.', 'Downtown Plaza', '2026-03-22'),
(5, 'Refurbished Laptop Giveaway', 'Distributing refurbished laptops to students in need.', 'Community Tech Alliance Office', '2026-04-18'),
(5, 'Coding Club for Teens', 'Weekly after-school club introducing teens to programming basics.', 'High School Computer Lab', '2026-05-14'),
(5, 'Cybersecurity Awareness Seminar', 'Free seminar on staying safe online and protecting personal data.', 'Community Center Room A', '2026-06-09');

-- =====================================================================
-- project_category links -- every project gets at least one category,
-- looked up by name so the IDs never have to be hardcoded/guessed.
-- =====================================================================
INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM project p
JOIN category c ON (
    (p.title = 'After-School Tutoring Program' AND c.name = 'Education') OR
    (p.title = 'Youth Coding Bootcamp' AND c.name IN ('Education', 'Technology')) OR
    (p.title = 'STEM Mentorship Program' AND c.name IN ('Education', 'Technology')) OR
    (p.title = 'College Prep Workshop' AND c.name = 'Education') OR
    (p.title = 'Summer Science Camp' AND c.name = 'Education') OR

    (p.title = 'Community Garden Cleanup' AND c.name = 'Environment') OR
    (p.title = 'Recycling Drive' AND c.name = 'Environment') OR
    (p.title = 'Tree Planting Day' AND c.name = 'Environment') OR
    (p.title = 'Composting Workshop' AND c.name = 'Environment') OR
    (p.title = 'Urban Foraging Tour' AND c.name IN ('Environment', 'Education')) OR

    (p.title = 'Mental Health Awareness Workshop' AND c.name = 'Health & Wellness') OR
    (p.title = 'Free Yoga in the Park' AND c.name = 'Health & Wellness') OR
    (p.title = 'Nutrition and Cooking Class' AND c.name = 'Health & Wellness') OR
    (p.title = 'Support Group: Caregivers' AND c.name IN ('Health & Wellness', 'Community Support')) OR
    (p.title = 'Fitness Challenge Kickoff' AND c.name = 'Health & Wellness') OR

    (p.title = 'Winter Coat Drive' AND c.name = 'Community Support') OR
    (p.title = 'Food Pantry Restock' AND c.name = 'Community Support') OR
    (p.title = 'Back-to-School Supply Giveaway' AND c.name IN ('Community Support', 'Education')) OR
    (p.title = 'Senior Tech Support Day' AND c.name IN ('Community Support', 'Technology')) OR
    (p.title = 'Holiday Meal Delivery' AND c.name = 'Community Support') OR

    (p.title = 'Digital Literacy Workshop' AND c.name IN ('Technology', 'Education')) OR
    (p.title = 'Community Wi-Fi Setup Day' AND c.name = 'Technology') OR
    (p.title = 'Refurbished Laptop Giveaway' AND c.name IN ('Technology', 'Community Support')) OR
    (p.title = 'Coding Club for Teens' AND c.name IN ('Technology', 'Education')) OR
    (p.title = 'Cybersecurity Awareness Seminar' AND c.name = 'Technology')
);
