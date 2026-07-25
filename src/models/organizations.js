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

/* ***************************
 * Insert a new organization into the database
 * ************************** */
async function createOrganization(organization) {
    const { name, description, website, contact_email, image_path } = organization;

    try {
        const result = await pool.query(
            `INSERT INTO organization (name, description, website, contact_email, image_path)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING organization_id, name, description, website, contact_email, image_path;`,
            [name, description, website || null, contact_email, image_path || null]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Failed to create organization: ", error);
        throw error;
    }
}

/* ***************************
 * Update an existing organization
 * ************************** */
async function updateOrganization(id, organization) {
    const { name, description, website, contact_email, image_path } = organization;

    try {
        const result = await pool.query(
            `UPDATE organization
             SET name = $1, description = $2, website = $3, contact_email = $4, image_path = $5
             WHERE organization_id = $6
             RETURNING organization_id, name, description, website, contact_email, image_path;`,
            [name, description, website || null, contact_email, image_path || null, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Failed to update organization with ID " + id + ": ", error);
        throw error;
    }
}

export default {
    getAllOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization
};
