/**
 * requireAdmin.js — Protects admin-only routes.
 * Expects header: x-admin-token: <token issued by /api/admin/login>
 */

const { isValidToken } = require("../admin/admin.controller");

module.exports = function requireAdmin(req, res, next) {
  const token = req.headers["x-admin-token"];
  if (!token || !isValidToken(token)) {
    return res.status(401).json({ error: "Unauthorized — admin access only." });
  }
  next();
};
