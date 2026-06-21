/**
 * StoreNav.jsx — Shared top navigation for Veyra storefront pages.
 * Provides: logo / home link, functional search bar, profile link, cart link with badge.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, ShoppingBag, ArrowLeft, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";

const INK = "#0B0B0E";
const PORCELAIN = "#F3EFE6";
const GOLD = "#C9A227";

export default function StoreNav({ onBack = null, showSearch = true }) {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const runSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 md:px-14 py-6 relative">
      {onBack ? (
        <button onClick={onBack} className="flex items-center gap-2 text-sm" style={{ color: "rgba(243,239,230,0.7)" }}>
          <ArrowLeft size={16} /> Back
        </button>
      ) : (
        <span
          onClick={() => navigate("/home")}
          className="cursor-pointer"
          style={{ fontFamily: "Fraunces, serif", fontSize: "1.3rem", color: PORCELAIN, letterSpacing: "0.05em" }}
        >
          Veyra
        </span>
      )}

      <div className="flex items-center gap-5" style={{ color: PORCELAIN }}>
        {showSearch && (
          <div className="relative flex items-center">
            {searchOpen ? (
              <form onSubmit={runSearch} className="flex items-center">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={() => !query && setSearchOpen(false)}
                  placeholder="Search products..."
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(243,239,230,0.2)",
                    color: PORCELAIN,
                    borderRadius: "20px",
                    padding: "0.35rem 0.9rem",
                    fontSize: "0.8rem",
                    outline: "none",
                    width: "180px",
                  }}
                />
              </form>
            ) : (
              <Search
                size={18}
                className="cursor-pointer opacity-70 hover:opacity-100"
                onClick={() => setSearchOpen(true)}
              />
            )}
          </div>
        )}
        <Tag
          size={18}
          className="cursor-pointer opacity-70 hover:opacity-100"
          onClick={() => navigate("/offers")}
          title="Offers"
        />
        <User
          size={18}
          className="cursor-pointer opacity-70 hover:opacity-100"
          onClick={() => navigate("/profile")}
          title="Profile"
        />
        <div className="relative cursor-pointer" onClick={() => navigate("/cart")} title="Cart">
          <ShoppingBag size={18} className="opacity-70 hover:opacity-100" />
          {itemCount > 0 && (
            <span
              className="absolute -top-2 -right-2 flex items-center justify-center rounded-full text-[10px]"
              style={{ background: GOLD, color: INK, width: "16px", height: "16px", fontWeight: 600 }}
            >
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
