// routes/noteRoutes.js
// All note routes are protected - user must be logged in

const express = require("express");
const router = express.Router();
const {
  createNote, getNotes, getNoteById, updateNote, deleteNote,
} = require("../controllers/noteController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

// Apply protect middleware to ALL note routes
// Only users with role "user" or "admin" can access notes
router.use(protect);
router.use(requireRole("user", "admin"));

router.route("/")
  .get(getNotes)      // GET  /api/notes
  .post(createNote);  // POST /api/notes

router.route("/:id")
  .get(getNoteById)   // GET    /api/notes/:id
  .put(updateNote)    // PUT    /api/notes/:id
  .delete(deleteNote); // DELETE /api/notes/:id

module.exports = router;
