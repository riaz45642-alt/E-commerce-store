/**
 * admin.routes.js — Veyra Admin Auth Routes
 */

const express = require("express");
const router = express.Router();
const adminCtrl = require("./admin.controller");

// POST /api/admin/login
router.post("/login", adminCtrl.login);

// POST /api/admin/logout
router.post("/logout", adminCtrl.logout);

// GET /api/admin/verify
router.get("/verify", adminCtrl.verify);

module.exports = router;
