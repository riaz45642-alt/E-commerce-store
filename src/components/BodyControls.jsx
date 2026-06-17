/**
 * BodyControls.jsx
 * Interactive personalization controls: hair, height, body type, skin tone, view angle.
 * Phase 2: Feed these values into AI model for personalized outfit scoring.
 */

import React from "react";

const GOLD = "#C9A227";
const PORCELAIN = "#F3EFE6";
const SURFACE = "rgba(255,255,255,0.04)";
const ACTIVE = "rgba(201,162,39,0.15)";

function ControlGroup({ label, children }) {
  return (
    <div style={{ marginBottom: "1.2rem" }}>
      <p style={{ fontSize: "0.65rem", color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function Chips({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: "0.35rem 0.75rem",
            borderRadius: "20px",
            border: `1px solid ${value === opt.value ? GOLD : "rgba(255,255,255,0.1)"}`,
            background: value === opt.value ? ACTIVE : SURFACE,
            color: value === opt.value ? GOLD : "rgba(243,239,230,0.6)",
            fontSize: "0.7rem",
            cursor: "pointer",
            transition: "all 0.2s",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const SKIN_OPTIONS = [
  { value: "fair",   label: "Fair / White",   color: "#F5D5B8" },
  { value: "light",  label: "Light Brown",    color: "#D4A574" },
  { value: "brown",  label: "Brown",          color: "#8B5A2B" },
  { value: "dark",   label: "Dark / Black",   color: "#3D1C02" },
];

export default function BodyControls({ features, onChange }) {
  const set = (key) => (val) => onChange({ ...features, [key]: val });

  return (
    <div>
      <ControlGroup label="Hair Type">
        <Chips
          value={features.hairType}
          onChange={set("hairType")}
          options={[
            { value: "short",  label: "Short" },
            { value: "buzz",   label: "Buzz / Army" },
            { value: "wolf",   label: "Wolf Cut" },
            { value: "long",   label: "Long" },
            { value: "bald",   label: "Bald" },
          ]}
        />
      </ControlGroup>

      <ControlGroup label={`Height — ${features.height <= 3 ? "Short" : features.height <= 6 ? "Average" : "Tall"}`}>
        <input
          type="range"
          min="1" max="10"
          value={features.height}
          onChange={(e) => set("height")(Number(e.target.value))}
          style={{ width: "100%", accentColor: GOLD }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: "rgba(243,239,230,0.35)", marginTop: "0.2rem" }}>
          <span>Short</span><span>Average</span><span>Tall</span>
        </div>
      </ControlGroup>

      <ControlGroup label="Body Type">
        <Chips
          value={features.bodyType}
          onChange={set("bodyType")}
          options={[
            { value: "slim",        label: "Slim" },
            { value: "normal",      label: "Normal" },
            { value: "athletic",    label: "Athletic" },
            { value: "bodybuilder", label: "Bodybuilder" },
            { value: "overweight",  label: "Oversized" },
          ]}
        />
      </ControlGroup>

      <ControlGroup label="Skin Tone">
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {SKIN_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              title={opt.label}
              onClick={() => set("skinTone")(opt.value)}
              style={{
                width: 34, height: 34,
                borderRadius: "50%",
                background: opt.color,
                border: `2px solid ${features.skinTone === opt.value ? GOLD : "transparent"}`,
                cursor: "pointer",
                transition: "border-color 0.2s",
                boxShadow: features.skinTone === opt.value ? `0 0 0 3px rgba(201,162,39,0.25)` : "none",
              }}
            />
          ))}
        </div>
        <p style={{ fontSize: "0.62rem", color: "rgba(243,239,230,0.4)", marginTop: "0.4rem" }}>
          {SKIN_OPTIONS.find(o => o.value === features.skinTone)?.label}
        </p>
      </ControlGroup>

      <ControlGroup label="View Angle">
        <Chips
          value={features.viewAngle}
          onChange={set("viewAngle")}
          options={[
            { value: "front", label: "Front" },
            { value: "side",  label: "Side" },
            { value: "back",  label: "Back" },
          ]}
        />
        <p style={{ fontSize: "0.62rem", color: "rgba(243,239,230,0.3)", marginTop: "0.35rem", fontStyle: "italic" }}>
          360° view coming in Phase 2
        </p>
      </ControlGroup>
    </div>
  );
}
