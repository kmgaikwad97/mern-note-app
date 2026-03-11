// controllers/authController.js
// Handles all authentication logic

const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenCookieOptions,
} = require("../utils/tokenUtils");
const { sendSuccess, sendError } = require("../utils/responseUtils");

// ─── REGISTER ────────────────────────────────────────────────
// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return sendError(res, 400, "Please provide name, email, and password.");
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 400, "An account with this email already exists.");
    }

    // 3. Create user (password hashing happens in model's pre-save hook)
    const user = await User.create({ name, email, password });

    // 4. Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 5. Save refresh token to DB (so we can validate and revoke it)
    user.refreshToken = refreshToken;
    await user.save();

    // 6. Send refresh token as httpOnly cookie
    // Browser stores it automatically, JS cannot read it
    res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

    // 7. Send access token in response body (frontend stores in memory)
    return sendSuccess(res, 201, "Account created successfully!", {
      accessToken,
      user, // toJSON() strips password and refreshToken
    });
  } catch (error) {
    next(error); // Pass to global error handler
  }
};

// ─── LOGIN ────────────────────────────────────────────────────
// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return sendError(res, 400, "Please provide email and password.");
    }

    // 2. Find user (we need password for comparison, so select it explicitly)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      // Use vague message to avoid telling attackers which field is wrong
      return sendError(res, 401, "Invalid email or password.");
    }

    // 3. Check password using bcrypt compare (defined in User model)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, "Invalid email or password.");
    }

    // 4. Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 5. Update refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // 6. Set refresh token cookie
    res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

    // 7. Return access token + user info
    return sendSuccess(res, 200, "Login successful!", {
      accessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ─── REFRESH TOKEN ────────────────────────────────────────────
// POST /api/auth/refresh
// Frontend calls this when access token expires
const refresh = async (req, res, next) => {
  try {
    // 1. Get refresh token from httpOnly cookie
    const token = req.cookies.refreshToken;

    if (!token) {
      return sendError(res, 401, "No refresh token. Please login.");
    }

    // 2. Verify the refresh token signature
    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      return sendError(res, 403, "Invalid or expired refresh token. Please login.");
    }

    // 3. Find user and check that stored refresh token matches
    // This is crucial: if user logged out, the DB token is null, so this fails
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return sendError(res, 403, "Refresh token mismatch. Please login again.");
    }

    // 4. Issue a new access token
    const newAccessToken = generateAccessToken(user);

    return sendSuccess(res, 200, "Token refreshed.", {
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

// ─── LOGOUT ──────────────────────────────────────────────────
// POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      // Remove refresh token from DB - this invalidates it permanently
      await User.findOneAndUpdate(
        { refreshToken: token },
        { refreshToken: null }
      );
    }

    // Clear the cookie from the browser
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return sendSuccess(res, 200, "Logged out successfully.");
  } catch (error) {
    next(error);
  }
};

// ─── GET CURRENT USER (ME) ────────────────────────────────────
// GET /api/auth/me
// Used for "persistent login" - verify token and get user profile
const getMe = async (req, res, next) => {
  try {
    // req.user.id is set by protect middleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return sendError(res, 404, "User not found.");
    }
    return sendSuccess(res, 200, "User profile fetched.", { user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refresh, logout, getMe };
