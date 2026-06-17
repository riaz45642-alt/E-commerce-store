/**
 * home.controller.js — Veyra Home Page Backend Logic
 * Handles category listing and product data for the home page.
 */

// Static category data (replace with DB query in production)
const CATEGORIES = [
  { name: "Clothes",     image: "clothes.jpg" },
  { name: "Shoes",       image: "shoes.jpg" },
  { name: "Accessories", image: "accessories.jpg" },
  { name: "Bags",        image: "bags.jpg" },
  { name: "Watches",     image: "watches.jpg" },
];

/**
 * GET /api/home/categories
 * Returns available product categories.
 */
exports.getCategories = (req, res) => {
  try {
    return res.json({ success: true, data: CATEGORIES });
  } catch (err) {
    console.error("getCategories error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};

/**
 * GET /api/home/featured
 * Returns featured/hero products for the home page banner.
 * Phase 2: Replace with personalised picks based on user profile.
 */
exports.getFeatured = (req, res) => {
  try {
    return res.json({
      success: true,
      data: [],
      note: "Phase 2: personalised featured items will be returned here.",
    });
  } catch (err) {
    console.error("getFeatured error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};
