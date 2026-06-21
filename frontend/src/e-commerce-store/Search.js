/**
 * Search.js — Veyra Search Results Page
 * Driven by the search bar in StoreNav (/search?q=...).
 */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import StoreNav from "../components/StoreNav";
import { productsApi } from "../logic/api";
import { useCart } from "../context/CartContext";

const INK = "#0B0B0E";
const PORCELAIN = "#F3EFE6";
const GOLD = "#C9A227";

function finalPrice(p) {
  return p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const { addItem } = useCart();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productsApi.getAll({ search: q }).then((res) => {
      setResults(res?.success ? res.data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [q]);

  return (
    <div className="min-h-screen w-full" style={{ background: INK, fontFamily: "Inter, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Inter:wght@400;500&display=swap');`}</style>

      <StoreNav onBack={() => navigate("/home")} />

      <header className="px-6 md:px-14 pt-2 pb-8">
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", color: PORCELAIN }}>
          Results for "{q}"
        </h1>
      </header>

      <main className="px-6 md:px-14 pb-20">
        {loading ? (
          <p className="text-sm" style={{ color: "rgba(243,239,230,0.5)" }}>Searching…</p>
        ) : results.length === 0 ? (
          <p className="text-sm" style={{ color: "rgba(243,239,230,0.5)" }}>No products matched your search.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {results.map((p) => (
              <div key={p.id} className="relative">
                <div className="relative overflow-hidden rounded-xl mb-3" style={{ aspectRatio: "3/4" }}>
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => addItem(p, { qty: 1, color: p.colors?.[0] || "", size: p.sizes?.[0] || "" })}
                    disabled={p.stock === 0}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 text-xs uppercase tracking-widest"
                    style={{ background: "rgba(11,11,14,0.85)", color: PORCELAIN, border: "1px solid rgba(243,239,230,0.2)", opacity: p.stock === 0 ? 0.4 : 1 }}
                  >
                    {p.stock === 0 ? "Out of stock" : "Add to cart"}
                  </button>
                </div>
                <p style={{ color: PORCELAIN, fontSize: "0.9rem" }}>{p.name}</p>
                <p style={{ color: "rgba(243,239,230,0.4)", fontSize: "0.75rem" }}>{p.category}</p>
                <p style={{ color: GOLD, fontSize: "0.85rem" }}>${finalPrice(p).toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
