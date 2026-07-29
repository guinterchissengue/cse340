// src/middleware/auth.js
// Route-guarding middleware shared by every protected route. Both
// functions read the logged-in user off the session, which is only
// ever set in one place: userController.postLogin/postRegister (in
// src/controllers/user.js). They
// must run after express-session and connect-flash are configured in
// server.js (they already run first for every request).

/* ***************************
 * Require an authenticated session.
 * Anonymous visitors are redirected to the login page with a flash
 * message explaining why.
 * ************************** */
function requireLogin(req, res, next) {
    if (!req.session || !req.session.user) {
        req.flash('error', 'Please log in to access that page.');
        return res.redirect('/login');
    }
    next();
}

/* ***************************
 * Require the logged-in user to hold a specific role (e.g. 'admin').
 * Always place requireLogin earlier in the route chain so a missing
 * session is caught by that message instead of this one -- this
 * function still checks defensively in case it's ever used alone.
 * ************************** */
function requireRole(role) {
    return function (req, res, next) {
        if (!req.session || !req.session.user) {
            req.flash('error', 'Please log in to access that page.');
            return res.redirect('/login');
        }

        if (req.session.user.role !== role) {
            req.flash('error', 'You do not have permission to access that page.');
            return res.redirect('/dashboard');
        }

        next();
    };
}

export { requireLogin, requireRole };
