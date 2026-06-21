/**
 * Profile.js — Veyra User Profile Page
 * Lets a user create a profile and select likes/dislikes (color preferences).
 * Stored locally for now; Phase 2 will use these preferences to personalise
 * the products shown on the home page.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import StoreNav from "../components/StoreNav";

const INK = "#0B0B0E";
const PORCELAIN = "#F3EFE6";
const GOLD = "#C9A227";

const COLOR_OPTIONS = [
  { name: "Ink", hex: "#1A1A1E" },
  { name: "Porcelain", hex: "#F3EFE6" },
  { name: "Gold", hex: "#C9A227" },
  { name: "Sage", hex: "#7C8B72" },
  { name: "Rust", hex: "#A8543B" },
  { name: "Slate", hex: "#5B6770" },
  { name: "Wine", hex: "#6E2C3E" },
  { name: "Sand", hex: "#C9B79C" },
];

const STORAGE_KEY = "veyra_profile";

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { name: "", email: "", likes: [], dislikes: [] };
  } catch {
    return { name: "", email: "", likes: [], dislikes: [] };
  }
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(loadProfile);
  const [saved, setSaved] = useState(false);

  const toggle = (key, color) => {
    setSaved(false);
    setProfile((p) => {
      const other = key === "likes" ? "dislikes" : "likes";
      const inThis = p[key].includes(color);
      return {
        ...p,
        [key]: inThis ? p[key].filter((c) => c !== color) : [...p[key], color],
        [other]: p[other].filter((c) => c !== color),
      };
    });
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="min-h-screen w-full" style={{ background: INK, fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Inter:wght@400;500&display=swap');
        input.field { background: transparent; border: none; border-bottom: 1px solid rgba(243,239,230,0.25); color: ${PORCELAIN}; padding: 10px 2px; font-size: 0.95rem; outline: none; width: 100%; }
        input.field:focus { border-bottom-color: ${GOLD}; }
        input.field::placeholder { color: rgba(243,239,230,0.35); }
      `}</style>

      <StoreNav onBack={() => navigate("/home")} showSearch={false} />

      <header className="px-6 md:px-14 pt-2 pb-8">
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(1.8rem, 4vw, 2.4rem)", color: PORCELAIN }}>Your profile</h1>
        <p className="text-sm mt-1 max-w-md" style={{ color: "rgba(243,239,230,0.45)" }}>
          Tell us what you like and dislike. We'll use this to tailor what you see — coming soon.
        </p>
      </header>

      <main className="px-6 md:px-14 pb-24 max-w-xl">
        <div className="flex flex-col gap-1 mb-10">
          <input className="field" placeholder="Full name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          <input className="field" type="email" placeholder="Email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
        </div>

        <section className="mb-10">
          <h2 className="text-sm uppercase tracking-widest mb-1" style={{ color: PORCELAIN }}>Colors you like</h2>
          <p className="text-xs mb-4" style={{ color: "rgba(243,239,230,0.45)" }}>Tap to mark a preference.</p>
          <div className="grid grid-cols-4 gap-4">
            {COLOR_OPTIONS.map((c) => (
              <ColorSwatch key={c.name} c={c} active={profile.likes.includes(c.name)} onClick={() => toggle("likes", c.name)} activeColor={GOLD} />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-sm uppercase tracking-widest mb-1" style={{ color: PORCELAIN }}>Colors you dislike</h2>
          <p className="text-xs mb-4" style={{ color: "rgba(243,239,230,0.45)" }}>We'll keep these out of your recommendations.</p>
          <div className="grid grid-cols-4 gap-4">
            {COLOR_OPTIONS.map((c) => (
              <ColorSwatch key={c.name} c={c} active={profile.dislikes.includes(c.name)} onClick={() => toggle("dislikes", c.name)} activeColor="#A8543B" />
            ))}
          </div>
        </section>

        <button
          onClick={save}
          className="rounded-full px-7 py-3 text-sm uppercase tracking-widest"
          style={{ background: saved ? "#7C8B72" : GOLD, color: INK }}
        >
          {saved ? "Saved ✓" : "Save profile"}
        </button>
      </main>
    </div>
  );
}

function ColorSwatch({ c, active, onClick, activeColor }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2">
      <span
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: c.hex, border: active ? `2px solid ${activeColor}` : "1px solid rgba(243,239,230,0.2)" }}
      >
        {active && <Check size={16} style={{ color: c.hex === "#F3EFE6" ? INK : PORCELAIN }} />}
      </span>
      <span className="text-xs" style={{ color: "rgba(243,239,230,0.6)" }}>{c.name}</span>
    </button>
  );
}
