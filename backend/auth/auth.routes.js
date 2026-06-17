/**
 * auth.routes.js — Veyra Auth Routes
 */

const express   = require("express");
const router    = express.Router();
const authCtrl  = require("./auth.controller");

// POST /api/auth/signup
router.post("/signup", authCtrl.signup);

// POST /api/auth/login
router.post("/login", authCtrl.login);

// GET /api/auth/preferences/:email
router.get("/preferences/:email", authCtrl.getPreferences);

module.exports = router;
