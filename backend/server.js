// ============================================================
// server.js - Main entry point for the Express backend
// ============================================================

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Import route files
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const blogRoutes = require("./routes/blogRoutes");

// Import error handling middleware
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// ─── MIDDLEWARE ──────────────────────────────────────────────
// Parse incoming JSON request bodies
app.use(express.json());

// Parse cookies (needed for reading httpOnly refresh token cookie)
app.use(cookieParser());

// CORS - Allow frontend to call our backend
// credentials: true is required so cookies are sent with requests
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // IMPORTANT: allows cookies to be sent cross-origin
  })
);

// ─── ROUTES ──────────────────────────────────────────────────
app.use("/api/auth", authRoutes);   // Register, login, refresh, logout
app.use("/api/notes", noteRoutes);  // Notes CRUD (protected)
app.use("/api/blogs", blogRoutes);  // Blog data (public + protected)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// ─── ERROR HANDLER ────────────────────────────────────────────
// This must be LAST - catches all errors thrown by route handlers
app.use(errorHandler);

// ─── DATABASE CONNECTION ──────────────────────────────────────
const PORT = process.env.PORT || 5100;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
