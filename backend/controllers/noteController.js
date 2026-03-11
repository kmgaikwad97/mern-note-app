// controllers/noteController.js
// Handles all Notes CRUD operations

const Note = require("../models/Note");
const { sendSuccess, sendError } = require("../utils/responseUtils");

// ─── CREATE NOTE ──────────────────────────────────────────────
// POST /api/notes
const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return sendError(res, 400, "Please provide both title and content.");
    }

    // req.user.id comes from the JWT payload (set by protect middleware)
    const note = await Note.create({
      title,
      content,
      userId: req.user.id,
    });

    return sendSuccess(res, 201, "Note created successfully!", { note });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL MY NOTES ─────────────────────────────────────────
// GET /api/notes
const getNotes = async (req, res, next) => {
  try {
    // Only return notes that belong to the logged-in user
    // Sort by newest first
    const notes = await Note.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    return sendSuccess(res, 200, "Notes fetched.", {
      notes,
      count: notes.length,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET SINGLE NOTE ──────────────────────────────────────────
// GET /api/notes/:id
const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id, // Ensure user can only access their own notes
    });

    if (!note) {
      return sendError(res, 404, "Note not found.");
    }

    return sendSuccess(res, 200, "Note fetched.", { note });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE NOTE ──────────────────────────────────────────────
// PUT /api/notes/:id
const updateNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title && !content) {
      return sendError(res, 400, "Please provide title or content to update.");
    }

    // findOneAndUpdate: find by id AND userId (authorization check)
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, content },
      {
        new: true,     // Return updated document
        runValidators: true, // Run schema validators on update
      }
    );

    if (!note) {
      return sendError(res, 404, "Note not found or not authorized.");
    }

    return sendSuccess(res, 200, "Note updated.", { note });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE NOTE ──────────────────────────────────────────────
// DELETE /api/notes/:id
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id, // Only delete own notes
    });

    if (!note) {
      return sendError(res, 404, "Note not found or not authorized.");
    }

    return sendSuccess(res, 200, "Note deleted successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = { createNote, getNotes, getNoteById, updateNote, deleteNote };
