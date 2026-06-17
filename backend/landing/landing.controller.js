/**
 * landing.controller.js — Veyra Landing Page Backend Logic
 * Handles store metadata and CTA tracking for the landing page.
 */

/**
 * GET /api/landing/info
 * Returns store name and tagline for the landing page.
 */
exports.getStoreInfo = (req, res) => {
  try {
    return res.json({
      success: true,
      data: {
        name:    "VEYRA",
        tagline: "Guided, personal, distraction-free.",
        phase:   1,
      },
    });
  } catch (err) {
    console.error("getStoreInfo error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};

/**
 * POST /api/landing/cta-click
 * Logs when a visitor clicks "Get started" on the landing page.
 * Phase 2: Pipe into analytics service.
 */
exports.logCtaClick = (req, res) => {
  try {
    const { referrer } = req.body || {};
    console.log(`[CTA] Get Started clicked — referrer: ${referrer || "direct"}`);
    return res.json({ success: true });
  } catch (err) {
    console.error("logCtaClick error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};
