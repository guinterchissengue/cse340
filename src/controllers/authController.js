// src/controllers/authController.js
// Controllers contain no SQL -- they call the model layer for data,
// then choose which view to render and what to pass it.
import bcrypt from 'bcryptjs';
import userModel from '../models/users.js';
import volunteerModel from '../models/volunteers.js';
import { requireLength, requireEmail } from '../utils/validation.js';

const SALT_ROUNDS = 10;

/* ***************************
 * Server-side validation for the registration form fields.
 * Returns an array of error messages; an empty array means everything
 * submitted is valid.
 * ************************** */
function validateRegistration(body) {
    const errors = [];

    const nameError = requireLength(body.name, 'Name', 2, 150);
    if (nameError) errors.push(nameError);

    const emailError = requireEmail(body.email, 'Email');
    if (emailError) errors.push(emailError);

    const passwordError = requireLength(body.password, 'Password', 8, 100);
    if (passwordError) errors.push(passwordError);

    if (body.password && body.confirm_password && body.password !== body.confirm_password) {
        errors.push('Password and Confirm Password must match.');
    }

    return errors;
}

/* ***************************
 * GET /register - render the empty Register form
 * ************************** */
async function getRegisterForm(req, res) {
    res.render('register', {
        title: 'Register',
        errors: [],
        values: { name: '', email: '' }
    });
}

/* ***************************
 * POST /register - validate submission, hash the password, create the
 * user (always role 'user'), and log them straight in
 * ************************** */
async function postRegister(req, res, next) {
    const errors = validateRegistration(req.body);
    const email = (req.body.email || '').trim().toLowerCase();

    if (errors.length === 0) {
        try {
            const existing = await userModel.getUserByEmail(email);
            if (existing) {
                errors.push('An account with that email already exists.');
            }
        } catch (error) {
            console.error('Controller Error in postRegister (email lookup):', error);
            return next(error);
        }
    }

    if (errors.length > 0) {
        return res.status(400).render('register', {
            title: 'Register',
            errors,
            values: { name: req.body.name || '', email: req.body.email || '' }
        });
    }

    try {
        const passwordHash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
        const user = await userModel.createUser({
            name: req.body.name.trim(),
            email,
            password_hash: passwordHash,
            role: 'user'
        });

        req.session.user = { id: user.user_id, name: user.name, email: user.email, role: user.role };
        req.flash('success', `Welcome, ${user.name}! Your account was created successfully.`);
        res.redirect('/dashboard');
    } catch (error) {
        // Validation already passed, so a failure here is an unexpected
        // save error -- re-render the same form directly (not a
        // redirect) so the values the user just typed are never lost.
        console.error('Controller Error in postRegister:', error);
        res.status(500).render('register', {
            title: 'Register',
            errors: ['An unexpected error occurred while creating your account. Please try again.'],
            values: { name: req.body.name || '', email: req.body.email || '' }
        });
    }
}

/* ***************************
 * GET /login - render the empty Log In form
 * ************************** */
async function getLoginForm(req, res) {
    res.render('login', {
        title: 'Log In',
        errors: [],
        values: { email: '' }
    });
}

/* ***************************
 * POST /login - verify credentials and start the session
 * ************************** */
async function postLogin(req, res, next) {
    const { email, password } = req.body;
    // Same message whether the email doesn't exist or the password is
    // wrong, so a login attempt can't be used to discover which
    // emails are registered.
    const genericError = 'Invalid email or password.';

    try {
        const normalizedEmail = (email || '').trim().toLowerCase();
        const user = normalizedEmail ? await userModel.getUserByEmail(normalizedEmail) : null;
        const passwordMatches = user ? await bcrypt.compare(password || '', user.password_hash) : false;

        if (!user || !passwordMatches) {
            return res.status(400).render('login', {
                title: 'Log In',
                errors: [genericError],
                values: { email: email || '' }
            });
        }

        req.session.user = { id: user.user_id, name: user.name, email: user.email, role: user.role };
        req.flash('success', `Welcome back, ${user.name}!`);
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Controller Error in postLogin:', error);
        next(error);
    }
}

/* ***************************
 * GET /logout - clear the session and return to the home page
 * ************************** */
function getLogout(req, res) {
    req.session.user = null;
    req.flash('success', 'You have been logged out.');
    res.redirect('/');
}

/* ***************************
 * GET /dashboard - the logged-in landing page; requireLogin runs
 * first, so req.session.user is guaranteed to exist here
 * ************************** */
async function getDashboard(req, res, next) {
    try {
        const volunteeredProjects = await volunteerModel.getVolunteeredProjectsByUserId(req.session.user.id);
        res.render('dashboard', {
            title: 'Dashboard',
            user: req.session.user,
            volunteeredProjects
        });
    } catch (error) {
        console.error('Controller Error in getDashboard:', error);
        next(error);
    }
}

export default {
    getRegisterForm,
    postRegister,
    getLoginForm,
    postLogin,
    getLogout,
    getDashboard
};
