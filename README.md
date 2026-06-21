# Veyra — E-Commerce Store

Clean separation of frontend and backend concerns.

---

## ⚠️ How to Run (read this first)

This is **two separate Node projects** in one folder — `frontend/` and `backend/`.
Each needs its own `npm install` and its own terminal, and you must `cd` into
that exact folder first. Running `npm start` from the top-level `e-commerce`
folder will fail (`Could not find index.html`) because that folder has no
React app of its own.

**Terminal 1 — backend (run this first):**
```bash
cd backend
npm install
npm start
# → http://localhost:4000
```

**Terminal 2 — frontend:**
```bash
cd frontend
npm install
npm start
# → http://localhost:3000 (opens automatically)
```

`frontend/package.json` already has `"proxy": "http://localhost:4000"` set,
so the frontend automatically forwards API calls to the backend — no `.env`
file needed for local development.

---

## Project Structure

```
E-commerce-store-main/
│
├── frontend/                        ← React app (UI only)
│   ├── public/                      ← CRA default — index.html, icons, manifest
│   ├── src/
│   │   ├── App.js                   ← Routes only, no logic
│   │   ├── index.js, index.css      ← CRA default entry point
│   │   ├── App.css, App.test.js,
│   │   │   reportWebVitals.js,
│   │   │   logo.svg, setupTests.js  ← CRA default files, left as-is
│   │   │
│   │   ├── components/              ← Reusable UI pieces
│   │   │   ├── Avatar.jsx
│   │   │   ├── BodyControls.jsx
│   │   │   ├── ProductLinkForm.jsx
│   │   │   ├── ContactForm.jsx
│   │   │   └── StoreNav.jsx         ← Shared nav: search, profile, cart badge
│   │   │
│   │   ├── context/                 ← Global state
│   │   │   └── CartContext.js       ← Shared cart, localStorage-backed
│   │   │
│   │   ├── e-commerce-store/        ← Page-level screens
│   │   │   ├── Landingpage.js
│   │   │   ├── Authonboarding.js
│   │   │   ├── Homepage.js
│   │   │   ├── Category.js          ← Horizontal-scroll product rail
│   │   │   ├── Offers.js            ← Discounted products
│   │   │   ├── Cart.js              ← View cart
│   │   │   ├── Payment.js           ← Payment methods (UI only)
│   │   │   ├── Profile.js           ← User profile + color likes/dislikes
│   │   │   ├── Search.js            ← Search results
│   │   │   ├── AdminPanel.js        ← Restricted admin product manager
│   │   │   └── CheckDemo.jsx
│   │   │
│   │   ├── styles/                  ← Pure styling — no logic
│   │   │   └── tokens.js            ← Colours, fonts, design tokens
│   │   │
│   │   ├── logic/                   ← All app logic — no styling
│   │   │   └── api.js               ← Every fetch() call lives here
│   │   │
│   │   └── assets/
│   │       └── images/              ← Drop local product images here
│   │                                  (currently using external URLs)
│   ├── package.json                 ← Has "proxy": "http://localhost:4000"
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── backend/                         ← Express API (logic only)
    ├── server.js                    ← Entry point, mounts all routes
    ├── package.json
    ├── contact.controller.js        ← Contact form handler
    ├── home/
    │   ├── home.controller.js
    │   └── home.routes.js
    ├── landing/
    │   ├── landing.controller.js
    │   └── landing.routes.js
    ├── auth/
    │   ├── auth.controller.js
    │   └── auth.routes.js
    ├── products/                    ← Product catalog + stock CRUD
    │   ├── products.controller.js
    │   └── products.routes.js
    ├── admin/                       ← Owner-only login & session tokens
    │   ├── admin.controller.js
    │   └── admin.routes.js
    ├── middleware/
    │   └── requireAdmin.js          ← Protects product write routes
    ├── styles/
    │   └── styles.config.js         ← Backend style/config constants
    └── demo/
        ├── demo.controller.js
        └── demo.routes.js
```

