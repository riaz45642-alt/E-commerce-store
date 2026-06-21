/**
 * products.controller.js — Veyra Product Catalog Backend Logic
 * Handles product CRUD, stock management, and offer/discount lookups.
 *
 * Phase 1: In-memory store (resets on restart).
 * Phase 2: Replace productStore with a real database (PostgreSQL / MongoDB).
 */

let nextId = 9;

// In-memory product store — Phase 2: replace with DB
let productStore = [
  { id: 1, name: "Wool Overcoat", category: "Clothes", price: 248, discount: 0, colors: ["Ink", "Sand"], sizes: ["S", "M", "L"], stock: 12, img: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&q=80" },
  { id: 2, name: "Linen Shirt", category: "Clothes", price: 86, discount: 15, colors: ["Porcelain", "Sage"], sizes: ["S", "M", "L", "XL"], stock: 20, img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80" },
  { id: 3, name: "Tailored Trousers", category: "Clothes", price: 132, discount: 0, colors: ["Ink", "Slate"], sizes: ["30", "32", "34"], stock: 0, img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80" },
  { id: 4, name: "Cashmere Sweater", category: "Clothes", price: 195, discount: 10, colors: ["Wine", "Sand"], sizes: ["S", "M", "L"], stock: 8, img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80" },
  { id: 5, name: "Suede Loafers", category: "Shoes", price: 168, discount: 0, colors: ["Rust", "Ink"], sizes: ["7", "8", "9", "10"], stock: 14, img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80" },
  { id: 6, name: "Running Sneakers", category: "Shoes", price: 118, discount: 20, colors: ["Porcelain", "Slate"], sizes: ["7", "8", "9", "10", "11"], stock: 25, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80" },
  { id: 7, name: "Leather Tote", category: "Bags", price: 226, discount: 0, colors: ["Ink", "Rust"], sizes: ["One Size"], stock: 6, img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80" },
  { id: 8, name: "Minimalist Watch", category: "Watches", price: 174, discount: 12, colors: ["Gold", "Slate"], sizes: ["One Size"], stock: 0, img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&q=80" },
];

const withStatus = (p) => ({ ...p, status: p.stock > 0 ? "in stock" : "out of stock" });

/**
 * GET /api/products
 * Query params: category, search, onSale
 */
exports.getAll = (req, res) => {
  try {
    const { category, search, onSale } = req.query;
    let results = productStore;
    if (category && category.toLowerCase() !== "all") {
      results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (onSale === "true") {
      results = results.filter((p) => p.discount > 0);
    }
    return res.json({ success: true, data: results.map(withStatus) });
  } catch (err) {
    console.error("getAll products error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};

/**
 * GET /api/products/:id
 */
exports.getOne = (req, res) => {
  const product = productStore.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found." });
  return res.json({ success: true, data: withStatus(product) });
};

/**
 * POST /api/products  (admin only)
 * Body: { name, category, price, discount, colors[], sizes[], stock }
 */
exports.create = (req, res) => {
  try {
    const { name, category, price, discount, colors, sizes, stock, img } = req.body;
    if (!name || !category || price === undefined) {
      return res.status(400).json({ error: "name, category, and price are required." });
    }
    const product = {
      id: nextId++,
      name: String(name).trim().substring(0, 120),
      category: String(category).trim(),
      price: Number(price) || 0,
      discount: Number(discount) || 0,
      colors: Array.isArray(colors) ? colors : [],
      sizes: Array.isArray(sizes) ? sizes : [],
      stock: Number(stock) || 0,
      img: img || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80",
    };
    productStore.push(product);
    return res.status(201).json({ success: true, data: withStatus(product) });
  } catch (err) {
    console.error("create product error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};

/**
 * PUT /api/products/:id  (admin only)
 */
exports.update = (req, res) => {
  try {
    const idx = productStore.findIndex((p) => p.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Product not found." });

    const { name, category, price, discount, colors, sizes, stock, img } = req.body;
    const existing = productStore[idx];
    productStore[idx] = {
      ...existing,
      name: name !== undefined ? String(name).trim().substring(0, 120) : existing.name,
      category: category !== undefined ? String(category).trim() : existing.category,
      price: price !== undefined ? Number(price) || 0 : existing.price,
      discount: discount !== undefined ? Number(discount) || 0 : existing.discount,
      colors: Array.isArray(colors) ? colors : existing.colors,
      sizes: Array.isArray(sizes) ? sizes : existing.sizes,
      stock: stock !== undefined ? Number(stock) || 0 : existing.stock,
      img: img || existing.img,
    };
    return res.json({ success: true, data: withStatus(productStore[idx]) });
  } catch (err) {
    console.error("update product error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};

/**
 * DELETE /api/products/:id  (admin only)
 */
exports.remove = (req, res) => {
  const idx = productStore.findIndex((p) => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Product not found." });
  productStore.splice(idx, 1);
  return res.json({ success: true });
};

/**
 * PATCH /api/products/:id/stock  (admin only)
 * Body: { mode: "increment" | "set", amount }
 * Lets the admin manually top up or correct stock counts.
 */
exports.adjustStock = (req, res) => {
  try {
    const product = productStore.find((p) => p.id === Number(req.params.id));
    if (!product) return res.status(404).json({ error: "Product not found." });

    const { mode, amount } = req.body;
    const amt = Number(amount);
    if (Number.isNaN(amt)) return res.status(400).json({ error: "amount must be a number." });

    if (mode === "set") {
      product.stock = Math.max(0, amt);
    } else {
      product.stock = Math.max(0, product.stock + amt);
    }
    return res.json({ success: true, data: withStatus(product) });
  } catch (err) {
    console.error("adjustStock error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};

/**
 * POST /api/products/:id/sell  (public — called when a sale/checkout happens)
 * Body: { quantity }
 * Auto-decrements stock. Rejects if insufficient stock.
 */
exports.sell = (req, res) => {
  try {
    const product = productStore.find((p) => p.id === Number(req.params.id));
    if (!product) return res.status(404).json({ error: "Product not found." });

    const qty = Number(req.body.quantity) || 1;
    if (product.stock < qty) {
      return res.status(409).json({ error: `Only ${product.stock} unit(s) left in stock.` });
    }
    product.stock -= qty;
    return res.json({ success: true, data: withStatus(product) });
  } catch (err) {
    console.error("sell error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};
