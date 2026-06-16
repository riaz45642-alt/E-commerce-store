import { useState } from "react";
import { Search, User, ShoppingBag } from "lucide-react";

const INK = "#0B0B0E";
const PORCELAIN = "#F3EFE6";
const GOLD = "#C9A227";

const CATEGORIES = [
  { name: "Clothes", img: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&q=80" },
  { name: "Shoes", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" },
  { name: "Accessories", img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80" },
  { name: "Bags", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80" },
  { name: "Watches", img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80" },
];

export default function HomePage({ onSelectCategory = (c) => console.log("→ category:", c) }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="min-h-screen w-full" style={{ background: INK, fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Inter:wght@400;500&display=swap');
        .cat-card { transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), flex-grow 0.5s cubic-bezier(0.22,1,0.36,1); }
        .cat-img { transition: transform 0.6s ease; }
      `}</style>

      <nav className="w-full flex items-center justify-between px-6 md:px-14 py-6">
        <span style={{ fontFamily: "Fraunces, serif", fontSize: "1.3rem", color: PORCELAIN, letterSpacing: "0.05em" }}>
          Veyra
        </span>
        <div className="flex items-center gap-6" style={{ color: PORCELAIN }}>
          <Search size={18} className="cursor-pointer opacity-70 hover:opacity-100" />
          <User size={18} className="cursor-pointer opacity-70 hover:opacity-100" />
          <ShoppingBag size={18} className="cursor-pointer opacity-70 hover:opacity-100" />
        </div>
      </nav>

      <header className="px-6 md:px-14 pt-6 pb-10 text-center">
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: PORCELAIN, fontWeight: 400 }}>
          Shop by category
        </h1>
        <p className="text-sm mt-2" style={{ color: "rgba(243,239,230,0.5)" }}>
          Curated for your taste. Nothing else.
        </p>
      </header>

      <main className="px-4 md:px-10 pb-16">
        <div className="flex flex-col md:flex-row gap-3 h-[70vh] md:h-[64vh]">
          {CATEGORIES.map((cat) => {
            const isHovered = hovered === cat.name;
            return (
              <div
                key={cat.name}
                onMouseEnter={() => setHovered(cat.name)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelectCategory(cat.name)}
                className="cat-card relative overflow-hidden rounded-2xl cursor-pointer flex-1"
                style={{
                  flexGrow: isHovered ? 2.2 : 1,
                  minHeight: "140px",
                }}
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="cat-img absolute inset-0 w-full h-full object-cover"
                  style={{ transform: isHovered ? "scale(1.08)" : "scale(1)" }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(11,11,14,0.75), rgba(11,11,14,0.05))" }}
                />
                <div className="absolute bottom-0 left-0 p-5">
                  <span
                    style={{
                      fontFamily: "Fraunces, serif",
                      fontSize: "1.3rem",
                      color: PORCELAIN,
                      borderBottom: isHovered ? `1px solid ${GOLD}` : "1px solid transparent",
                      paddingBottom: "2px",
                    }}
                  >
                    {cat.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}