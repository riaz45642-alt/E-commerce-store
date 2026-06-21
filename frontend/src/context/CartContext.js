/**
 * CartContext.js — Veyra shopping cart state
 * Persists to localStorage so the cart survives page reloads / navigation.
 * Phase 2: sync with a server-side cart once user accounts are backed by a DB.
 */

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "veyra_cart";

function lineKey(item) {
  return `${item.id}__${item.color || ""}__${item.size || ""}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, { qty = 1, color = "", size = "" } = {}) => {
    setItems((prev) => {
      const key = lineKey({ id: product.id, color, size });
      const existing = prev.find((i) => lineKey(i) === key);
      if (existing) {
        return prev.map((i) => (lineKey(i) === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          discount: product.discount || 0,
          img: product.img,
          color,
          size,
          qty,
        },
      ];
    });
  };

  const removeItem = (id, color, size) => {
    setItems((prev) => prev.filter((i) => lineKey(i) !== lineKey({ id, color, size })));
  };

  const updateQty = (id, color, size, qty) => {
    setItems((prev) =>
      prev
        .map((i) => (lineKey(i) === lineKey({ id, color, size }) ? { ...i, qty: Math.max(1, qty) } : i))
    );
  };

  const clearCart = () => setItems([]);

  const lineTotal = (item) => {
    const unit = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
    return unit * item.qty;
  };

  const subtotal = items.reduce((sum, i) => sum + lineTotal(i), 0);
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, lineTotal, subtotal, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
