/**
 * demo.controller.js
 * Handles demo session logic — no permanent storage, session-scoped only.
 *
 * Phase 2: Replace in-memory session store with AI pipeline call.
 */

// In-memory session store (demo only — resets on server restart)
// Phase 2: Replace with Redis or PostgreSQL session table
const demoSessions = new Map();

function getSessionId(req) {
  // Use a session cookie or generate a simple ID from IP + timestamp
  return req.headers["x-session-id"] || req.ip || "anonymous";
}

/**
 * POST /api/demo/save-links
 * Body: { links: { shirt, pants, shoes, cap, glasses, handbag } }
 */
exports.saveLinks = (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { links } = req.body;

    if (!links || typeof links !== "object") {
      return res.status(400).json({ error: "Invalid links payload." });
    }

    const allowed = ["shirt", "pants", "shoes", "cap", "glasses", "handbag"];
    const sanitized = {};
    allowed.forEach((key) => {
      if (links[key] && typeof links[key] === "string") {
        sanitized[key] = links[key].trim().substring(0, 500); // max URL length
      }
    });

    const existing = demoSessions.get(sessionId) || {};
    demoSessions.set(sessionId, { ...existing, links: sanitized, updatedAt: Date.now() });

    // Auto-expire after 30 minutes
    setTimeout(() => demoSessions.delete(sessionId), 30 * 60 * 1000);

    return res.json({ success: true, message: "Links saved to demo session.", count: Object.keys(sanitized).length });
  } catch (err) {
    console.error("saveLinks error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};

/**
 * POST /api/demo/save-user-features
 * Body: { features: { hairType, height, bodyType, skinTone, viewAngle } }
 */
exports.saveUserFeatures = (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { features } = req.body;

    const allowed = {
      hairType:  ["short", "buzz", "wolf", "long", "bald"],
      bodyType:  ["slim", "normal", "athletic", "bodybuilder", "overweight"],
      skinTone:  ["fair", "light", "brown", "dark"],
      viewAngle: ["front", "side", "back"],
    };

    const sanitized = {};
    Object.keys(allowed).forEach((key) => {
      if (features[key] && allowed[key].includes(features[key])) {
        sanitized[key] = features[key];
      }
    });
    if (features.height && features.height >= 1 && features.height <= 10) {
      sanitized.height = Number(features.height);
    }

    const existing = demoSessions.get(sessionId) || {};
    demoSessions.set(sessionId, { ...existing, features: sanitized, updatedAt: Date.now() });

    return res.json({ success: true, message: "User features saved.", features: sanitized });
  } catch (err) {
    console.error("saveUserFeatures error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};

/**
 * GET /api/demo/demo-preview
 * Returns the current session data + Phase 1 rule-based style advice.
 *
 * Phase 2: Replace advice generation with call to AI model:
 *   const aiResult = await aiStyleEngine.analyze(session.features, session.links);
 */
exports.getDemoPreview = (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const session = demoSessions.get(sessionId);

    if (!session) {
      return res.json({ success: true, message: "No demo session found.", data: null });
    }

    // ── Phase 1: Rule-based advice (mirrors frontend logic for SSR/API use) ──
    const { features = {}, links = {} } = session;
    const advice = generateStyleAdvice(features);

    return res.json({
      success: true,
      data: {
        links,
        features,
        advice,
        phase: 1,
        note: "Phase 2 AI analysis not yet enabled. Plug in AI engine at /api/demo/ai-analyze.",
      },
    });
  } catch (err) {
    console.error("getDemoPreview error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};

/**
 * Phase 1 rule-based style advice engine (server-side mirror of frontend logic).
 * Phase 2: Replace/augment with AI model.
 */
function generateStyleAdvice({ bodyType, skinTone, height } = {}) {
  const tips = [];
  const avoid = [];

  const bodyRules = {
    slim:        { tips: ["Layered outfits add volume.", "Horizontal stripes work well."], avoid: ["Very oversized fits."] },
    normal:      { tips: ["Classic straight-fit is timeless.", "Experiment freely!"], avoid: [] },
    athletic:    { tips: ["Fitted cuts showcase your silhouette.", "Tapered trousers + slim-fit shirt."], avoid: ["Boxy fits."] },
    bodybuilder: { tips: ["Stretch fabrics allow movement.", "V-necks complement broad shoulders."], avoid: ["Tight necklines."] },
    overweight:  { tips: ["Vertical stripes + monochrome create a slimming effect.", "Structured, tailored pieces."], avoid: ["Skin-tight or very baggy items."] },
  };

  const toneRules = {
    fair:  { good: ["Navy", "Burgundy", "Forest green"], bad: ["Neon yellow"] },
    light: { good: ["Terracotta", "Olive", "Rust orange"], bad: ["Washed pastels"] },
    brown: { good: ["Cream", "Cobalt blue", "Mustard"], bad: ["Muted browns"] },
    dark:  { good: ["Bright white", "Jewel tones", "Gold"], bad: ["Charcoal grey"] },
  };

  if (bodyRules[bodyType]) {
    tips.push(...bodyRules[bodyType].tips);
    avoid.push(...bodyRules[bodyType].avoid);
  }

  if (toneRules[skinTone]) {
    tips.push(`Great colours for your tone: ${toneRules[skinTone].good.join(", ")}.`);
    avoid.push(`Use sparingly: ${toneRules[skinTone].bad.join(", ")}.`);
  }

  if (height <= 3) tips.push("High-waisted bottoms elongate the frame.");
  if (height >= 8) tips.push("Wide-leg and relaxed-fit pieces suit your height.");

  return { tips, avoid };
}
