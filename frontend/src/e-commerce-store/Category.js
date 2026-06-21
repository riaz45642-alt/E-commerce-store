/**
 * Category.js — Veyra Category Page
 * Horizontal side-scrolling product rail with larger, smoother cards.
 * Pulls live product/stock data from the backend; falls back to a static
 * set if the API is unreachable so the page still renders standalone.
 */

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import StoreNav from "../components/StoreNav";
import { productsApi } from "../logic/api";
import { useCart } from "../context/CartContext";

const INK = "#0B0B0E";
const PORCELAIN = "#F3EFE6";
const GOLD = "#C9A227";

const FALLBACK_PRODUCTS = [
  { id: 1, name: "Wool Overcoat", price: 248, discount: 0, colors: ["Ink", "Sand"], sizes: ["S", "M", "L"], stock: 12, img: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80" },
  { id: 2, name: "Linen Shirt", price: 86, discount: 15, colors: ["Porcelain", "Sage"], sizes: ["S", "M", "L"], stock: 20, img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80" },
  { id: 3, name: "Tailored Trousers", price: 132, discount: 0, colors: ["Ink"], sizes: ["30", "32", "34"], stock: 0, img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80" },
  { id: 4, name: "Cashmere Sweater", price: 195, discount: 10, colors: ["Wine", "Sand"], sizes: ["S", "M", "L"], stock: 8, img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80" },
];

function finalPrice(p) {
  return p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
}

export default function CategoryPage({ categoryName = "Clothes", onBack = () => {} }) {
  const { addItem } = useCart();
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [quickView, setQuickView] = useState(null);
  const [selColor, setSelColor] = useState("");
  const [selSize, setSelSize] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    productsApi.getAll({ category: categoryName }).then((res) => {
      if (!cancelled && res?.success && res.data?.length) setProducts(res.data);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [categoryName]);

  const openQuickView = (p) => {
    setQuickView(p);
    setSelColor(p.colors?.[0] || "");
    setSelSize(p.sizes?.[0] || "");
    setAdded(false);
  };

  const handleAddToCart = () => {
    if (!quickView || quickView.stock === 0) return;
    addItem(quickView, { qty: 1, color: selColor, size: selSize });
    setAdded(true);
    setTimeout(() => setQuickView(null), 700);
  };

  return (
    <div className="min-h-screen w-full" style={{ background: INK, fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Inter:wght@400;500&display=swap');
        .pcard-img { transition: transform 0.5s cubic-bezier(0.22,1,0.36,1); }
        .pcard:hover .pcard-img { transform: scale(1.06); }
        .qv-btn { opacity: 0; transition: opacity 0.3s ease, transform 0.3s ease; transform: translateY(8px); }
        .pcard:hover .qv-btn { opacity: 1; transform: translateY(0); }
        .rail { display: flex; overflow-x: auto; scroll-snap-type: x proximity; scrollbar-width: thin; scrollbar-color: rgba(201,162,39,0.4) transparent; padding-bottom: 14px; }
        .rail::-webkit-scrollbar { height: 6px; }
        .rail::-webkit-scrollbar-thumb { background: rgba(201,162,39,0.35); border-radius: 10px; }
        .rail-card { scroll-snap-align: start; flex: 0 0 auto; }
      `}</style>

      <StoreNav onBack={onBack} />

      <header className="px-6 md:px-14 pt-2 pb-8">
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", color: PORCELAIN }}>
          {categoryName}
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(243,239,230,0.45)" }}>
          Scroll sideways to browse the full edit →
        </p>
      </header>

      <main className="pb-20">
        <div className="rail px-6 md:px-14 gap-6">
          {products.map((p) => {
            const outOfStock = p.stock === 0;
            const discounted = p.discount > 0;
            return (
              <div
                key={p.id}
                className="rail-card pcard relative"
                style={{ width: "min(72vw, 320px)" }}
              >
                <div className="relative overflow-hidden rounded-2xl mb-3" style={{ aspectRatio: "3/4" }}>
                  <img src={p.img} alt={p.name} className="pcard-img w-full h-full object-cover" />
                  {discounted && (
                    <span
                      className="absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] uppercase tracking-widest"
                      style={{ background: GOLD, color: INK, fontWeight: 600 }}
                    >
                      -{p.discount}%
                    </span>
                  )}
                  {outOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(11,11,14,0.55)" }}>
                      <span className="text-xs uppercase tracking-widest" style={{ color: PORCELAIN }}>Out of stock</span>
                    </div>
                  )}
                  <button
                    onClick={() => openQuickView(p)}
                    disabled={outOfStock}
                    className="qv-btn absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 text-xs uppercase tracking-widest"
                    style={{ background: "rgba(11,11,14,0.8)", color: PORCELAIN, border: "1px solid rgba(243,239,230,0.2)" }}
                  >
                    {outOfStock ? "Unavailable" : "Quick view"}
                  </button>
                </div>
                <p style={{ color: PORCELAIN, fontSize: "0.95rem" }}>{p.name}</p>
                <p style={{ fontSize: "0.85rem" }}>
                  {discounted ? (
                    <>
                      <span style={{ color: GOLD, marginRight: "8px" }}>${finalPrice(p).toFixed(2)}</span>
                      <span style={{ color: "rgba(243,239,230,0.4)", textDecoration: "line-through" }}>${p.price}</span>
                    </>
                  ) : (
                    <span style={{ color: "rgba(243,239,230,0.55)" }}>${p.price}</span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </main>

      {quickView && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(11,11,14,0.85)" }}
          onClick={() => setQuickView(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl rounded-2xl overflow-hidden flex flex-col md:flex-row"
            style={{ background: "#15151A" }}
          >
            <img src={quickView.img} alt={quickView.name} className="w-full md:w-1/2 h-64 md:h-auto object-cover" />
            <div className="flex-1 p-7 relative">
              <button onClick={() => setQuickView(null)} className="absolute top-5 right-5" style={{ color: "rgba(243,239,230,0.6)" }}>
                <X size={18} />
              </button>
              <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "1.5rem", color: PORCELAIN }}>{quickView.name}</h2>
              <p style={{ color: GOLD, fontSize: "1.1rem", margin: "10px 0 6px" }}>
                ${finalPrice(quickView).toFixed(2)}
                {quickView.discount > 0 && (
                  <span style={{ color: "rgba(243,239,230,0.4)", textDecoration: "line-through", fontSize: "0.9rem", marginLeft: "8px" }}>
                    ${quickView.price}
                  </span>
                )}
              </p>
              <p style={{ color: "rgba(243,239,230,0.55)", fontSize: "0.85rem", lineHeight: 1.7, marginBottom: "20px" }}>
                Cut from premium fabric with a clean, considered silhouette. Designed to move easily between settings.
              </p>

              {quickView.colors?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(243,239,230,0.5)" }}>Color</p>
                  <div className="flex gap-2 flex-wrap">
                    {quickView.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelColor(c)}
                        className="rounded-full px-3 py-1.5 text-xs"
                        style={{
                          border: `1px solid ${selColor === c ? GOLD : "rgba(243,239,230,0.2)"}`,
                          color: selColor === c ? GOLD : PORCELAIN,
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quickView.sizes?.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(243,239,230,0.5)" }}>Size</p>
                  <div className="flex gap-2 flex-wrap">
                    {quickView.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelSize(s)}
                        className="rounded-full px-3 py-1.5 text-xs"
                        style={{
                          border: `1px solid ${selSize === s ? GOLD : "rgba(243,239,230,0.2)"}`,
                          color: selSize === s ? GOLD : PORCELAIN,
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={quickView.stock === 0}
                className="rounded-full px-7 py-3 text-sm uppercase tracking-widest"
                style={{ background: added ? "#7C8B72" : GOLD, color: INK, opacity: quickView.stock === 0 ? 0.4 : 1 }}
              >
                {added ? "Added ✓" : "Add to cart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
