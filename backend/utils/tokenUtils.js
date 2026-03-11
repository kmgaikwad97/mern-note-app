// utils/tokenUtils.js
// Helper functions for generating and verifying JWTs

const jwt = require("jsonwebtoken");

// ─── Generate Access Token ────────────────────────────────────
// Short-lived (15 minutes by default)
// Contains user's id and role in the payload
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },          // Payload: what we store in token
    process.env.ACCESS_TOKEN_SECRET,             // Secret key from .env
    // { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// ─── Generate Refresh Token ───────────────────────────────────
// Long-lived (7 days by default)
// Only contains user id (minimal payload for security)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );
};

// ─── Verify Access Token ──────────────────────────────────────
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

// ─── Verify Refresh Token ─────────────────────────────────────
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

// ─── Cookie options for refresh token ────────────────────────
// httpOnly: JS cannot read this cookie (protects from XSS attacks)
// secure: only sent over HTTPS in production
// sameSite: "strict" prevents CSRF attacks
const getRefreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
});

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshTokenCookieOptions,
};
