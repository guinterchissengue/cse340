// src/models/categories.js
import pool from '../database/connection.js';

/**
 * Fetch all available service project categories from the database.
 * Sorted alphabetically to keep the UI clean and predictable.
 *
 * @returns {Promise<Array>} List of category objects
 */
async function getAllCategories() {
    // Corrigido de 'categories' para 'category' para bater certo com a estrutura da base de dados
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

export default {
    getAllCategories
};