-- =========================================================================
-- CATEGORIES ARCHITECTURE (Week 02 Assignment)
-- =========================================================================

-- Create the master table for categories.
-- Each category has a unique ID and a distinct name.
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Create the join table to handle the Many-to-Many relationship.
-- A project can have multiple categories, and a category can have multiple projects.
CREATE TABLE IF NOT EXISTS project_categories (
    project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id) -- Composite key prevents duplicate assignments
);

-- Seed at least 3 relevant categories for community/service projects
INSERT INTO categories (name) VALUES 
('Environmental'),
('Education'),
('Social Support')
ON CONFLICT (name) DO NOTHING;

-- Link your existing projects to at least one category.
-- Note: Replace these sample IDs (1, 2, 3) with actual project IDs from your database if they differ.
INSERT INTO project_categories (project_id, category_id) VALUES
(1, 1), -- e.g., Project 1 linked to Environmental
(1, 2), -- e.g., Project 1 also linked to Education
(2, 3), -- e.g., Project 2 linked to Social Support
(3, 2)  -- e.g., Project 3 linked to Education
ON CONFLICT DO NOTHING;