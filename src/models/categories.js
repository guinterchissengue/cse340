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

/**
 * Insert a new category into the database.
 *
 * @param {string} name - The category name to insert
 * @returns {Promise<Object>} The newly created category row
 */
async function createCategory(name) {
    const queryText = 'INSERT INTO category (name) VALUES ($1) RETURNING category_id, name;';

    try {
        const result = await pool.query(queryText, [name]);
        return result.rows[0];
    } catch (error) {
        console.error('Database Error in createCategory model:', error.message);
        throw error;
    }
}

/**
 * Update an existing category's name.
 *
 * @param {number|string} id - The category_id to update
 * @param {string} name - The new category name
 * @returns {Promise<Object|undefined>} The updated category row, or undefined if no match
 */
async function updateCategory(id, name) {
    const queryText = 'UPDATE category SET name = $1 WHERE category_id = $2 RETURNING category_id, name;';

    try {
        const result = await pool.query(queryText, [name, id]);
        return result.rows[0];
    } catch (error) {
        console.error('Database Error in updateCategory model:', error.message);
        throw error;
    }
}

/**
 * Replace every category assignment for a project with the given list
 * of category IDs -- removes assignments that were unchecked and adds
 * ones that were newly checked. Wrapped in a transaction so the delete
 * and the inserts either all succeed or all roll back together,
 * preventing a half-saved assignment list if something fails midway.
 *
 * @param {number|string} projectId - The project_id being updated
 * @param {Array<number|string>} categoryIds - The full set of category_ids that should remain assigned (an empty array clears all assignments)
 * @returns {Promise<void>}
 */
async function setCategoriesForProject(projectId, categoryIds) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Start clean: remove every existing assignment for this project
        await client.query('DELETE FROM project_category WHERE project_id = $1;', [projectId]);

        // Re-insert only the categories that are currently checked.
        // ON CONFLICT DO NOTHING guards against duplicate rows if the
        // same category_id were ever submitted twice in one request.
        if (categoryIds.length > 0) {
            const values = categoryIds.map((_, index) => `($1, $${index + 2})`).join(', ');
            await client.query(
                `INSERT INTO project_category (project_id, category_id)
                 VALUES ${values}
                 ON CONFLICT (project_id, category_id) DO NOTHING;`,
                [projectId, ...categoryIds]
            );
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Database Error in setCategoriesForProject model:', error.message);
        throw error;
    } finally {
        client.release();
    }
}

export default {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    createCategory,
    updateCategory,
    setCategoriesForProject
};
