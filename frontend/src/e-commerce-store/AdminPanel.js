/**
 * AdminPanel.js — Veyra Admin Panel (restricted to the store owner)
 * Gated by /api/admin/login; the issued token is sent as x-admin-token on
 * every product write request (see styles/api.js → adminHeaders()).
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Plus, Pencil, Trash2, Minus, LogOut, X } from "lucide-react";
import { adminApi, productsApi } from "../styles/api";

const INK = "#0B0B0E";
const PORCELAIN = "#F3EFE6";
const GOLD = "#C9A227";

const TOKEN_KEY = "veyra_admin_token";

const EMPTY_FORM = { name: "", category: "", price: "", discount: "", colors: "", sizes: "", stock: "", img: "" };

export default function AdminPanel() {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!token) { setChecking(false); return; }
    adminApi.verify().then((res) => {
      if (!res?.valid) { localStorage.removeItem(TOKEN_KEY); setToken(""); }
      setChecking(false);
    }).catch(() => setChecking(false));
  }, [token]);

  if (checking) return <Shell><p style={{ color: "rgba(243,239,230,0.5)" }}>Loading…</p></Shell>;

  return token ? (
    <Dashboard token={token} onLogout={() => { localStorage.removeItem(TOKEN_KEY); setToken(""); }} onBack={() => navigate("/home")} />
  ) : (
    <Login onLoggedIn={(t) => { localStorage.setItem(TOKEN_KEY, t); setToken(t); }} onBack={() => navigate("/home")} />
  );
}

function Shell({ children }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ background: INK, fontFamily: "Inter, sans-serif" }}>
      {children}
    </div>
  );
}

// ── Login ────────────────────────────────────────────────────────────────────

function Login({ onLoggedIn, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await adminApi.login(username, password);
      if (res?.success) onLoggedIn(res.token);
      else setError(res?.error || "Invalid credentials.");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Inter:wght@400;500&display=swap');
        input.field { background: transparent; border: none; border-bottom: 1px solid rgba(243,239,230,0.25); color: ${PORCELAIN}; padding: 10px 2px; font-size: 0.95rem; outline: none; width: 100%; }
        input.field:focus { border-bottom-color: ${GOLD}; }
        input.field::placeholder { color: rgba(243,239,230,0.35); }
      `}</style>
      <form onSubmit={submit} className="w-full max-w-sm px-6">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(201,162,39,0.12)", border: `1px solid ${GOLD}` }}>
            <Lock size={18} style={{ color: GOLD }} />
          </div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "1.5rem", color: PORCELAIN }}>Owner access only</h1>
          <p className="text-xs mt-2 text-center" style={{ color: "rgba(243,239,230,0.45)" }}>Sign in to manage products and stock.</p>
        </div>
        <div className="flex flex-col gap-1">
          <input className="field" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input className="field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-xs mt-3" style={{ color: "#C0584A" }}>{error}</p>}
        <button type="submit" disabled={loading} className="w-full mt-7 rounded-full py-3 text-sm uppercase tracking-widest" style={{ background: GOLD, color: INK, opacity: loading ? 0.6 : 1 }}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <button type="button" onClick={onBack} className="w-full mt-4 text-xs" style={{ color: "rgba(243,239,230,0.4)" }}>
          Back to store
        </button>
      </form>
    </Shell>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ token, onLogout, onBack }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    productsApi.getAll().then((res) => {
      setProducts(res?.success ? res.data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    const res = await productsApi.remove(id);
    if (res?.success) setProducts((p) => p.filter((x) => x.id !== id));
    else setError(res?.error || "Could not delete product.");
  };

  const adjustStock = async (id, mode, amount) => {
    const res = await productsApi.adjustStock(id, mode, amount);
    if (res?.success) setProducts((p) => p.map((x) => (x.id === id ? res.data : x)));
    else setError(res?.error || "Could not update stock.");
  };

  const handleLogout = async () => {
    await adminApi.logout(token).catch(() => {});
    onLogout();
  };

  return (
    <div className="min-h-screen w-full" style={{ background: INK, fontFamily: "Inter, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Inter:wght@400;500&display=swap');`}</style>

      <nav className="w-full flex items-center justify-between px-6 md:px-14 py-6">
        <button onClick={onBack} className="text-sm" style={{ color: "rgba(243,239,230,0.6)" }}>← Store</button>
        <span style={{ fontFamily: "Fraunces, serif", fontSize: "1.2rem", color: PORCELAIN }}>Admin Panel</span>
        <button onClick={handleLogout} className="flex items-center gap-1 text-sm" style={{ color: "rgba(243,239,230,0.6)" }}>
          <LogOut size={14} /> Logout
        </button>
      </nav>

      <header className="px-6 md:px-14 pt-2 pb-6 flex items-center justify-between">
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "1.8rem", color: PORCELAIN }}>Products</h1>
        <button onClick={() => setEditing({})} className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm uppercase tracking-widest" style={{ background: GOLD, color: INK }}>
          <Plus size={15} /> Add product
        </button>
      </header>

      {error && <p className="px-6 md:px-14 text-xs mb-4" style={{ color: "#C0584A" }}>{error}</p>}

      <main className="px-6 md:px-14 pb-20">
        {loading ? (
          <p style={{ color: "rgba(243,239,230,0.5)" }}>Loading…</p>
        ) : (
          <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            <table className="w-full text-sm" style={{ color: PORCELAIN }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                  {["Product", "Category", "Price", "Discount", "Colors", "Sizes", "Stock", "Status", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-normal text-xs uppercase tracking-widest" style={{ color: "rgba(243,239,230,0.5)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img src={p.img} alt={p.name} className="w-9 h-11 object-cover rounded" />
                      {p.name}
                    </td>
                    <td className="px-4 py-3">{p.category}</td>
                    <td className="px-4 py-3">${p.price}</td>
                    <td className="px-4 py-3">{p.discount > 0 ? `${p.discount}%` : "—"}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "rgba(243,239,230,0.6)" }}>{p.colors?.join(", ") || "—"}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "rgba(243,239,230,0.6)" }}>{p.sizes?.join(", ") || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => adjustStock(p.id, "increment", -1)} disabled={p.stock <= 0} style={{ color: PORCELAIN, opacity: p.stock <= 0 ? 0.3 : 1 }}><Minus size={13} /></button>
                        <span>{p.stock}</span>
                        <button onClick={() => adjustStock(p.id, "increment", 1)} style={{ color: PORCELAIN }}><Plus size={13} /></button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full px-2.5 py-1 text-[11px] uppercase tracking-widest" style={{ background: p.status === "in stock" ? "rgba(124,139,114,0.18)" : "rgba(192,88,74,0.18)", color: p.status === "in stock" ? "#9DB392" : "#D08070" }}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setEditing(p)} style={{ color: "rgba(243,239,230,0.6)" }}><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(p.id)} style={{ color: "rgba(243,239,230,0.6)" }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {editing !== null && (
        <ProductForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={(saved) => {
            setProducts((prev) => {
              const exists = prev.some((x) => x.id === saved.id);
              return exists ? prev.map((x) => (x.id === saved.id ? saved : x)) : [...prev, saved];
            });
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

// ── Add / Edit form modal ─────────────────────────────────────────────────────

function ProductForm({ initial, onClose, onSaved }) {
  const isEdit = !!initial.id;
  const [form, setForm] = useState(() =>
    isEdit
      ? {
          name: initial.name, category: initial.category, price: initial.price, discount: initial.discount,
          colors: (initial.colors || []).join(", "), sizes: (initial.sizes || []).join(", "),
          stock: initial.stock, img: initial.img,
        }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price) { setError("Name, category, and price are required."); return; }
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      discount: Number(form.discount) || 0,
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      stock: Number(form.stock) || 0,
      img: form.img,
    };
    const res = isEdit ? await productsApi.update(initial.id, payload) : await productsApi.create(payload);
    setSaving(false);
    if (res?.success) onSaved(res.data);
    else setError(res?.error || "Could not save product.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(11,11,14,0.85)" }} onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl p-7 relative" style={{ background: "#15151A" }}>
        <style>{`
          input.field, select.field { background: transparent; border: none; border-bottom: 1px solid rgba(243,239,230,0.25); color: ${PORCELAIN}; padding: 10px 2px; font-size: 0.9rem; outline: none; width: 100%; }
          input.field:focus, select.field:focus { border-bottom-color: ${GOLD}; }
          input.field::placeholder { color: rgba(243,239,230,0.35); }
          select.field option { background: #15151A; }
        `}</style>
        <button type="button" onClick={onClose} className="absolute top-5 right-5" style={{ color: "rgba(243,239,230,0.6)" }}><X size={18} /></button>
        <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "1.3rem", color: PORCELAIN, marginBottom: "20px" }}>
          {isEdit ? "Edit product" : "Add product"}
        </h2>
        <div className="flex flex-col gap-3">
          <input className="field" placeholder="Product name" value={form.name} onChange={(e) => update("name", e.target.value)} />
          <input className="field" placeholder="Category (e.g. Clothes, Shoes)" value={form.category} onChange={(e) => update("category", e.target.value)} />
          <div className="flex gap-4">
            <input className="field" type="number" placeholder="Price ($)" value={form.price} onChange={(e) => update("price", e.target.value)} />
            <input className="field" type="number" placeholder="Discount (%)" value={form.discount} onChange={(e) => update("discount", e.target.value)} />
          </div>
          <input className="field" placeholder="Colors (comma separated)" value={form.colors} onChange={(e) => update("colors", e.target.value)} />
          <input className="field" placeholder="Sizes (comma separated)" value={form.sizes} onChange={(e) => update("sizes", e.target.value)} />
          <input className="field" type="number" placeholder="Stock quantity" value={form.stock} onChange={(e) => update("stock", e.target.value)} />
          <input className="field" placeholder="Image URL" value={form.img} onChange={(e) => update("img", e.target.value)} />
        </div>
        {error && <p className="text-xs mt-3" style={{ color: "#C0584A" }}>{error}</p>}
        <button type="submit" disabled={saving} className="w-full mt-6 rounded-full py-3 text-sm uppercase tracking-widest" style={{ background: GOLD, color: INK, opacity: saving ? 0.6 : 1 }}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Add product"}
        </button>
      </form>
    </div>
  );
}
