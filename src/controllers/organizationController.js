// src/controllers/organizationController.js
// Controllers contain no SQL -- they call the model layer for data,
// then choose which view to render and what to pass it.
import organizationModel from '../models/organizations.js';
import projectModel from '../models/projects.js';

/* ***************************
 * GET /organizations - list every organization
 * ************************** */
async function getOrganizations(req, res, next) {
    try {
        const organizationsList = await organizationModel.getAllOrganizations();
        res.render('organizations', {
            title: 'Organizations',
            organizations: organizationsList
        });
    } catch (error) {
        console.error('Controller Error in getOrganizations:', error);
        next(error);
    }
}

/* ***************************
 * GET /organization/:id - a single organization's profile, plus the
 * service projects it leads
 * ************************** */
async function getOrganizationDetails(req, res, next) {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(404).render('404', { title: 'Organization Not Found' });
        }

        const organization = await organizationModel.getOrganizationById(id);

        if (!organization) {
            return res.status(404).render('404', { title: 'Organization Not Found' });
        }

        const projects = await projectModel.getProjectsByOrganizationId(id);

        res.render('organization-details', {
            title: organization.name,
            organization,
            projects
        });
    } catch (error) {
        console.error('Controller Error in getOrganizationDetails:', error);
        next(error);
    }
}

export default {
    getOrganizations,
    getOrganizationDetails
};
