import pool from '../database/connection.js';

/* ***************************
 * Fetch all projects from the database, along with the organization
 * that leads each one and the list of categories (id + name) each
 * project belongs to (via the project_category join table).
 * ************************** */
async function getAllProjects() {
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
                COALESCE(
                    json_agg(
                        json_build_object('category_id', c.category_id, 'name', c.name)
                        ORDER BY c.name
                    ) FILTER (WHERE c.category_id IS NOT NULL),
                    '[]'
                ) AS categories
            FROM project p
            JOIN organization o ON p.organization_id = o.organization_id
            LEFT JOIN project_category pc ON pc.project_id = p.project_id
            LEFT JOIN category c ON c.category_id = pc.category_id
            GROUP BY p.project_id, o.name
            ORDER BY p.date DESC;
        `);
        return result.rows;
    } catch (error) {
        console.error("Failed to fetch projects list: ", error);
        throw error;
    }
}

/* ***************************
 * Fetch projects filtered by organization ID, including their categories
 * ************************** */
async function getProjectsByOrganizationId(orgId) {
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
                COALESCE(
                    json_agg(
                        json_build_object('category_id', c.category_id, 'name', c.name)
                        ORDER BY c.name
                    ) FILTER (WHERE c.category_id IS NOT NULL),
                    '[]'
                ) AS categories
            FROM project p
            JOIN organization o ON p.organization_id = o.organization_id
            LEFT JOIN project_category pc ON pc.project_id = p.project_id
            LEFT JOIN category c ON c.category_id = pc.category_id
            WHERE p.organization_id = $1
            GROUP BY p.project_id, o.name
            ORDER BY p.date DESC;
        `, [orgId]);
        return result.rows;
    } catch (error) {
        console.error("Failed to fetch projects for organization ID " + orgId + ": ", error);
        throw error;
    }
}

/* ***************************
 * Fetch a single project by its ID, along with the name of the
 * organization that leads it. Categories are fetched separately via
 * categoryModel.getCategoriesByProjectId(), matching the assignment's
 * required model layout.
 * ************************** */
async function getProjectById(id) {
    try {
        const result = await pool.query(`
            SELECT
                p.project_id,
                p.organization_id,
                p.title,
                p.description,
                p.location,
                p.date,
                o.name AS organization_name
            FROM project p
            JOIN organization o ON p.organization_id = o.organization_id
            WHERE p.project_id = $1;
        `, [id]);
        return result.rows[0];
    } catch (error) {
        console.error("Failed to fetch project with ID " + id + ": ", error);
        throw error;
    }
}

/* ***************************
 * Fetch every project tagged with a given category ID, along with the
 * organization that leads each one.
 * ************************** */
async function getProjectsByCategoryId(categoryId) {
    try {
        const result = await pool.query(`
            SELECT
                p.project_id,
                p.organization_id,
                p.title,
                p.description,
                p.location,
                p.date,
                o.name AS organization_name
            FROM project p
            JOIN organization o ON p.organization_id = o.organization_id
            JOIN project_category pc ON pc.project_id = p.project_id
            WHERE pc.category_id = $1
            ORDER BY p.date DESC;
        `, [categoryId]);
        return result.rows;
    } catch (error) {
        console.error("Failed to fetch projects for category ID " + categoryId + ": ", error);
        throw error;
    }
}

export default {
    getAllProjects,
    getProjectsByOrganizationId,
    getProjectById,
    getProjectsByCategoryId
};
