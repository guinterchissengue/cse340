import pool from '../database/connection.js';

/* ***************************
 * Fetch a single user by email, including the password hash needed
 * for login. Only the login flow should ever read password_hash.
 * ************************** */
async function getUserByEmail(email) {
    try {
        const result = await pool.query(
            "SELECT user_id, name, email, password_hash, role FROM app_user WHERE email = $1;",
            [email]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Failed to fetch user by email: ", error);
        throw error;
    }
}

/* ***************************
 * Fetch every registered user for the admin Users page. Deliberately
 * excludes password_hash -- that view never needs it.
 * ************************** */
async function getAllUsers() {
    try {
        const result = await pool.query(
            "SELECT user_id, name, email, role FROM app_user ORDER BY name;"
        );
        return result.rows;
    } catch (error) {
        console.error("Failed to fetch users list: ", error);
        throw error;
    }
}

/* ***************************
 * Insert a new user. Role defaults to 'user' -- there is no way for
 * registration to create an admin account.
 * ************************** */
async function createUser(user) {
    const { name, email, password_hash, role } = user;

    try {
        const result = await pool.query(
            `INSERT INTO app_user (name, email, password_hash, role)
             VALUES ($1, $2, $3, $4)
             RETURNING user_id, name, email, role;`,
            [name, email, password_hash, role || 'user']
        );
        return result.rows[0];
    } catch (error) {
        console.error("Failed to create user: ", error);
        throw error;
    }
}

export default {
    getUserByEmail,
    getAllUsers,
    createUser
};
