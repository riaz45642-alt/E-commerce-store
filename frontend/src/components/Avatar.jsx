/**
 * Avatar.jsx
 * Dynamic SVG human avatar that responds to body type, skin tone, hair, and view angle.
 * Phase 2: Replace SVG with AI-generated outfit overlay image.
 */

import React from "react";

const SKIN_TONES = {
  fair: "#F5D5B8",
  light: "#D4A574",
  brown: "#8B5A2B",
  dark: "#3D1C02",
};

const HAIR_COLORS = {
  fair: "#5C3A1E",
  light: "#2C1810",
  brown: "#1A0A00",
  dark: "#0A0A0A",
};

// Body width multipliers for SVG scaling
const BODY_SCALE = {
  slim: 0.8,
  normal: 1,
  athletic: 1.1,
  bodybuilder: 1.3,
  overweight: 1.35,
};

export default function Avatar({ bodyType = "normal", skinTone = "fair", hairType = "short", height = 5, viewAngle = "front", outfit = {} }) {
  const skin = SKIN_TONES[skinTone] || SKIN_TONES.fair;
  const hair = HAIR_COLORS[skinTone] || HAIR_COLORS.fair;
  const bw = BODY_SCALE[bodyType] || 1;

  // Height: 1-10 scale → SVG transform
  const heightScale = 0.75 + (height / 10) * 0.5;

  const renderHair = () => {
    if (hairType === "bald") return null;
    if (hairType === "buzz")
      return <ellipse cx="100" cy="52" rx="30" ry="8" fill={hair} opacity="0.9" />;
    if (hairType === "long")
      return (
        <>
          <ellipse cx="100" cy="48" rx="32" ry="22" fill={hair} />
          <rect x="68" y="60" width="14" height="60" rx="7" fill={hair} />
          <rect x="118" y="60" width="14" height="60" rx="7" fill={hair} />
        </>
      );
    if (hairType === "wolf")
      return (
        <>
          <ellipse cx="100" cy="48" rx="33" ry="22" fill={hair} />
          <path d="M70 58 Q60 80 68 100" stroke={hair} strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M130 58 Q140 80 132 100" stroke={hair} strokeWidth="12" fill="none" strokeLinecap="round" />
          {/* Fringe */}
          <path d="M72 55 Q100 70 128 55" stroke={hair} strokeWidth="10" fill="none" strokeLinecap="round" />
        </>
      );
    // short (default)
    return <ellipse cx="100" cy="46" rx="31" ry="20" fill={hair} />;
  };

  const renderOutfitLabels = () => (
    <g opacity="0.7">
      {outfit.shirt && (
        <text x="100" y="158" textAnchor="middle" fontSize="7" fill="#C9A227">● Shirt</text>
      )}
      {outfit.pants && (
        <text x="100" y="230" textAnchor="middle" fontSize="7" fill="#C9A227">● Pants</text>
      )}
      {outfit.shoes && (
        <text x="100" y="298" textAnchor="middle" fontSize="7" fill="#C9A227">● Shoes</text>
      )}
      {outfit.glasses && (
        <text x="100" y="82" textAnchor="middle" fontSize="7" fill="#C9A227">● Glasses</text>
      )}
    </g>
  );

  // Side view silhouette
  if (viewAngle === "side") {
    return (
      <svg viewBox="0 0 200 340" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", maxHeight: 340 }}>
        <g transform={`scale(1,${heightScale}) translate(0,${(1 - heightScale) * 170})`}>
          {/* Head */}
          <ellipse cx="105" cy="68" rx="25" ry="30" fill={skin} />
          {/* Neck */}
          <rect x="98" y="94" width="12" height="18" fill={skin} />
          {/* Body */}
          <ellipse cx="100" cy={130 * bw * 0.9} rx={28 * bw} ry="45" fill={outfit.shirt ? "#1a3a2a" : "#2a2a2a"} />
          {/* Legs */}
          <rect x="88" y="168" width={18 * bw} height="90" rx="9" fill={outfit.pants ? "#1a2a3a" : "#333"} />
          {/* Shoes */}
          <ellipse cx="100" cy="260" rx="18" ry="7" fill={outfit.shoes ? "#8B4513" : "#555"} />
          <text x="100" y="320" textAnchor="middle" fontSize="8" fill="rgba(243,239,230,0.4)">Side View</text>
        </g>
      </svg>
    );
  }

  // Back view
  if (viewAngle === "back") {
    return (
      <svg viewBox="0 0 200 340" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", maxHeight: 340 }}>
        <g transform={`scale(1,${heightScale}) translate(0,${(1 - heightScale) * 170})`}>
          <ellipse cx="100" cy="68" rx="28" ry="30" fill={skin} />
          {hairType !== "bald" && <ellipse cx="100" cy="50" rx="30" ry="22" fill={hair} />}
          <rect x="93" y="94" width="14" height="18" fill={skin} />
          {/* Torso back */}
          <rect x={100 - 32 * bw} y="108" width={64 * bw} height="70" rx="12" fill={outfit.shirt ? "#1a3a2a" : "#2a2a2a"} />
          {/* Arms */}
          <rect x={100 - 46 * bw} y="112" width={14 * bw} height="55" rx="7" fill={outfit.shirt ? "#1a3a2a" : "#2a2a2a"} />
          <rect x={100 + 32 * bw} y="112" width={14 * bw} height="55" rx="7" fill={outfit.shirt ? "#1a3a2a" : "#2a2a2a"} />
          {/* Legs */}
          <rect x={100 - 24 * bw} y="176" width={20 * bw} height="90" rx="10" fill={outfit.pants ? "#1a2a3a" : "#333"} />
          <rect x={100 + 4 * bw} y="176" width={20 * bw} height="90" rx="10" fill={outfit.pants ? "#1a2a3a" : "#333"} />
          {/* Shoes */}
          <ellipse cx={100 - 14 * bw} cy="268" rx="16" ry="7" fill={outfit.shoes ? "#8B4513" : "#555"} />
          <ellipse cx={100 + 14 * bw} cy="268" rx="16" ry="7" fill={outfit.shoes ? "#8B4513" : "#555"} />
          <text x="100" y="320" textAnchor="middle" fontSize="8" fill="rgba(243,239,230,0.4)">Back View</text>
        </g>
      </svg>
    );
  }

  // Front view (default)
  return (
    <svg viewBox="0 0 200 340" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", maxHeight: 340 }}>
      <g transform={`scale(1,${heightScale}) translate(0,${(1 - heightScale) * 170})`}>
        {/* Hair behind */}
        {renderHair()}

        {/* Head */}
        <ellipse cx="100" cy="68" rx="28" ry="30" fill={skin} />

        {/* Eyes */}
        <ellipse cx="89" cy="65" rx="4" ry="4.5" fill="#1a1a1a" />
        <ellipse cx="111" cy="65" rx="4" ry="4.5" fill="#1a1a1a" />
        <circle cx="90" cy="63" r="1.5" fill="white" />
        <circle cx="112" cy="63" r="1.5" fill="white" />

        {/* Nose */}
        <path d="M98 70 Q100 78 102 70" stroke={skin} strokeWidth="1.5" fill="none" opacity="0.6" />

        {/* Mouth */}
        <path d="M93 78 Q100 83 107 78" stroke="#8B4513" strokeWidth="1.5" fill="none" opacity="0.7" />

        {/* Glasses overlay */}
        {outfit.glasses && (
          <g>
            <rect x="80" y="60" width="16" height="11" rx="5" fill="none" stroke="#C9A227" strokeWidth="1.5" />
            <rect x="104" y="60" width="16" height="11" rx="5" fill="none" stroke="#C9A227" strokeWidth="1.5" />
            <line x1="96" y1="65" x2="104" y2="65" stroke="#C9A227" strokeWidth="1.5" />
            <line x1="64" y1="65" x2="80" y2="65" stroke="#C9A227" strokeWidth="1.5" />
            <line x1="120" y1="65" x2="136" y2="65" stroke="#C9A227" strokeWidth="1.5" />
          </g>
        )}

        {/* Neck */}
        <rect x="93" y="95" width="14" height="18" fill={skin} />

        {/* Torso / Shirt */}
        <rect
          x={100 - 32 * bw} y="110" width={64 * bw} height="68"
          rx="12"
          fill={outfit.shirt ? "#1a3a2a" : "#2d2d2d"}
          stroke={outfit.shirt ? "#2d5a3f" : "none"}
          strokeWidth="1"
        />

        {/* Collar */}
        <path d={`M${100 - 8}  112 L100 124 L${100 + 8} 112`} fill="none" stroke={outfit.shirt ? "#3d6a4f" : "#444"} strokeWidth="2" />

        {/* Arms */}
        <rect x={100 - 46 * bw} y="114" width={14 * bw} height="58" rx="7" fill={outfit.shirt ? "#1a3a2a" : "#2d2d2d"} />
        <rect x={100 + 32 * bw} y="114" width={14 * bw} height="58" rx="7" fill={outfit.shirt ? "#1a3a2a" : "#2d2d2d"} />

        {/* Hands */}
        <ellipse cx={100 - 39 * bw} cy="175" rx={8 * bw} ry="9" fill={skin} />
        <ellipse cx={100 + 39 * bw} cy="175" rx={8 * bw} ry="9" fill={skin} />

        {/* Cap */}
        {outfit.cap && (
          <g>
            <rect x="69" y="36" width="62" height="18" rx="6" fill="#1a1a2e" />
            <rect x="62" y="50" width="76" height="6" rx="3" fill="#16213e" />
          </g>
        )}

        {/* Pants */}
        <rect
          x={100 - 30 * bw} y="176" width={26 * bw} height="88"
          rx="10"
          fill={outfit.pants ? "#1a2a3a" : "#1a1a1a"}
          stroke={outfit.pants ? "#2a3a4a" : "none"}
          strokeWidth="1"
        />
        <rect
          x={100 + 4 * bw} y="176" width={26 * bw} height="88"
          rx="10"
          fill={outfit.pants ? "#1a2a3a" : "#1a1a1a"}
          stroke={outfit.pants ? "#2a3a4a" : "none"}
          strokeWidth="1"
        />

        {/* Belt */}
        <rect x={100 - 31 * bw} y="174" width={62 * bw} height="7" rx="3" fill={outfit.pants ? "#C9A227" : "#333"} opacity="0.6" />

        {/* Shoes */}
        <ellipse cx={100 - 17 * bw} cy="266" rx={18 * bw} ry="8" fill={outfit.shoes ? "#6B3A2A" : "#444"} />
        <ellipse cx={100 + 17 * bw} cy="266" rx={18 * bw} ry="8" fill={outfit.shoes ? "#6B3A2A" : "#444"} />

        {renderOutfitLabels()}
      </g>
    </svg>
  );
}
