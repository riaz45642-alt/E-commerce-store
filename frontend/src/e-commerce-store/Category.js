import { useState } from "react";
import { ArrowLeft, X } from "lucide-react";

const INK = "#0B0B0E";
const PORCELAIN = "#F3EFE6";
const GOLD = "#C9A227";

const PRODUCTS = [
  { id: 1, name: "Wool Overcoat", price: 248, img: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&q=80" },
  { id: 2, name: "Linen Shirt", price: 86, img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80" },
  { id: 3, name: "Tailored Trousers", price: 132, img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80" },
  { id: 4, name: "Cashmere Sweater", price: 195, img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80" },
  { id: 5, name: "Silk Slip Dress", price: 168, img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80" },
  { id: 6, name: "Denim Jacket", price: 118, img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80" },
  { id: 7, name: "Pleated Midi Skirt", price: 96, img: "https://images.unsplash.com/photo-1583496661160-fb5886a13d77?w=500&q=80" },
  { id: 8, name: "Merino Polo", price: 74, img: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&q=80" },
];

export default function CategoryPage({ categoryName = "Clothes", onBack = () => {}, onAddToCart = (p) => console.log("add to cart", p) }) {
  const [quickView, setQuickView] = useState(null);

  return (
    <div className="min-h-screen w-full" style={{ background: INK, fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Inter:wght@400;500&display=swap');
        .pcard-img { transition: transform 0.5s cubic-bezier(0.22,1,0.36,1); }
        .pcard:hover .pcard-img { transform: scale(1.06); }
        .qv-btn { opacity: 0; transition: opacity 0.3s ease, transform 0.3s ease; transform: translateY(8px); }
        .pcard:hover .qv-btn { opacity: 1; transform: translateY(0); }
      `}</style>

      <nav className="w-full flex items-center justify-between px-6 md:px-14 py-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm" style={{ color: "rgba(243,239,230,0.7)" }}>
          <ArrowLeft size={16} /> Back
        </button>
        <span style={{ fontFamily: "Fraunces, serif", fontSize: "1.3rem", color: PORCELAIN }}>Veyra</span>
        <span style={{ width: "60px" }} />
      </nav>

      <header className="px-6 md:px-14 pt-2 pb-8">
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", color: PORCELAIN }}>
          {categoryName}
        </h1>
      </header>

      <main className="px-6 md:px-14 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="pcard relative">
              <div className="relative overflow-hidden rounded-xl aspect-[3/4] mb-3">
                <img src={p.img} alt={p.name} className="pcard-img w-full h-full object-cover" />
                <button
                  onClick={() => setQuickView(p)}
                  className="qv-btn absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 text-xs uppercase tracking-widest"
                  style={{ background: "rgba(11,11,14,0.8)", color: PORCELAIN, border: "1px solid rgba(243,239,230,0.2)" }}
                >
                  Quick view
                </button>
              </div>
              <p style={{ color: PORCELAIN, fontSize: "0.9rem" }}>{p.name}</p>
              <p style={{ color: "rgba(243,239,230,0.55)", fontSize: "0.85rem" }}>${p.price}</p>
            </div>
          ))}
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
              <p style={{ color: GOLD, fontSize: "1.1rem", margin: "10px 0 18px" }}>${quickView.price}</p>
              <p style={{ color: "rgba(243,239,230,0.55)", fontSize: "0.85rem", lineHeight: 1.7, marginBottom: "28px" }}>
                Cut from premium fabric with a clean, considered silhouette. Designed to move easily between settings.
              </p>
              <button
                onClick={() => { onAddToCart(quickView); setQuickView(null); }}
                className="rounded-full px-7 py-3 text-sm uppercase tracking-widest"
                style={{ background: GOLD, color: INK }}
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}