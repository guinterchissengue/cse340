const pool = require('../database/connection');

/* ***************************
 *  Get all organizations
 * ************************** */
async function getOrganizations() {
    try {
        // Retrieve all organizations, sorted alphabetically by name
        const result = await pool.query(
            "SELECT organization_id, name, description, website, contact_email, image_path FROM organization ORDER BY name;"
        );
        return result.rows;
    } catch (error) {
        console.error("getOrganizations error: " + error);
        throw error;
    }
}

/* ***************************
 *  Get organization by ID
 * ************************** */
async function getOrganizationById(id) {
    try {
        // Retrieve a single organization using its unique ID
        const result = await pool.query(
            "SELECT organization_id, name, description, website, contact_email, image_path FROM organization WHERE organization_id = $1;",
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("getOrganizationById error: " + error);
        throw error;
    }
}

module.exports = {
    getOrganizations,
    getOrganizationById
};