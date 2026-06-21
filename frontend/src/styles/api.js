/**
 * api.js — Veyra Frontend API Service
 * All HTTP calls to the backend are centralised here.
 * JSX components import from this file; they never call fetch() directly.
 */

const BASE = process.env.REACT_APP_API_URL || "";

function adminHeaders() {
  const token = localStorage.getItem("veyra_admin_token");
  return token ? { "x-admin-token": token } : {};
}

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

async function put(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...adminHeaders() },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function patch(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...adminHeaders() },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function del(path) {
  const res = await fetch(`${BASE}${path}`, {
    method: "DELETE",
    headers: { ...adminHeaders() },
  });
  return res.json();
}

async function postAdmin(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...adminHeaders() },
    body: JSON.stringify(body),
  });
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

// ── Product catalog endpoints ─────────────────────────────────────────────────

export const productsApi = {
  getAll:    (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return get(`/api/products${qs ? `?${qs}` : ""}`);
  },
  getOne:    (id)              => get(`/api/products/${id}`),
  getOffers: ()                => get("/api/products?onSale=true"),
  create:    (payload)         => postAdmin("/api/products", payload),
  update:    (id, payload)     => put(`/api/products/${id}`, payload),
  remove:    (id)               => del(`/api/products/${id}`),
  adjustStock: (id, mode, amount) => patch(`/api/products/${id}/stock`, { mode, amount }),
  sell:      (id, quantity = 1) => post(`/api/products/${id}/sell`, { quantity }),
};

// ── Admin auth endpoints ──────────────────────────────────────────────────────

export const adminApi = {
  login:  (username, password) => post("/api/admin/login", { username, password }),
  logout: (token)               => post("/api/admin/logout", { token }),
  verify: () => fetch(`${BASE}/api/admin/verify`, { headers: { ...adminHeaders() } }).then((r) => r.json()),
};
