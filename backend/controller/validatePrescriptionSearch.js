const { query } = require("express-validator");

const validatePrescriptionSearch = [
  query("query")
    .notEmpty()
    .withMessage("Search query is required")
    .isString()
    .withMessage("Search query must be a string")
    .trim(),
  query("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid date (YYYY-MM-DD)"),
  query("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid date (YYYY-MM-DD)"),
];

module.exports = validatePrescriptionSearch;