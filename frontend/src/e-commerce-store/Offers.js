/**
 * Offers.js — Veyra Offers Page
 * Shows every discounted product across categories. Regular category pages
 * continue to show full-price + discounted items together; this page is the
 * dedicated "deals" browsing view.
 */

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StoreNav from "../components/StoreNav";
import { productsApi } from "../styles/api";
import { useCart } from "../context/CartContext";

const INK = "#0B0B0E";
const PORCELAIN = "#F3EFE6";
const GOLD = "#C9A227";

const FALLBACK_OFFERS = [
  { id: 2, name: "Linen Shirt", category: "Clothes", price: 86, discount: 15, stock: 20, img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80" },
  { id: 4, name: "Cashmere Sweater", category: "Clothes", price: 195, discount: 10, stock: 8, img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80" },
  { id: 6, name: "Running Sneakers", category: "Shoes", price: 118, discount: 20, stock: 25, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" },
];

const SORTS = [
  { key: "discount", label: "Biggest discount" },
  { key: "price_low", label: "Price: low to high" },
  { key: "price_high", label: "Price: high to low" },
];

function finalPrice(p) {
  return p.price * (1 - p.discount / 100);
}

export default function OffersPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [offers, setOffers] = useState(FALLBACK_OFFERS);
  const [sort, setSort] = useState("discount");
  const [added, setAdded] = useState(null);

  useEffect(() => {
    let cancelled = false;
    productsApi.getOffers().then((res) => {
      if (!cancelled && res?.success) setOffers(res.data);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const sorted = useMemo(() => {
    const list = [...offers];
    if (sort === "discount") list.sort((a, b) => b.discount - a.discount);
    if (sort === "price_low") list.sort((a, b) => finalPrice(a) - finalPrice(b));
    if (sort === "price_high") list.sort((a, b) => finalPrice(b) - finalPrice(a));
    return list;
  }, [offers, sort]);

  const quickAdd = (p) => {
    if (p.stock === 0) return;
    addItem(p, { qty: 1, color: p.colors?.[0] || "", size: p.sizes?.[0] || "" });
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1200);
  };

  return (
    <div className="min-h-screen w-full" style={{ background: INK, fontFamily: "Inter, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Inter:wght@400;500&display=swap');`}</style>

      <StoreNav onBack={() => navigate("/home")} />

      <header className="px-6 md:px-14 pt-2 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(1.8rem, 4vw, 2.4rem)", color: PORCELAIN }}>Offers</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(243,239,230,0.45)" }}>
            {sorted.length} piece{sorted.length !== 1 ? "s" : ""} currently discounted
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className="rounded-full px-4 py-1.5 text-xs uppercase tracking-widest"
              style={{
                border: `1px solid ${sort === s.key ? GOLD : "rgba(243,239,230,0.2)"}`,
                color: sort === s.key ? GOLD : "rgba(243,239,230,0.6)",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </header>

      <main className="px-6 md:px-14 pb-20">
        {sorted.length === 0 ? (
          <p className="text-sm" style={{ color: "rgba(243,239,230,0.5)" }}>No active offers right now — check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {sorted.map((p) => (
              <div key={p.id} className="relative">
                <div className="relative overflow-hidden rounded-xl mb-3" style={{ aspectRatio: "3/4" }}>
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                  <span
                    className="absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] uppercase tracking-widest"
                    style={{ background: GOLD, color: INK, fontWeight: 600 }}
                  >
                    -{p.discount}%
                  </span>
                  <button
                    onClick={() => quickAdd(p)}
                    disabled={p.stock === 0}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 text-xs uppercase tracking-widest"
                    style={{ background: "rgba(11,11,14,0.85)", color: added === p.id ? GOLD : PORCELAIN, border: "1px solid rgba(243,239,230,0.2)", opacity: p.stock === 0 ? 0.4 : 1 }}
                  >
                    {p.stock === 0 ? "Out of stock" : added === p.id ? "Added ✓" : "Add to cart"}
                  </button>
                </div>
                <p style={{ color: PORCELAIN, fontSize: "0.9rem" }}>{p.name}</p>
                <p style={{ color: "rgba(243,239,230,0.4)", fontSize: "0.75rem" }}>{p.category}</p>
                <p style={{ fontSize: "0.85rem" }}>
                  <span style={{ color: GOLD, marginRight: "8px" }}>${finalPrice(p).toFixed(2)}</span>
                  <span style={{ color: "rgba(243,239,230,0.4)", textDecoration: "line-through" }}>${p.price}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
