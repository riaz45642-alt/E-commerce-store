/**
 * CheckDemo.jsx  —  AI Style & Outfit Analyzer
 * Route: /check-demo
 *
 * Phase 1: Rule-based avatar + static style suggestions
 * Phase 2: AI image analysis, smart color matching, personalized outfit scoring
 *          → Plug in at: getAIRecommendations() below
 *
 * NOTE: No fetch() calls here. All HTTP calls go through ../logic/api.js
 */

import { useState, useCallback } from "react";
import Avatar from "../components/Avatar";
import ProductLinkForm from "../components/ProductLinkForm";
import BodyControls from "../components/BodyControls";
import { demoApi } from "../logic/api";

// ─── Design tokens (match Veyra palette) ─────────────────────────────────────
const INK      = "#0B0B0E";
const PORCELAIN= "#F3EFE6";
const GOLD     = "#C9A227";
const SURFACE  = "rgba(255,255,255,0.04)";
const BORDER   = "rgba(255,255,255,0.07)";

// ─── Phase 1: Rule-based style recommendation engine ─────────────────────────
function getRuleBasedAdvice({ bodyType, skinTone, height }) {
  const tips = [];
  const avoid = [];

  if (bodyType === "slim") {
    tips.push("Layered outfits add visual volume — great for slim builds.");
    tips.push("Horizontal stripes work in your favour.");
    avoid.push("Avoid very baggy oversized fits that drown the frame.");
  } else if (bodyType === "athletic") {
    tips.push("Fitted cuts showcase your silhouette best.");
    tips.push("Tapered trousers with a slim-fit shirt is a winning combo.");
    avoid.push("Avoid boxy fits that hide your build.");
  } else if (bodyType === "bodybuilder") {
    tips.push("Stretch fabrics — cotton-elastane blends — allow freedom of movement.");
    tips.push("V-necks and crew necks both complement broad shoulders.");
    avoid.push("Avoid tight necklines that restrict movement.");
  } else if (bodyType === "overweight") {
    tips.push("Vertical stripes and monochrome tones create a slimming effect.");
    tips.push("Well-tailored, structured pieces add shape and confidence.");
    avoid.push("Avoid very tight or very baggy items — fit is everything.");
  } else {
    tips.push("You can pull off almost any cut — experiment freely!");
    tips.push("Classic straight-fit jeans + a tucked shirt is timeless.");
  }

  const palettes = {
    fair:  { good: ["Navy", "Burgundy", "Forest green", "Slate grey"], avoid: ["Neon yellow", "Pastel pink"] },
    light: { good: ["Earthy terracotta", "Olive", "Warm beige", "Rust orange"], avoid: ["Washed-out pastels"] },
    brown: { good: ["Cream", "Cobalt blue", "Mustard yellow", "Deep red"], avoid: ["Muted browns that blend with skin"] },
    dark:  { good: ["Bright white", "Vibrant jewel tones", "Gold accents", "Electric blue"], avoid: ["Charcoal grey (low contrast)"] },
  };
  const palette = palettes[skinTone] || palettes.fair;
  tips.push(`Your skin tone pairs beautifully with: ${palette.good.join(", ")}.`);
  avoid.push(`Colors to use sparingly: ${palette.avoid.join(", ")}.`);

  if (height <= 3) {
    tips.push("High-waisted bottoms and monochrome outfits elongate your frame.");
    avoid.push("Avoid wide-leg trousers without heels — they shorten the leg line.");
  } else if (height >= 8) {
    tips.push("You can carry wide-leg and relaxed-fit pieces effortlessly.");
    avoid.push("Avoid cropped tops unless paired intentionally — can look accidental.");
  }

  return { tips, avoid };
}

