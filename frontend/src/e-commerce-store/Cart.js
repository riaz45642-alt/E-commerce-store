/**
 * Cart.js — Veyra Cart Page
 * Full view-cart experience: adjust quantity, remove items, see subtotal,
 * proceed to payment.
 */

import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import StoreNav from "../components/StoreNav";
import { useCart } from "../context/CartContext";

const INK = "#0B0B0E";
const PORCELAIN = "#F3EFE6";
const GOLD = "#C9A227";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQty, lineTotal, subtotal } = useCart();

  return (
    <div className="min-h-screen w-full" style={{ background: INK, fontFamily: "Inter, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Inter:wght@400;500&display=swap');`}</style>

      <StoreNav onBack={() => navigate("/home")} showSearch={false} />

      <header className="px-6 md:px-14 pt-2 pb-8">
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(1.8rem, 4vw, 2.4rem)", color: PORCELAIN }}>Your cart</h1>
      </header>

      <main className="px-6 md:px-14 pb-24">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag size={36} style={{ color: "rgba(243,239,230,0.3)" }} />
            <p className="mt-4 text-sm" style={{ color: "rgba(243,239,230,0.5)" }}>Your cart is empty.</p>
            <button
              onClick={() => navigate("/home")}
              className="mt-6 rounded-full px-6 py-2.5 text-sm uppercase tracking-widest"
              style={{ border: "1px solid rgba(201,162,39,0.5)", color: PORCELAIN }}
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 flex flex-col gap-5">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.color}-${item.size}`}
                  className="flex gap-4 items-center pb-5"
                  style={{ borderBottom: "1px solid rgba(243,239,230,0.08)" }}
                >
                  <img src={item.img} alt={item.name} className="w-20 h-24 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p style={{ color: PORCELAIN, fontSize: "0.95rem" }}>{item.name}</p>
                    <p className="text-xs mt-1" style={{ color: "rgba(243,239,230,0.45)" }}>
                      {[item.color, item.size].filter(Boolean).join(" / ")}
                    </p>
                    <p className="text-sm mt-2" style={{ color: GOLD }}>${(lineTotal(item) / item.qty).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3 rounded-full px-2 py-1" style={{ border: "1px solid rgba(243,239,230,0.15)" }}>
                    <button onClick={() => updateQty(item.id, item.color, item.size, item.qty - 1)} disabled={item.qty <= 1} style={{ color: PORCELAIN, opacity: item.qty <= 1 ? 0.3 : 1 }}>
                      <Minus size={14} />
                    </button>
                    <span className="text-sm w-4 text-center" style={{ color: PORCELAIN }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.color, item.size, item.qty + 1)} style={{ color: PORCELAIN }}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id, item.color, item.size)} style={{ color: "rgba(243,239,230,0.4)" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-80 shrink-0">
              <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "1.2rem", color: PORCELAIN }}>Order summary</h2>
                <div className="flex justify-between mt-5 text-sm" style={{ color: "rgba(243,239,230,0.6)" }}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-2 text-sm" style={{ color: "rgba(243,239,230,0.6)" }}>
                  <span>Shipping</span>
                  <span>Calculated at next step</span>
                </div>
                <div className="flex justify-between mt-4 pt-4 text-base" style={{ color: PORCELAIN, borderTop: "1px solid rgba(243,239,230,0.1)" }}>
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => navigate("/payment")}
                  className="w-full mt-6 rounded-full py-3 text-sm uppercase tracking-widest"
                  style={{ background: GOLD, color: INK }}
                >
                  Proceed to payment
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
