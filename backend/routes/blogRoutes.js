// routes/blogRoutes.js

const express = require("express");
const router = express.Router();
const { getBlogPreviews, getBlogById } = require("../controllers/blogController");
const { protect } = require("../middleware/authMiddleware");

// Public - anyone can see blog previews
router.get("/", getBlogPreviews);

// Protected - only logged-in users can see full blog content
router.get("/:id", protect, getBlogById);

module.exports = router;
