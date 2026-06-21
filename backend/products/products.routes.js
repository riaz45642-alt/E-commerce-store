/**
 * products.routes.js — Veyra Product Catalog Routes
 */

const express = require("express");
const router = express.Router();
const productsCtrl = require("./products.controller");
const requireAdmin = require("../middleware/requireAdmin");

// ── Public ─────────────────────────────────────────────────────────────────
// GET /api/products?category=&search=&onSale=
router.get("/", productsCtrl.getAll);
// GET /api/products/:id
router.get("/:id", productsCtrl.getOne);
// POST /api/products/:id/sell  (checkout — auto-decrements stock)
router.post("/:id/sell", productsCtrl.sell);

// ── Admin only ─────────────────────────────────────────────────────────────
// POST /api/products
router.post("/", requireAdmin, productsCtrl.create);
// PUT /api/products/:id
router.put("/:id", requireAdmin, productsCtrl.update);
// DELETE /api/products/:id
router.delete("/:id", requireAdmin, productsCtrl.remove);
// PATCH /api/products/:id/stock
router.patch("/:id/stock", requireAdmin, productsCtrl.adjustStock);

module.exports = router;
