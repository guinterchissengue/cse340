import pool from '../database/connection.js';

/* ***************************
 * Fetch all organizations from the database
 * ************************** */
async function getAllOrganizations() {
    try {
        // Retrieve all organizations sorted alphabetically, including the contact email needed for the views
        const result = await pool.query(
            "SELECT organization_id, name, description, website, contact_email, image_path FROM organization ORDER BY name;"
        );
        return result.rows;
    } catch (error) {
        console.error("Failed to fetch organizations list: ", error);
        throw error;
    }
}

/* ***************************
 * Fetch a single organization by its ID
 * ************************** */
async function getOrganizationById(id) {
    try {
        // Look up a specific organization by ID to display its detailed profile
        const result = await pool.query(
            "SELECT organization_id, name, description, website, contact_email, image_path FROM organization WHERE organization_id = $1;",
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Failed to fetch organization with ID " + id + ": ", error);
        throw error;
    }
}

export default {
    getAllOrganizations,
    getOrganizationById
};