/**
 * demo.routes.js
 * Express routes for the AI Style Demo feature.
 */

const express = require("express");
const router = express.Router();
const demo = require("./demo.controller");

// POST /api/demo/save-links
router.post("/save-links", demo.saveLinks);

// POST /api/demo/save-user-features
router.post("/save-user-features", demo.saveUserFeatures);

// GET /api/demo/demo-preview
router.get("/demo-preview", demo.getDemoPreview);

module.exports = router;
