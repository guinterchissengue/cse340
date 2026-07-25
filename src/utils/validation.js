// src/utils/validation.js
// Small, reusable, framework-free validation helpers shared by the
// organization/project/category controllers. Each helper returns an
// error message string when the value is invalid, or null when it's
// fine -- this keeps every controller's validate*() function short
// and avoids repeating the same length/required checks three times.

/**
 * Require a trimmed string field to be present and within a length range.
 *
 * @param {string} value - The raw submitted value
 * @param {string} label - Human-readable field name for the error message
 * @param {number} min - Minimum allowed length (after trimming)
 * @param {number} max - Maximum allowed length (after trimming)
 * @returns {string|null} An error message, or null if valid
 */
function requireLength(value, label, min, max) {
    const trimmed = (value || '').trim();

    if (trimmed.length === 0) {
        return `${label} is required.`;
    }
    if (trimmed.length < min) {
        return `${label} must be at least ${min} characters long.`;
    }
    if (trimmed.length > max) {
        return `${label} cannot exceed ${max} characters.`;
    }

    return null;
}

/**
 * Require a valid-looking email address.
 *
 * @param {string} value - The raw submitted value
 * @param {string} label - Human-readable field name for the error message
 * @returns {string|null} An error message, or null if valid
 */
function requireEmail(value, label) {
    const trimmed = (value || '').trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (trimmed.length === 0) {
        return `${label} is required.`;
    }
    if (!emailPattern.test(trimmed)) {
        return `${label} must be a valid email address.`;
    }

    return null;
}

/**
 * Require a valid calendar date (yyyy-mm-dd, matching an <input type="date">).
 *
 * @param {string} value - The raw submitted value
 * @param {string} label - Human-readable field name for the error message
 * @returns {string|null} An error message, or null if valid
 */
function requireDate(value, label) {
    const trimmed = (value || '').trim();

    if (trimmed.length === 0) {
        return `${label} is required.`;
    }
    if (Number.isNaN(new Date(trimmed).getTime())) {
        return `${label} must be a valid date.`;
    }

    return null;
}

/**
 * Optional field: only validated (against a max length) if the person
 * actually entered something. Used for fields like website/image_path
 * that aren't required.
 *
 * @param {string} value - The raw submitted value
 * @param {string} label - Human-readable field name for the error message
 * @param {number} max - Maximum allowed length (after trimming)
 * @returns {string|null} An error message, or null if valid/empty
 */
function optionalMaxLength(value, label, max) {
    const trimmed = (value || '').trim();

    if (trimmed.length > 0 && trimmed.length > max) {
        return `${label} cannot exceed ${max} characters.`;
    }

    return null;
}

export {
    requireLength,
    requireEmail,
    requireDate,
    optionalMaxLength
};
