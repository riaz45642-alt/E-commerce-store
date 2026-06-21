/**
 * admin.controller.js — Veyra Admin Auth Backend Logic
 * Restricts the Admin Panel to the store owner only.
 *
 * Phase 1: single hardcoded owner account + in-memory session tokens.
 * Phase 2: replace with a real admin-users table + hashed passwords (bcrypt).
 */

const crypto = require("crypto");

// Store-owner credentials — Phase 2: move to env vars / DB with hashed password
const OWNER_USERNAME = process.env.ADMIN_USERNAME || "owner";
const OWNER_PASSWORD = process.env.ADMIN_PASSWORD || "veyra-admin-2026";

// In-memory set of valid session tokens
const activeTokens = new Set();

/**
 * POST /api/admin/login
 * Body: { username, password }
 */
exports.login = (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password are required." });
    }
    if (username !== OWNER_USERNAME || password !== OWNER_PASSWORD) {
      return res.status(401).json({ error: "Invalid admin credentials." });
    }
    const token = crypto.randomBytes(24).toString("hex");
    activeTokens.add(token);
    return res.json({ success: true, token });
  } catch (err) {
    console.error("admin login error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};

/**
 * POST /api/admin/logout
 * Body: { token }
 */
exports.logout = (req, res) => {
  const { token } = req.body;
  activeTokens.delete(token);
  return res.json({ success: true });
};

/**
 * GET /api/admin/verify
 * Header: x-admin-token
 * Lets the frontend check whether a stored token is still valid.
 */
exports.verify = (req, res) => {
  const token = req.headers["x-admin-token"];
  return res.json({ success: true, valid: !!token && activeTokens.has(token) });
};

// Exported for the requireAdmin middleware
exports.isValidToken = (token) => activeTokens.has(token);
