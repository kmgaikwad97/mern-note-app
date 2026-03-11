// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { register, login, refresh, logout, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes (no token needed)
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);   // Uses httpOnly cookie
router.post("/logout", logout);     // Clears cookie + DB token

// Protected route (access token required)
router.get("/me", protect, getMe);

module.exports = router;
