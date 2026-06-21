/**
 * server.js  —  Veyra E-Commerce Backend
 * Run: node server.js
 * Requires: npm install express cors
 *
 * Route map:
 *   /api/demo/*     → backend/demo/demo.routes.js
 *   /api/home/*     → backend/home/home.routes.js
 *   /api/landing/*  → backend/landing/landing.routes.js
 *   /api/auth/*     → backend/auth/auth.routes.js
 *   /api/products/* → backend/products/products.routes.js
 *   /api/admin/*    → backend/admin/admin.routes.js
 *   /api/contact/*  → inline (lightweight, single file)
 */

const express  = require("express");
const cors     = require("cors");

const demoRoutes     = require("./demo/demo.routes");
const homeRoutes     = require("./home/home.routes");
const landingRoutes  = require("./landing/landing.routes");
const authRoutes     = require("./auth/auth.routes");
const productsRoutes = require("./products/products.routes");
const adminRoutes    = require("./admin/admin.routes");
const contactCtrl    = require("./contact.controller");

const app  = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ── Route mounting ────────────────────────────────────────────────────────────
app.use("/api/demo",     demoRoutes);
app.use("/api/home",     homeRoutes);
app.use("/api/landing",  landingRoutes);
app.use("/api/auth",     authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/admin",    adminRoutes);

// Contact form — single endpoint, no separate routes file needed
app.post("/api/contact/submit", contactCtrl.submit);

// Health check
app.get("/", (req, res) => res.json({ status: "Veyra API running", version: "1.0.0" }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