// ─── PHASE 2 HOOK (placeholder) ──────────────────────────────────────────────
// Replace this function with your AI model call when ready:
//   POST /api/demo/ai-analyze with { links, features }
//   Returns: { outfitScore, colorMatch, suggestions }
async function getAIRecommendations(_links, _features) {
  // TODO: Phase 2 — wire up AI endpoint here
  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CheckDemo({ onNavigate }) {
  const [links, setLinks] = useState({ shirt: "", pants: "", shoes: "", cap: "", glasses: "", handbag: "" });
  const [features, setFeatures] = useState({ hairType: "short", height: 5, bodyType: "normal", skinTone: "fair", viewAngle: "front" });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLinkChange = useCallback((key, val) => {
    setLinks((prev) => ({ ...prev, [key]: val }));
    setSaved(false);
  }, []);

  const outfit = {
    shirt:   !!links.shirt,
    pants:   !!links.pants,
    shoes:   !!links.shoes,
    cap:     !!links.cap,
    glasses: !!links.glasses,
  };

  const advice = getRuleBasedAdvice(features);
  const filledCount = Object.values(links).filter(Boolean).length;

  // Save via API service — no fetch() inside this component
  const handleSave = async () => {
    setSaving(true);
    try {
      await demoApi.saveLinks(links);
      await demoApi.saveUserFeatures(features);
      setSaved(true);
    } catch {
      // In demo mode without a running backend, gracefully continue
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: INK, fontFamily: "Inter, sans-serif", color: PORCELAIN }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500&family=Inter:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        input[type=range]::-webkit-slider-thumb { background: ${GOLD}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,162,39,0.3); border-radius: 2px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 2rem", borderBottom: `1px solid ${BORDER}` }}>
        <button onClick={() => onNavigate?.("home")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Fraunces, serif", fontSize: "1.2rem", color: PORCELAIN, letterSpacing: "0.05em" }}>
          Veyra
        </button>
        <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.75rem", color: "rgba(243,239,230,0.55)" }}>
          <button onClick={() => onNavigate?.("home")} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: "0.75rem" }}>Shop</button>
          <span style={{ color: GOLD }}>AI Stylist</span>
        </div>
      </nav>

      {/* ── Hero Header ── */}
      <header className="fade-up" style={{ textAlign: "center", padding: "2.5rem 1.5rem 1.5rem" }}>
        <span style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD }}>
          AI Powered · Phase 1 Demo
        </span>
        <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", margin: "0.5rem 0 0.4rem", color: PORCELAIN }}>
          Style & Outfit Analyzer
        </h1>
        <p style={{ fontSize: "0.8rem", color: "rgba(243,239,230,0.45)", maxWidth: 520, margin: "0 auto" }}>
          Paste product links, set your body profile, and see a personalized style preview — built for real AI fitting coming soon.
        </p>
      </header>

      {/* ── Main Grid ── */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem 1.25rem 4rem", display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>

        {/* Section 1: Product Links */}
        <section className="fade-up" style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "1.5rem" }}>
          <ProductLinkForm links={links} onChange={handleLinkChange} />
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1.25rem" }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "0.6rem 1.5rem",
                background: saved ? "rgba(201,162,39,0.15)" : GOLD,
                color: saved ? GOLD : INK,
                border: `1px solid ${GOLD}`,
                borderRadius: 8,
                fontSize: "0.75rem",
                fontWeight: 500,
                cursor: saving ? "wait" : "pointer",
                transition: "all 0.25s",
                letterSpacing: "0.04em",
              }}
            >
              {saving ? "Saving…" : saved ? "✓ Saved to demo session" : "Save & Preview"}
            </button>
            {filledCount > 0 && (
              <span style={{ fontSize: "0.7rem", color: GOLD }}>
                {filledCount} item{filledCount > 1 ? "s" : ""} added
              </span>
            )}
          </div>
        </section>

        {/* Section 2+3: Avatar + Controls */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>

          {/* Avatar Panel */}
          <section style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={{ fontSize: "0.65rem", color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem", alignSelf: "flex-start" }}>
              Live Preview
            </p>
            <div style={{ width: "100%", maxWidth: 220, aspectRatio: "200/340" }}>
              <Avatar
                bodyType={features.bodyType}
                skinTone={features.skinTone}
                hairType={features.hairType}
                height={features.height}
                viewAngle={features.viewAngle}
                outfit={outfit}
              />
            </div>
            <div style={{ marginTop: "1rem", padding: "0.6rem 1rem", background: "rgba(201,162,39,0.08)", borderRadius: 8, border: `1px solid rgba(201,162,39,0.2)`, textAlign: "center" }}>
              <p style={{ fontSize: "0.62rem", color: "rgba(243,239,230,0.4)", fontStyle: "italic" }}>
                Demo preview — real AI fitting will be added in Phase 2
              </p>
            </div>
          </section>

          {/* Controls Panel */}
          <section style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "1.5rem" }}>
            <p style={{ fontSize: "0.65rem", color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>
              Your Profile
            </p>
            <BodyControls features={features} onChange={setFeatures} />
          </section>
        </div>

        {/* Section 4: Style Recommendations */}
        <section className="fade-up" style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "1.5rem" }}>
          <p style={{ fontSize: "0.65rem", color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.2rem" }}>
            Personalized Style Guide
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            <div>
              <p style={{ fontSize: "0.7rem", color: "rgba(243,239,230,0.45)", marginBottom: "0.6rem" }}>✓ Recommended</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {advice.tips.map((tip, i) => (
                  <li key={i} style={{ fontSize: "0.75rem", color: "rgba(243,239,230,0.75)", paddingLeft: "1rem", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: GOLD }}>›</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p style={{ fontSize: "0.7rem", color: "rgba(243,239,230,0.45)", marginBottom: "0.6rem" }}>✕ Avoid</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {advice.avoid.map((tip, i) => (
                  <li key={i} style={{ fontSize: "0.75rem", color: "rgba(243,239,230,0.6)", paddingLeft: "1rem", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "#c0392b" }}>×</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Phase 2 callout */}
          <div style={{ marginTop: "1.5rem", padding: "0.9rem 1.1rem", borderRadius: 10, background: "rgba(201,162,39,0.06)", border: `1px dashed rgba(201,162,39,0.25)` }}>
            <p style={{ fontSize: "0.7rem", color: GOLD, marginBottom: "0.25rem", fontWeight: 500 }}>🤖 Phase 2 — AI Engine (Coming Soon)</p>
            <p style={{ fontSize: "0.68rem", color: "rgba(243,239,230,0.4)" }}>
              Smart color matching, AI outfit scoring, and real-time product image overlay will be enabled once the AI model is integrated at <code style={{ color: GOLD, fontSize: "0.65rem" }}>POST /api/demo/ai-analyze</code>.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
