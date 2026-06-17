/**
 * landing.routes.js — Veyra Landing Page Routes
 */

const express      = require("express");
const router       = express.Router();
const landingCtrl  = require("./landing.controller");

// GET /api/landing/info
router.get("/info", landingCtrl.getStoreInfo);

// POST /api/landing/cta-click
router.post("/cta-click", landingCtrl.logCtaClick);

module.exports = router;
