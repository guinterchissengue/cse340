// src/controllers/userController.js
// Controllers contain no SQL -- they call the model layer for data,
// then choose which view to render and what to pass it.
import userModel from '../models/users.js';

/* ***************************
 * GET /users - list every registered user (admin only; requireLogin
 * and requireRole('admin') run first in the route chain)
 * ************************** */
async function getUsers(req, res, next) {
    try {
        const usersList = await userModel.getAllUsers();
        res.render('users', {
            title: 'Users',
            users: usersList
        });
    } catch (error) {
        console.error('Controller Error in getUsers:', error);
        next(error);
    }
}

export default {
    getUsers
};
