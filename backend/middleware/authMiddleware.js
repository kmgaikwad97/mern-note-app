// middleware/authMiddleware.js
// Protects routes by verifying the JWT access token

const { verifyAccessToken } = require("../utils/tokenUtils");
const { sendError } = require("../utils/responseUtils");

// ─── protect: Require valid access token ─────────────────────
const protect = (req, res, next) => {
  try {
    // 1. Get the Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, 401, "No token provided. Please login.");
    }

    // 2. Extract just the token part (remove "Bearer ")
    const token = authHeader.split(" ")[1];

    // 3. Verify the token using our secret key
    // If token is expired or invalid, jwt.verify() throws an error
    const decoded = verifyAccessToken(token);

    // 4. Attach user info to req so route handlers can use it
    // decoded contains: { id, role, iat, exp }
    req.user = decoded;

    next(); // Token is valid, proceed to route handler
  } catch (error) {
    // jwt.verify() throws specific errors:
    if (error.name === "TokenExpiredError") {
      return sendError(res, 401, "Token expired. Please refresh.");
    }
    if (error.name === "JsonWebTokenError") {
      return sendError(res, 401, "Invalid token. Please login again.");
    }
    return sendError(res, 401, "Authentication failed.");
  }
};

module.exports = { protect };
