/**
 * server.js  —  Veyra E-Commerce Backend
 * Run: node server.js
 * Requires: npm install express cors
 */

const express = require("express");
const cors = require("cors");
const demoRoutes = require("./routes/demo.routes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Demo feature routes
app.use("/api/demo", demoRoutes);

app.get("/", (req, res) => res.json({ status: "Veyra API running" }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
