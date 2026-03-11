// utils/responseUtils.js
// Standardized API response format so all responses look consistent

// Success response: { success: true, message: "...", data: {...} }
const sendSuccess = (res, statusCode = 200, message = "Success", data = null) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

// Error response: { success: false, message: "...", errors: [...] }
const sendError = (res, statusCode = 500, message = "Server Error", errors = null) => {
  const response = { success: false, message };
  if (errors !== null) response.errors = errors;
  return res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };
