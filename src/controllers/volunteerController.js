// src/controllers/volunteerController.js
// Controllers contain no SQL -- they call the model layer for data,
// then choose which view to render and what to pass it.
import volunteerModel from '../models/volunteers.js';
import projectModel from '../models/projects.js';

// Only these two values are ever legitimate "come back here after
// this action" destinations, so anything else falls back to the
// project page -- this keeps redirect_to from being usable as an
// open redirect.
function resolveRedirect(redirectTo, projectId) {
    return redirectTo === '/dashboard' ? '/dashboard' : `/project/${projectId}`;
}

/* ***************************
 * POST /project/:id/volunteer - sign the logged-in user up to
 * volunteer for a project (requireLogin runs first in the route chain)
 * ************************** */
async function postVolunteer(req, res, next) {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(404).render('404', { title: 'Project Not Found' });
        }

        const project = await projectModel.getProjectById(id);

        if (!project) {
            req.flash('error', 'That project no longer exists.');
            return res.redirect('/projects');
        }

        const signup = await volunteerModel.addVolunteer(req.session.user.id, id);

        if (signup) {
            req.flash('success', `You're now volunteering for "${project.title}"!`);
        } else {
            // ON CONFLICT DO NOTHING means signup is undefined -- the
            // user was already volunteering. Not an error, just a
            // no-op, so the message stays friendly rather than scary.
            req.flash('success', `You're already volunteering for "${project.title}".`);
        }

        res.redirect(resolveRedirect(req.body.redirect_to, id));
    } catch (error) {
        console.error('Controller Error in postVolunteer:', error);
        next(error);
    }
}

/* ***************************
 * POST /project/:id/unvolunteer - remove the logged-in user's
 * volunteer signup for a project (requireLogin runs first)
 * ************************** */
async function postUnvolunteer(req, res, next) {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(404).render('404', { title: 'Project Not Found' });
        }

        // Removing a signup that doesn't exist isn't an error -- the
        // model just returns undefined and the end state (not
        // volunteering) is exactly what the user asked for either way.
        await volunteerModel.removeVolunteer(req.session.user.id, id);

        req.flash('success', 'You have been removed as a volunteer for this project.');
        res.redirect(resolveRedirect(req.body.redirect_to, id));
    } catch (error) {
        console.error('Controller Error in postUnvolunteer:', error);
        next(error);
    }
}

export default {
    postVolunteer,
    postUnvolunteer
};
