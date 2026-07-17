// src/models/organizations.js
import pool from '../database/connection.js';

/**
 * Fetch all partner organizations from the database.
 * Sorted alphabetically to keep the UI predictable.
 *
 * @returns {Promise<Array>} List of organization objects
 */
async function getAllOrganizations() {
    const queryText = `
        SELECT org_id, name, description, logo_url
        FROM organizations
        ORDER BY name ASC;
    `;

    try {
        const result = await pool.query(queryText);
        return result.rows;
    } catch (error) {
        console.error('Database Error in getAllOrganizations model:', error.message);
        throw error;
    }
}

export default {
    getAllOrganizations
};
