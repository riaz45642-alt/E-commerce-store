/**
 * api.js — Veyra Frontend API Service
 * All HTTP calls to the backend are centralised here.
 * JSX components import from this file; they never call fetch() directly.
 */

const BASE = process.env.REACT_APP_API_URL || "";

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  return res.json();
}

// ── Demo endpoints ────────────────────────────────────────────────────────────

export const demoApi = {
  saveLinks:        (links)    => post("/api/demo/save-links", { links }),
  saveUserFeatures: (features) => post("/api/demo/save-user-features", { features }),
  getDemoPreview:   ()         => get("/api/demo/demo-preview"),
};

// ── Auth endpoints ────────────────────────────────────────────────────────────

export const authApi = {
  signup: (payload) => post("/api/auth/signup", payload),
  login:  (payload) => post("/api/auth/login",  payload),
};

// ── Contact / feedback form ───────────────────────────────────────────────────

export const contactApi = {
  submit: (payload) => post("/api/contact/submit", payload),
};
