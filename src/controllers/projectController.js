// src/controllers/projectController.js
// Controllers contain no SQL -- they call the model layer for data,
// then choose which view to render and what to pass it.
import projectModel from '../models/projects.js';
import categoryModel from '../models/categories.js';
import organizationModel from '../models/organizations.js';
import volunteerModel from '../models/volunteers.js';
import { requireLength, requireDate } from '../utils/validation.js';

/* ***************************
 * GET /projects - list every service project
 * ************************** */
async function getProjects(req, res, next) {
    try {
        const projectsList = await projectModel.getAllProjects();
        res.render('projects', {
            title: 'Service Projects',
            projects: projectsList
        });
    } catch (error) {
        console.error('Controller Error in getProjects:', error);
        next(error);
    }
}

/* ***************************
 * GET /project/:id - a single project's details, plus every category
 * it has been tagged with
 * ************************** */
async function getProjectDetails(req, res, next) {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(404).render('404', { title: 'Project Not Found' });
        }

        const project = await projectModel.getProjectById(id);

        if (!project) {
            return res.status(404).render('404', { title: 'Project Not Found' });
        }

        const categories = await categoryModel.getCategoriesByProjectId(id);
        const volunteerCount = await volunteerModel.countVolunteersForProject(id);

        // Volunteer status only means something for a logged-in user,
        // so guests (currentUser is null) never trigger this query and
        // the view never sees an isVolunteering value for them.
        let isVolunteering = false;
        if (req.session.user) {
            isVolunteering = await volunteerModel.isVolunteering(req.session.user.id, id);
        }

        res.render('project-details', {
            title: project.title,
            project,
            categories,
            volunteerCount,
            isVolunteering
        });
    } catch (error) {
        console.error('Controller Error in getProjectDetails:', error);
        next(error);
    }
}

/* ***************************
 * Server-side validation for the project form fields.
 * Returns an array of error messages; an empty array means everything
 * submitted is valid.
 * ************************** */
function validateProject(body) {
    const errors = [];

    if (!/^\d+$/.test(body.organization_id || '')) {
        errors.push('Please select an organization.');
    }

    const titleError = requireLength(body.title, 'Project title', 3, 150);
    if (titleError) errors.push(titleError);

    const descriptionError = requireLength(body.description, 'Description', 10, 2000);
    if (descriptionError) errors.push(descriptionError);

    const locationError = requireLength(body.location, 'Location', 3, 150);
    if (locationError) errors.push(locationError);

    const dateError = requireDate(body.date, 'Date');
    if (dateError) errors.push(dateError);

    return errors;
}

/* ***************************
 * GET /new-project - render the empty Create Project form
 * ************************** */
async function getNewProjectForm(req, res, next) {
    try {
        const organizations = await organizationModel.getAllOrganizations();
        res.render('project-new', {
            title: 'Create Service Project',
            errors: [],
            values: { organization_id: '', title: '', description: '', location: '', date: '' },
            organizations
        });
    } catch (error) {
        console.error('Controller Error in getNewProjectForm:', error);
        next(error);
    }
}

/* ***************************
 * POST /new-project - validate submission and insert a new project
 * ************************** */
async function postNewProject(req, res, next) {
    try {
        const errors = validateProject(req.body);

        if (errors.length > 0) {
            const organizations = await organizationModel.getAllOrganizations();
            return res.status(400).render('project-new', {
                title: 'Create Service Project',
                errors,
                values: req.body,
                organizations
            });
        }

        const project = await projectModel.createProject(req.body);
        req.flash('success', `Project "${project.title}" was created successfully.`);
        res.redirect('/projects');
    } catch (error) {
        // Validation already passed, so a failure here is an unexpected
        // save error. Re-render the same form directly -- not a redirect
        // -- so the values the user just typed are never lost.
        console.error('Controller Error in postNewProject:', error);
        try {
            const organizations = await organizationModel.getAllOrganizations();
            res.status(500).render('project-new', {
                title: 'Create Service Project',
                errors: ['An unexpected error occurred while saving. Please try again.'],
                values: req.body,
                organizations
            });
        } catch (innerError) {
            next(innerError);
        }
    }
}

/* ***************************
 * GET /edit-project/:id - load an existing project and pre-populate
 * the form
 * ************************** */
async function getEditProjectForm(req, res, next) {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(404).render('404', { title: 'Project Not Found' });
        }

        const project = await projectModel.getProjectById(id);

        if (!project) {
            return res.status(404).render('404', { title: 'Project Not Found' });
        }

        const organizations = await organizationModel.getAllOrganizations();

        res.render('project-edit', {
            title: 'Edit Service Project',
            errors: [],
            values: project,
            projectId: project.project_id,
            organizations
        });
    } catch (error) {
        console.error('Controller Error in getEditProjectForm:', error);
        next(error);
    }
}

/* ***************************
 * POST /edit-project/:id - validate submission and update the project
 * ************************** */
async function postEditProject(req, res, next) {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(404).render('404', { title: 'Project Not Found' });
        }

        const errors = validateProject(req.body);

        if (errors.length > 0) {
            const organizations = await organizationModel.getAllOrganizations();
            return res.status(400).render('project-edit', {
                title: 'Edit Service Project',
                errors,
                values: req.body,
                projectId: id,
                organizations
            });
        }

        const updated = await projectModel.updateProject(id, req.body);

        if (!updated) {
            return res.status(404).render('404', { title: 'Project Not Found' });
        }

        req.flash('success', `Project "${updated.title}" was updated successfully.`);
        res.redirect('/projects');
    } catch (error) {
        console.error('Controller Error in postEditProject:', error);
        try {
            const organizations = await organizationModel.getAllOrganizations();
            res.status(500).render('project-edit', {
                title: 'Edit Service Project',
                errors: ['An unexpected error occurred while saving. Please try again.'],
                values: req.body,
                projectId: req.params.id,
                organizations
            });
        } catch (innerError) {
            next(innerError);
        }
    }
}

/* ***************************
 * GET /project/:id/categories - the "Update Categories" checkbox page.
 * Loads every category and marks which ones are already assigned to
 * this project so the checkboxes render pre-checked.
 * ************************** */
async function getAssignCategoriesForm(req, res, next) {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(404).render('404', { title: 'Project Not Found' });
        }

        const project = await projectModel.getProjectById(id);

        if (!project) {
            return res.status(404).render('404', { title: 'Project Not Found' });
        }

        const allCategories = await categoryModel.getAllCategories();
        const assignedCategories = await categoryModel.getCategoriesByProjectId(id);
        const assignedIds = new Set(assignedCategories.map((category) => category.category_id));

        const categoryOptions = allCategories.map((category) => ({
            category_id: category.category_id,
            name: category.name,
            checked: assignedIds.has(category.category_id)
        }));

        res.render('project-categories', {
            title: `Update Categories – ${project.title}`,
            project,
            categoryOptions
        });
    } catch (error) {
        console.error('Controller Error in getAssignCategoriesForm:', error);
        next(error);
    }
}

/* ***************************
 * POST /project/:id/categories - save the checked/unchecked category
 * assignments for a project
 * ************************** */
async function postAssignCategories(req, res, next) {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(404).render('404', { title: 'Project Not Found' });
        }

        const project = await projectModel.getProjectById(id);

        if (!project) {
            return res.status(404).render('404', { title: 'Project Not Found' });
        }

        // Checkbox groups only submit checked boxes. An unchecked group
        // (0 boxes checked) means req.body.category_ids is missing
        // entirely -- normalize that to an empty array so "no categories
        // selected" correctly clears every assignment instead of erroring.
        let { category_ids } = req.body;
        if (!category_ids) {
            category_ids = [];
        } else if (!Array.isArray(category_ids)) {
            category_ids = [category_ids];
        }

        await categoryModel.setCategoriesForProject(id, category_ids);

        req.flash('success', `Categories for "${project.title}" were updated successfully.`);
        res.redirect(`/project/${id}`);
    } catch (error) {
        // The transaction rolled back in the model, so nothing was
        // half-saved. Flash an error and send the user back to the same
        // assignment page to retry -- this is a genuine save failure,
        // not a validation issue, so a flash + redirect (rather than a
        // same-request re-render) is the right pattern here.
        console.error('Controller Error in postAssignCategories:', error);
        req.flash('error', 'Something went wrong while saving category assignments. Please try again.');
        res.redirect(`/project/${req.params.id}/categories`);
    }
}

export default {
    getProjects,
    getProjectDetails,
    getNewProjectForm,
    postNewProject,
    getEditProjectForm,
    postEditProject,
    getAssignCategoriesForm,
    postAssignCategories
};
