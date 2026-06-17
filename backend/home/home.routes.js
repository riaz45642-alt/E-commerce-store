/**
 * home.routes.js — Veyra Home Page Routes
 */

const express    = require("express");
const router     = express.Router();
const homeCtrl   = require("./home.controller");

// GET /api/home/categories
router.get("/categories", homeCtrl.getCategories);

// GET /api/home/featured
router.get("/featured", homeCtrl.getFeatured);

module.exports = router;
