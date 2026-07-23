// src/controllers/homeController.js
// Controllers contain no SQL -- they call the model layer for data,
// then choose which view to render and what to pass it.

/* ***************************
 * GET / - the site's landing page
 * ************************** */
async function getHome(req, res) {
    res.render('index', { title: 'Home' });
}

export default {
    getHome
};
