import pool from '../database/connection.js';

/* ***************************
 * Fetch all projects from the database
 * ************************** */
async function getProjects() {
    try {
        // Grab every project along with the organization's name to display on views
        const result = await pool.query(`
            SELECT p.project_id, p.organization_id, p.title, p.description, p.location, p.date, o.name AS organization_name 
            FROM project p 
            JOIN organization o ON p.organization_id = o.organization_id 
            ORDER BY p.date DESC;
        `);
        return result.rows;
    } catch (error) {
        console.error("Failed to fetch projects list: ", error);
        throw error;
    }
}

/* ***************************
 * Fetch projects filtered by organization ID
 * ************************** */
async function getProjectsByOrganizationId(orgId) {
    try {
        // Retrieve only the projects linked to a specific organization
        const result = await pool.query(`
            SELECT p.project_id, p.organization_id, p.title, p.description, p.location, p.date, o.name AS organization_name 
            FROM project p 
            JOIN organization o ON p.organization_id = o.organization_id 
            WHERE p.organization_id = $1
            ORDER BY p.date DESC;
        `, [orgId]);
        return result.rows;
    } catch (error) {
        console.error("Failed to fetch projects for organization ID " + orgId + ": ", error);
        throw error;
    }
}

export default {
    getProjects,
    getProjectsByOrganizationId
};