// src/models/projects.js
import pool from '../database/connection.js';

/**
 * Fetch all service projects from the database, along with the name of the
 * organization that leads each project and the list of categories it
 * belongs to. Demonstrates the organizations -> projects (one-to-many) and
 * projects -> categories (many-to-many via project_categories) relationships.
 *
 * @returns {Promise<Array>} List of project objects
 */
async function getAllProjects() {
    const queryText = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            o.name AS organization_name,
            COALESCE(
                ARRAY_AGG(c.name ORDER BY c.name) FILTER (WHERE c.name IS NOT NULL),
                '{}'
            ) AS categories
        FROM projects p
        JOIN organizations o ON p.org_id = o.org_id
        LEFT JOIN project_categories pc ON pc.project_id = p.project_id
        LEFT JOIN categories c ON c.category_id = pc.category_id
        GROUP BY p.project_id, p.title, p.description, o.name
        ORDER BY p.title ASC;
    `;

    try {
        const result = await pool.query(queryText);
        return result.rows;
    } catch (error) {
        console.error('Database Error in getAllProjects model:', error.message);
        throw error;
    }
}

export default {
    getAllProjects
};
