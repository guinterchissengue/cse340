// src/controllers/organizationController.js
// Controllers contain no SQL -- they call the model layer for data,
// then choose which view to render and what to pass it.
import organizationModel from '../models/organizations.js';
import projectModel from '../models/projects.js';
import { requireLength, requireEmail, optionalMaxLength } from '../utils/validation.js';

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

/* ***************************
 * Server-side validation for the organization form fields.
 * Returns an array of error messages; an empty array means everything
 * submitted is valid.
 * ************************** */
function validateOrganization(body) {
    const errors = [];

    const nameError = requireLength(body.name, 'Organization name', 3, 150);
    if (nameError) errors.push(nameError);

    const descriptionError = requireLength(body.description, 'Description', 10, 2000);
    if (descriptionError) errors.push(descriptionError);

    const emailError = requireEmail(body.contact_email, 'Contact email');
    if (emailError) errors.push(emailError);

    const websiteError = optionalMaxLength(body.website, 'Website', 255);
    if (websiteError) errors.push(websiteError);

    const imagePathError = optionalMaxLength(body.image_path, 'Image path', 255);
    if (imagePathError) errors.push(imagePathError);

    return errors;
}

/* ***************************
 * GET /new-organization - render the empty Create Organization form
 * ************************** */
async function getNewOrganizationForm(req, res) {
    res.render('organization-new', {
        title: 'Create Organization',
        errors: [],
        values: { name: '', description: '', website: '', contact_email: '', image_path: '' }
    });
}

/* ***************************
 * POST /new-organization - validate submission and insert a new organization
 * ************************** */
async function postNewOrganization(req, res, next) {
    const errors = validateOrganization(req.body);

    if (errors.length > 0) {
        return res.status(400).render('organization-new', {
            title: 'Create Organization',
            errors,
            values: req.body
        });
    }

    try {
        const organization = await organizationModel.createOrganization(req.body);
        req.flash('success', `Organization "${organization.name}" was created successfully.`);
        res.redirect('/organizations');
    } catch (error) {
        // Validation already passed, so a failure here is an unexpected
        // save error (e.g. a dropped DB connection). Re-render the same
        // form directly -- not a redirect -- so the values the user just
        // typed are never lost.
        console.error('Controller Error in postNewOrganization:', error);
        res.status(500).render('organization-new', {
            title: 'Create Organization',
            errors: ['An unexpected error occurred while saving. Please try again.'],
            values: req.body
        });
    }
}

/* ***************************
 * GET /edit-organization/:id - load an existing organization and
 * pre-populate the form
 * ************************** */
async function getEditOrganizationForm(req, res, next) {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(404).render('404', { title: 'Organization Not Found' });
        }

        const organization = await organizationModel.getOrganizationById(id);

        if (!organization) {
            return res.status(404).render('404', { title: 'Organization Not Found' });
        }

        res.render('organization-edit', {
            title: 'Edit Organization',
            errors: [],
            values: organization,
            organizationId: organization.organization_id
        });
    } catch (error) {
        console.error('Controller Error in getEditOrganizationForm:', error);
        next(error);
    }
}

/* ***************************
 * POST /edit-organization/:id - validate submission and update the
 * organization
 * ************************** */
async function postEditOrganization(req, res, next) {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
        return res.status(404).render('404', { title: 'Organization Not Found' });
    }

    const errors = validateOrganization(req.body);

    if (errors.length > 0) {
        return res.status(400).render('organization-edit', {
            title: 'Edit Organization',
            errors,
            values: req.body,
            organizationId: id
        });
    }

    try {
        const updated = await organizationModel.updateOrganization(id, req.body);

        if (!updated) {
            return res.status(404).render('404', { title: 'Organization Not Found' });
        }

        req.flash('success', `Organization "${updated.name}" was updated successfully.`);
        res.redirect('/organizations');
    } catch (error) {
        console.error('Controller Error in postEditOrganization:', error);
        res.status(500).render('organization-edit', {
            title: 'Edit Organization',
            errors: ['An unexpected error occurred while saving. Please try again.'],
            values: req.body,
            organizationId: id
        });
    }
}

export default {
    getOrganizations,
    getOrganizationDetails,
    getNewOrganizationForm,
    postNewOrganization,
    getEditOrganizationForm,
    postEditOrganization
};
