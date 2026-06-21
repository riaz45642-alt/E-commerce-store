/**
 * Payment.js — Veyra Payment Methods Page (UI only)
 * Presents Card / PayPal / Bank Transfer / Cash on Delivery flows.
 * No real payment processing — "Place order" simulates a sale by calling
 * the stock-decrement endpoint for each cart line, per spec §1 (auto stock
 * decrement on sale). Real gateway integration is a Phase 2 task.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Landmark, Wallet, Truck, Check } from "lucide-react";
import StoreNav from "../components/StoreNav";
import { useCart } from "../context/CartContext";
import { productsApi } from "../styles/api";

const INK = "#0B0B0E";
const PORCELAIN = "#F3EFE6";
const GOLD = "#C9A227";

const METHODS = [
  { key: "card", label: "Card", icon: CreditCard },
  { key: "paypal", label: "PayPal", icon: Wallet },
  { key: "bank", label: "Bank transfer", icon: Landmark },
  { key: "cod", label: "Cash on delivery", icon: Truck },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [method, setMethod] = useState("card");
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(false);
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });

  const placeOrder = async () => {
    setPlacing(true);
    // Auto-decrement stock for each line — backend logic, gateway TBD.
    await Promise.all(items.map((i) => productsApi.sell(i.id, i.qty).catch(() => null)));
    setPlacing(false);
    setDone(true);
    clearCart();
  };

  if (done) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6" style={{ background: INK, fontFamily: "Inter, sans-serif" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: "rgba(201,162,39,0.12)", border: `1px solid ${GOLD}` }}>
          <Check size={26} style={{ color: GOLD }} />
        </div>
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "1.8rem", color: PORCELAIN }}>Order placed</h1>
        <p className="text-sm mt-2 max-w-sm" style={{ color: "rgba(243,239,230,0.5)" }}>
          Thank you — your order has been received. Payment processing for {METHODS.find((m) => m.key === method)?.label.toLowerCase()} will be finalised once backend integration is connected.
        </p>
        <button onClick={() => navigate("/home")} className="mt-8 rounded-full px-6 py-2.5 text-sm uppercase tracking-widest" style={{ background: GOLD, color: INK }}>
          Back to shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full" style={{ background: INK, fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Inter:wght@400;500&display=swap');
        input.field { background: transparent; border: none; border-bottom: 1px solid rgba(243,239,230,0.25); color: ${PORCELAIN}; padding: 10px 2px; font-size: 0.9rem; outline: none; width: 100%; }
        input.field:focus { border-bottom-color: ${GOLD}; }
        input.field::placeholder { color: rgba(243,239,230,0.35); }
      `}</style>

      <StoreNav onBack={() => navigate("/cart")} showSearch={false} />

      <header className="px-6 md:px-14 pt-2 pb-8">
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(1.8rem, 4vw, 2.4rem)", color: PORCELAIN }}>Payment</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(243,239,230,0.45)" }}>UI preview — gateway integration coming soon.</p>
      </header>

      <main className="px-6 md:px-14 pb-24 flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <div className="flex gap-3 flex-wrap mb-8">
            {METHODS.map((m) => {
              const Icon = m.icon;
              const active = method === m.key;
              return (
                <button
                  key={m.key}
                  onClick={() => setMethod(m.key)}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
                  style={{
                    border: `1px solid ${active ? GOLD : "rgba(243,239,230,0.15)"}`,
                    background: active ? "rgba(201,162,39,0.1)" : "transparent",
                    color: active ? GOLD : PORCELAIN,
                  }}
                >
                  <Icon size={16} /> {m.label}
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {method === "card" && (
              <div className="flex flex-col gap-1">
                <input className="field" placeholder="Card number" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} />
                <input className="field" placeholder="Name on card" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
                <div className="flex gap-4 mt-1">
                  <input className="field" placeholder="MM / YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} />
                  <input className="field" placeholder="CVC" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} />
                </div>
              </div>
            )}
            {method === "paypal" && (
              <p className="text-sm" style={{ color: "rgba(243,239,230,0.6)" }}>
                You'll be redirected to PayPal to complete your payment securely once integration is live.
              </p>
            )}
            {method === "bank" && (
              <div className="text-sm leading-7" style={{ color: "rgba(243,239,230,0.6)" }}>
                <p>Bank: Veyra Holdings Ltd.</p>
                <p>Account: 0021 4456 7789</p>
                <p>Reference: your order number (shown after placing order)</p>
              </div>
            )}
            {method === "cod" && (
              <p className="text-sm" style={{ color: "rgba(243,239,230,0.6)" }}>
                Pay in cash when your order arrives. A small handling fee may apply at checkout.
              </p>
            )}
          </div>
        </div>

        <div className="w-full lg:w-80 shrink-0">
          <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "1.2rem", color: PORCELAIN }}>Order total</h2>
            <div className="flex justify-between mt-4 text-sm" style={{ color: "rgba(243,239,230,0.6)" }}>
              <span>{items.length} item{items.length !== 1 ? "s" : ""}</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={placeOrder}
              disabled={placing || items.length === 0}
              className="w-full mt-6 rounded-full py-3 text-sm uppercase tracking-widest"
              style={{ background: GOLD, color: INK, opacity: placing || items.length === 0 ? 0.5 : 1 }}
            >
              {placing ? "Placing order..." : "Place order"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
