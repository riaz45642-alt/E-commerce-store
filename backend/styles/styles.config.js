/**
 * styles.config.js — Veyra Backend Style Configuration
 * Shared style data used by server-side logic (e.g. email templates, PDF generation).
 * This mirrors the frontend tokens but is kept separate for backend use.
 */

const VEYRA_PALETTE = {
  ink:       "#0B0B0E",
  porcelain: "#F3EFE6",
  gold:      "#C9A227",
  sage:      "#7C8B72",
  rust:      "#A8543B",
};

const STYLE_OPTIONS       = ["Casual", "Formal", "Streetwear", "Minimalist", "Bohemian", "Classic"];
const PERSONALITY_OPTIONS = ["Bold", "Subtle", "Adventurous", "Refined", "Playful", "Practical"];
const COLOR_OPTIONS       = ["Ink", "Porcelain", "Gold", "Sage", "Rust", "Slate", "Wine", "Sand"];

const BODY_TYPES  = ["slim", "normal", "athletic", "bodybuilder", "overweight"];
const SKIN_TONES  = ["fair", "light", "brown", "dark"];
const HAIR_TYPES  = ["short", "buzz", "wolf", "long", "bald"];
const VIEW_ANGLES = ["front", "side", "back"];

// Rule-based colour advice (server-side mirror of frontend logic)
const SKIN_TONE_PALETTES = {
  fair:  { good: ["Navy", "Burgundy", "Forest green", "Slate grey"],    avoid: ["Neon yellow", "Pastel pink"] },
  light: { good: ["Terracotta", "Olive", "Warm beige", "Rust orange"],  avoid: ["Washed-out pastels"] },
  brown: { good: ["Cream", "Cobalt blue", "Mustard yellow", "Deep red"], avoid: ["Muted browns"] },
  dark:  { good: ["Bright white", "Jewel tones", "Gold", "Electric blue"], avoid: ["Charcoal grey"] },
};

module.exports = {
  VEYRA_PALETTE,
  STYLE_OPTIONS,
  PERSONALITY_OPTIONS,
  COLOR_OPTIONS,
  BODY_TYPES,
  SKIN_TONES,
  HAIR_TYPES,
  VIEW_ANGLES,
  SKIN_TONE_PALETTES,
};
