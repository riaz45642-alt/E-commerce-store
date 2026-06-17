/**
 * contact.controller.js — Veyra Contact / Feedback Form
 * Lightweight, no heavy validation, works within free cloud tier.
 * Phase 2: Forward submissions to email service (SendGrid, Resend, etc.)
 */

// In-memory queue — Phase 2: replace with email service or DB insert
const submissions = [];

/**
 * POST /api/contact/submit
 * Body: { name, email, message }
 */
exports.submit = (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (!email || !message) {
      return res.status(400).json({ error: "email and message are required." });
    }

    const entry = {
      id:        Date.now().toString(),
      name:      (name || "").trim().substring(0, 100),
      email:     email.trim().toLowerCase().substring(0, 200),
      message:   message.trim().substring(0, 2000),
      createdAt: new Date().toISOString(),
    };

    submissions.push(entry);

    console.log(`[Contact] New submission from ${entry.email}`);

    return res.status(201).json({
      success: true,
      message: "Thanks! We'll be in touch.",
    });
  } catch (err) {
    console.error("contact.submit error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};
