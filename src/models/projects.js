const pool = require('../database/connection');

/* ***************************
 *  Get all projects
 * ************************** */
async function getProjects() {
    try {
        // Retrieve every project together with its organization's name
        const result = await pool.query(`
            SELECT p.project_id, p.organization_id, p.title, p.description, p.location, p.date, o.name AS organization_name 
            FROM project p 
            JOIN organization o ON p.organization_id = o.organization_id 
            ORDER BY p.date DESC;
        `);
        return result.rows;
    } catch (error) {
        console.error("getProjects error: " + error);
        throw error;
    }
}

/* ***************************
 *  Get projects by organization ID
 * ************************** */
async function getProjectsByOrganizationId(orgId) {
    try {
        // Retrieve all projects that belong to the selected organization
        const result = await pool.query(`
            SELECT p.project_id, p.organization_id, p.title, p.description, p.location, p.date, o.name AS organization_name 
            FROM project p 
            JOIN organization o ON p.organization_id = o.organization_id 
            WHERE p.organization_id = $1
            ORDER BY p.date DESC;
        `, [orgId]);
        return result.rows;
    } catch (error) {
        console.error("getProjectsByOrganizationId error: " + error);
        throw error;
    }
}

module.exports = {
    getProjects,
    getProjectsByOrganizationId
};
