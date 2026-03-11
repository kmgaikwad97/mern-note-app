// middleware/roleMiddleware.js
// Role-Based Access Control (RBAC)
// Use AFTER the protect middleware

const { sendError } = require("../utils/responseUtils");

// ─── requireRole: Only allow specific roles ──────────────────
// Usage: router.get("/admin", protect, requireRole("admin"), handler)
// You can pass multiple roles: requireRole("admin", "moderator")
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user is set by protect middleware
    if (!req.user) {
      return sendError(res, 401, "Not authenticated.");
    }

    // Check if user's role is in the allowed list
    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        403, // 403 = Forbidden (authenticated but not authorized)
        `Access denied. Requires one of: ${allowedRoles.join(", ")}. Your role: ${req.user.role}`
      );
    }

    next(); // Role check passed
  };
};

module.exports = { requireRole };
