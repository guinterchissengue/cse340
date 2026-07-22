// src/controllers/projectController.js
// Controllers contain no SQL -- they call the model layer for data,
// then choose which view to render and what to pass it.
import projectModel from '../models/projects.js';
import categoryModel from '../models/categories.js';

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

        res.render('project-details', {
            title: project.title,
            project,
            categories
        });
    } catch (error) {
        console.error('Controller Error in getProjectDetails:', error);
        next(error);
    }
}

export default {
    getProjects,
    getProjectDetails
};
