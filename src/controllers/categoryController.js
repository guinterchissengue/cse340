// src/controllers/categoryController.js
// Controllers contain no SQL -- they call the model layer for data,
// then choose which view to render and what to pass it.
import categoryModel from '../models/categories.js';
import projectModel from '../models/projects.js';
import { requireLength } from '../utils/validation.js';

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

/* ***************************
 * Server-side validation for the category_name field.
 * Returns an array of error messages; an empty array means the value
 * is valid.
 * ************************** */
function validateCategoryName(categoryName) {
    const errors = [];
    const lengthError = requireLength(categoryName, 'Category name', 3, 100);
    if (lengthError) errors.push(lengthError);
    return errors;
}

/* ***************************
 * GET /new-category - render the empty Create Category form
 * ************************** */
async function getNewCategoryForm(req, res) {
    res.render('category-new', {
        title: 'Create Category',
        errors: [],
        values: { category_name: '' }
    });
}

/* ***************************
 * POST /new-category - validate submission and insert a new category
 * ************************** */
async function postNewCategory(req, res, next) {
    const { category_name } = req.body;
    const errors = validateCategoryName(category_name);

    if (errors.length > 0) {
        return res.status(400).render('category-new', {
            title: 'Create Category',
            errors,
            values: { category_name: category_name || '' }
        });
    }

    try {
        const category = await categoryModel.createCategory(category_name.trim());
        req.flash('success', `Category "${category.name}" was created successfully.`);
        res.redirect('/categories');
    } catch (error) {
        console.error('Controller Error in postNewCategory:', error);

        // A UNIQUE constraint on category.name (Postgres code 23505) means
        // this exact name already exists -- show that as a normal
        // validation-style error instead of a generic 500.
        const message = error.code === '23505'
            ? 'A category with that name already exists.'
            : 'An unexpected error occurred while saving. Please try again.';

        res.status(error.code === '23505' ? 400 : 500).render('category-new', {
            title: 'Create Category',
            errors: [message],
            values: { category_name: category_name || '' }
        });
    }
}

/* ***************************
 * GET /edit-category/:id - load an existing category and pre-populate
 * the form
 * ************************** */
async function getEditCategoryForm(req, res, next) {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(404).render('404', { title: 'Category Not Found' });
        }

        const category = await categoryModel.getCategoryById(id);

        if (!category) {
            return res.status(404).render('404', { title: 'Category Not Found' });
        }

        res.render('category-edit', {
            title: 'Edit Category',
            errors: [],
            values: { category_name: category.name },
            categoryId: category.category_id
        });
    } catch (error) {
        console.error('Controller Error in getEditCategoryForm:', error);
        next(error);
    }
}

/* ***************************
 * POST /edit-category/:id - validate submission and update an existing
 * category
 * ************************** */
async function postEditCategory(req, res, next) {
    const { id } = req.params;
    const { category_name } = req.body;

    if (!/^\d+$/.test(id)) {
        return res.status(404).render('404', { title: 'Category Not Found' });
    }

    const errors = validateCategoryName(category_name);

    if (errors.length > 0) {
        return res.status(400).render('category-edit', {
            title: 'Edit Category',
            errors,
            values: { category_name: category_name || '' },
            categoryId: id
        });
    }

    try {
        const updated = await categoryModel.updateCategory(id, category_name.trim());

        if (!updated) {
            return res.status(404).render('404', { title: 'Category Not Found' });
        }

        req.flash('success', `Category "${updated.name}" was updated successfully.`);
        res.redirect('/categories');
    } catch (error) {
        console.error('Controller Error in postEditCategory:', error);

        const message = error.code === '23505'
            ? 'A category with that name already exists.'
            : 'An unexpected error occurred while saving. Please try again.';

        res.status(error.code === '23505' ? 400 : 500).render('category-edit', {
            title: 'Edit Category',
            errors: [message],
            values: { category_name: category_name || '' },
            categoryId: id
        });
    }
}

export default {
    getCategories,
    getCategoryDetails,
    getNewCategoryForm,
    postNewCategory,
    getEditCategoryForm,
    postEditCategory
};
