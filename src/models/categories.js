// src/models/categories.js
import pool from '../database/connection.js';

/**
 * Fetch all available service project categories from the database.
 * Sorted alphabetically to keep the UI clean and predictable.
 *
 * @returns {Promise<Array>} List of category objects
 */
async function getAllCategories() {
    // Matches the 'category' table (singular) as defined in src/setup.sql
    const queryText = 'SELECT category_id, name FROM category ORDER BY name ASC;';

    try {
        // Run the query against our pg pool
        const result = await pool.query(queryText);
        return result.rows;
    } catch (error) {
        // Logging the error clearly in the console to make debugging painless
        console.error('Database Error in getAllCategories model:', error.message);
        throw error; // Pass the error up so the route handler can handle it gracefully
    }
}

/**
 * Fetch a single category by its ID.
 *
 * @param {number|string} id - The category_id to look up
 * @returns {Promise<Object|undefined>} The matching category, or undefined if not found
 */
async function getCategoryById(id) {
    const queryText = 'SELECT category_id, name FROM category WHERE category_id = $1;';

    try {
        const result = await pool.query(queryText, [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Database Error in getCategoryById model:', error.message);
        throw error;
    }
}

/**
 * Fetch every category a given project belongs to, via the
 * project_category join table.
 *
 * @param {number|string} projectId - The project_id to look up categories for
 * @returns {Promise<Array>} List of category objects
 */
async function getCategoriesByProjectId(projectId) {
    const queryText = `
        SELECT c.category_id, c.name
        FROM category c
        JOIN project_category pc ON pc.category_id = c.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name ASC;
    `;

    try {
        const result = await pool.query(queryText, [projectId]);
        return result.rows;
    } catch (error) {
        console.error('Database Error in getCategoriesByProjectId model:', error.message);
        throw error;
    }
}

export default {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId
};
