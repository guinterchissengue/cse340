// src/controllers/categoryController.js
// Controllers contain no SQL -- they call the model layer for data,
// then choose which view to render and what to pass it.
import categoryModel from '../models/categories.js';
import projectModel from '../models/projects.js';

/* ***************************
 * GET /categories - list every category
 * ************************** */
async function getCategories(req, res, next) {
    try {
        const categoriesList = await categoryModel.getAllCategories();
        res.render('categories', {
            title: 'Project Categories',
            categories: categoriesList
        });
    } catch (error) {
        console.error('Controller Error in getCategories:', error);
        next(error);
    }
}

/* ***************************
 * GET /category/:id - a single category, plus every service project
 * tagged with it
 * ************************** */
async function getCategoryDetails(req, res, next) {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(404).render('404', { title: 'Category Not Found' });
        }

        const category = await categoryModel.getCategoryById(id);

        if (!category) {
            return res.status(404).render('404', { title: 'Category Not Found' });
        }

        const projects = await projectModel.getProjectsByCategoryId(id);

        res.render('category-details', {
            title: category.name,
            category,
            projects
        });
    } catch (error) {
        console.error('Controller Error in getCategoryDetails:', error);
        next(error);
    }
}

export default {
    getCategories,
    getCategoryDetails
};
