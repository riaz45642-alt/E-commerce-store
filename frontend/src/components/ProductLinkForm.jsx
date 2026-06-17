/**
 * ProductLinkForm.jsx
 * Input fields for pasting product links per clothing category.
 * Phase 2: Links will be sent to AI backend for image scraping & outfit overlay.
 */

import React from "react";
import { Link, ShoppingBag, Footprints, Star, Glasses, HardHat } from "lucide-react";

const GOLD = "#C9A227";
const PORCELAIN = "#F3EFE6";
const SURFACE = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.08)";

const FIELDS = [
  { key: "shirt",    label: "Shirt / Top",     icon: ShoppingBag, placeholder: "Paste shirt product URL…" },
  { key: "pants",    label: "Pants / Bottom",   icon: ShoppingBag, placeholder: "Paste pants product URL…" },
  { key: "shoes",    label: "Shoes",            icon: Footprints,  placeholder: "Paste shoes product URL…" },
  { key: "cap",      label: "Cap / Hat",        icon: Star,        placeholder: "Paste cap product URL…" },
  { key: "glasses",  label: "Glasses",          icon: Glasses,     placeholder: "Paste glasses product URL…" },
  { key: "handbag",  label: "Handbag (Ladies)", icon: HardHat,     placeholder: "Paste handbag product URL… (optional)" },
];

export default function ProductLinkForm({ links, onChange }) {
  return (
    <div style={{ width: "100%" }}>
      <p style={{ fontSize: "0.7rem", color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>
        Product Links
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem" }}>
        {FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
          <div key={key} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <label style={{ fontSize: "0.7rem", color: "rgba(243,239,230,0.5)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Icon size={11} style={{ color: GOLD, opacity: 0.7 }} />
              {label}
            </label>
            <div style={{ position: "relative" }}>
              <Link size={12} style={{ position: "absolute", left: "0.7rem", top: "50%", transform: "translateY(-50%)", color: "rgba(243,239,230,0.3)", pointerEvents: "none" }} />
              <input
                type="url"
                value={links[key] || ""}
                onChange={(e) => onChange(key, e.target.value)}
                placeholder={placeholder}
                style={{
                  width: "100%",
                  background: SURFACE,
                  border: `1px solid ${links[key] ? GOLD + "55" : BORDER}`,
                  borderRadius: "8px",
                  padding: "0.55rem 0.75rem 0.55rem 2rem",
                  color: PORCELAIN,
                  fontSize: "0.72rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = GOLD + "88")}
                onBlur={(e) => (e.target.style.borderColor = links[key] ? GOLD + "55" : BORDER)}
              />
              {links[key] && (
                <span style={{ position: "absolute", right: "0.6rem", top: "50%", transform: "translateY(-50%)", width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
              )}
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: "0.65rem", color: "rgba(243,239,230,0.3)", marginTop: "0.75rem", fontStyle: "italic" }}>
        ⚠ Demo mode — no checkout or payment. Links are stored temporarily for preview only.
      </p>
    </div>
  );
}
