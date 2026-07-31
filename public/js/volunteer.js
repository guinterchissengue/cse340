// public/js/volunteer.js
// Prevents a double-click/double-submit on the Volunteer / Remove
// Volunteer forms (project details page and dashboard). Progressive
// enhancement only -- the forms work fine without JS, this just
// disables the button right after the click so a slow request can't
// be submitted twice.
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.volunteer-panel form, .card-actions form').forEach(function (form) {
        form.addEventListener('submit', function () {
            const button = form.querySelector('button[type="submit"]');
            if (button) {
                button.disabled = true;
                button.textContent = 'Please wait…';
            }
        });
    });
});
