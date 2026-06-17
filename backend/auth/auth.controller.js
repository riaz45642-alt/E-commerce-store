/**
 * auth.controller.js — Veyra Auth & Onboarding Backend Logic
 * Handles user signup, login, and style-preference storage.
 *
 * Phase 1: In-memory store (resets on restart).
 * Phase 2: Replace userStore with a real database (PostgreSQL / MongoDB).
 */

// In-memory user store — Phase 2: replace with DB
const userStore = new Map();

const VALID_STYLES       = ["Casual", "Formal", "Streetwear", "Minimalist", "Bohemian", "Classic"];
const VALID_PERSONALITIES= ["Bold", "Subtle", "Adventurous", "Refined", "Playful", "Practical"];
const VALID_COLORS       = ["Ink", "Porcelain", "Gold", "Sage", "Rust", "Slate", "Wine", "Sand"];

/**
 * POST /api/auth/signup
 * Body: { name, email, password, style, colors, personality, sizePref }
 */
exports.signup = (req, res) => {
  try {
    const { name, email, password, style, colors, personality, sizePref } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "name, email, and password are required." });
    }
    if (userStore.has(email)) {
      return res.status(409).json({ error: "Account already exists for this email." });
    }

    // Validate style preferences
    const safeStyle       = VALID_STYLES.includes(style) ? style : null;
    const safePersonality = VALID_PERSONALITIES.includes(personality) ? personality : null;
    const safeColors      = Array.isArray(colors)
      ? colors.filter((c) => VALID_COLORS.includes(c))
      : [];

    const user = {
      id:          Date.now().toString(),
      name:        name.trim().substring(0, 100),
      email:       email.trim().toLowerCase(),
      // NOTE: never store plain-text passwords in production — use bcrypt
      passwordHash: password,
      preferences: { style: safeStyle, colors: safeColors, personality: safePersonality, sizePref: sizePref || "" },
      createdAt:   Date.now(),
    };

    userStore.set(email, user);

    const { passwordHash: _, ...safeUser } = user;
    return res.status(201).json({ success: true, user: safeUser });
  } catch (err) {
    console.error("signup error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required." });
    }

    const user = userStore.get(email.trim().toLowerCase());
    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const { passwordHash: _, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};

/**
 * GET /api/auth/preferences/:email
 * Returns style preferences for a user.
 */
exports.getPreferences = (req, res) => {
  try {
    const user = userStore.get(req.params.email);
    if (!user) return res.status(404).json({ error: "User not found." });
    return res.json({ success: true, preferences: user.preferences });
  } catch (err) {
    console.error("getPreferences error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};