---

## API Routes

| Method | Path                          | Description                       |
|--------|-------------------------------|-----------------------------------|
| GET    | /api/home/categories          | Product categories list           |
| GET    | /api/home/featured            | Featured products                 |
| GET    | /api/landing/info             | Store name & tagline              |
| POST   | /api/landing/cta-click        | Track CTA click events            |
| POST   | /api/auth/signup              | Create account + preferences      |
| POST   | /api/auth/login               | Login                             |
| GET    | /api/auth/preferences/:email  | Get user style preferences        |
| POST   | /api/demo/save-links          | Save product links to session     |
| POST   | /api/demo/save-user-features  | Save body profile to session      |
| GET    | /api/demo/demo-preview        | Get session + style advice        |
| POST   | /api/contact/submit           | Submit contact / feedback form    |
| GET    | /api/products                 | List products (?category, ?search, ?onSale) |
| GET    | /api/products/:id             | Get one product                   |
| POST   | /api/products/:id/sell        | Auto-decrement stock on sale      |
| POST   | /api/products                 | **Admin:** create product         |
| PUT    | /api/products/:id             | **Admin:** edit product           |
| DELETE | /api/products/:id             | **Admin:** delete product         |
| PATCH  | /api/products/:id/stock       | **Admin:** manually adjust stock  |
| POST   | /api/admin/login              | Owner login → session token       |
| POST   | /api/admin/logout             | Invalidate session token          |
| GET    | /api/admin/verify             | Check if a stored token is valid  |

---

## Key Decisions

- **`frontend/src/logic/api.js`** — all `fetch()` calls live here. JSX components never call `fetch()` directly. Kept separate from `styles/` so logic and presentation never mix.
- **`frontend/src/styles/tokens.js`** — single source of truth for colours and fonts; contains no logic.
- **`frontend/src/assets/images/`** — reserved for local product photos. Pages currently load images from external Unsplash URLs; swap to local files here whenever you're ready (see the README inside that folder).
- **No `package.json` at the project root** — only `frontend/package.json` and `backend/package.json` exist, since this is two separate Node apps, not one. (An earlier duplicate root `package.json` was the cause of the `Could not find index.html` error — it made `npm start` from the top-level folder run as if it were the React app itself. It's been removed.)
- **`backend/controllers/` and `backend/routes/`** (old, unused duplicates of `backend/demo/`) have been removed — `server.js` only ever loaded the `demo/` versions.
- **`CheckDemo.jsx`** sits in `src/e-commerce-store/` alongside the other store pages.
- **`ContactForm.jsx`** is a lightweight form — no heavy validation, minimal tokens, free-tier safe.
- Backend controllers are stateless functions; the in-memory stores are clearly marked for Phase 2 DB replacement.
- **Admin Panel** (`/admin`): owner-only login (`POST /api/admin/login`). Default credentials are `owner` / `veyra-admin-2026` (override via `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars before going live). The issued session token is sent as the `x-admin-token` header on every product write request and is enforced server-side by `backend/middleware/requireAdmin.js` — changing the frontend alone cannot bypass it.
- **Stock**: auto-decrements via `POST /api/products/:id/sell` (called from the Payment page on checkout) and can be manually incremented/set by the admin via `PATCH /api/products/:id/stock`. Each product's `status` ("in stock" / "out of stock") is derived from its `stock` count, never stored separately, so it can never drift out of sync.
- **Cart** (`frontend/src/context/CartContext.js`): persisted to `localStorage`, shared across Category/Offers/Search/Cart/Payment pages via React Context.
- **Payment page** is UI-only by design (per spec) — Card / PayPal / Bank Transfer / Cash on Delivery are all selectable, but "Place order" only triggers the stock-decrement call; no real gateway is wired up yet.
- **Profile page** stores name/email + color likes & dislikes in `localStorage` (`veyra_profile`) — ready for Phase 2 personalised recommendations, not yet applied to product ordering.
