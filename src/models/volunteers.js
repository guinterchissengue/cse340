import pool from '../database/connection.js';

/* ***************************
 * Add a user as a volunteer for a project. ON CONFLICT DO NOTHING
 * relies on the (user_id, project_id) UNIQUE constraint to silently
 * no-op a duplicate signup instead of throwing -- returns the new row,
 * or undefined if the user was already volunteering for that project.
 * ************************** */
async function addVolunteer(userId, projectId) {
    try {
        const result = await pool.query(
            `INSERT INTO volunteer (user_id, project_id)
             VALUES ($1, $2)
             ON CONFLICT (user_id, project_id) DO NOTHING
             RETURNING volunteer_id, user_id, project_id, created_at;`,
            [userId, projectId]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Failed to add volunteer (user " + userId + ", project " + projectId + "): ", error);
        throw error;
    }
}

/* ***************************
 * Remove a user's volunteer signup for a project. Returns the deleted
 * row, or undefined if that signup didn't exist -- callers can treat
 * a missing row as "already removed" rather than an error.
 * ************************** */
async function removeVolunteer(userId, projectId) {
    try {
        const result = await pool.query(
            `DELETE FROM volunteer
             WHERE user_id = $1 AND project_id = $2
             RETURNING volunteer_id, user_id, project_id;`,
            [userId, projectId]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Failed to remove volunteer (user " + userId + ", project " + projectId + "): ", error);
        throw error;
    }
}

/* ***************************
 * Check whether a user is already volunteering for a project.
 * ************************** */
async function isVolunteering(userId, projectId) {
    try {
        const result = await pool.query(
            "SELECT 1 FROM volunteer WHERE user_id = $1 AND project_id = $2;",
            [userId, projectId]
        );
        return result.rowCount > 0;
    } catch (error) {
        console.error("Failed to check volunteer status (user " + userId + ", project " + projectId + "): ", error);
        throw error;
    }
}

/* ***************************
 * Fetch every project a user has volunteered for, along with the
 * organization that leads each one, for the "My Volunteer Projects"
 * dashboard section.
 * ************************** */
async function getVolunteeredProjectsByUserId(userId) {
    try {
        const result = await pool.query(`
            SELECT
                p.project_id,
                p.organization_id,
                p.title,
                p.description,
                p.location,
                p.date,
                o.name AS organization_name,
                v.created_at AS volunteered_at
            FROM volunteer v
            JOIN project p ON p.project_id = v.project_id
            JOIN organization o ON o.organization_id = p.organization_id
            WHERE v.user_id = $1
            ORDER BY v.created_at DESC;
        `, [userId]);
        return result.rows;
    } catch (error) {
        console.error("Failed to fetch volunteered projects for user ID " + userId + ": ", error);
        throw error;
    }
}

/* ***************************
 * Count how many volunteers a project currently has -- shown as a
 * small "X volunteers so far" note on the project details page.
 * ************************** */
async function countVolunteersForProject(projectId) {
    try {
        const result = await pool.query(
            "SELECT COUNT(*)::int AS volunteer_count FROM volunteer WHERE project_id = $1;",
            [projectId]
        );
        return result.rows[0].volunteer_count;
    } catch (error) {
        console.error("Failed to count volunteers for project ID " + projectId + ": ", error);
        throw error;
    }
}

export default {
    addVolunteer,
    removeVolunteer,
    isVolunteering,
    getVolunteeredProjectsByUserId,
    countVolunteersForProject
};
