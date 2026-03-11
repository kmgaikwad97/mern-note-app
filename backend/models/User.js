// models/User.js
// Defines the structure of a user document in MongoDB

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["guest", "user", "admin"], // Only these values allowed
      default: "user",                  // New registrations are "user" by default
    },
    // We store the refresh token in DB so we can invalidate it on logout
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// ─── HASH PASSWORD BEFORE SAVING ────────────────────────────
// This runs automatically before every .save() call
userSchema.pre("save", async function (next) {
  // Only hash if password was actually changed (not on other updates)
  if (!this.isModified("password")) return next();

  // Salt rounds = 12 means bcrypt runs 2^12 iterations (very secure, slightly slow)
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── INSTANCE METHOD: Compare password ──────────────────────
// Usage: const isMatch = await user.comparePassword(plainPassword)
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// ─── Don't expose password or refreshToken in API responses ──
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
