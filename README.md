# Veyra — E-Commerce Store (Restructured)

Clean separation of frontend and backend concerns.

---

## Project Structure

```
veyra-restructured/
│
├── frontend/                        ← React app (UI only)
│   ├── public/
│   ├── src/
│   │   ├── App.js                   ← Routes only, no logic
│   │   ├── styles/
│   │   │   ├── tokens.js            ← Design tokens (colours, fonts)
│   │   │   └── api.js               ← All HTTP calls live here
│   │   ├── context/
│   │   │   └── CartContext.js       ← Shared cart state (localStorage-backed)
│   │   ├── components/
│   │   │   ├── Avatar.jsx           ← SVG avatar, UI only
│   │   │   ├── BodyControls.jsx     ← Profile sliders/chips, UI only
│   │   │   ├── ProductLinkForm.jsx  ← Link inputs, UI only
│   │   │   ├── ContactForm.jsx      ← Contact / feedback form
│   │   │   └── StoreNav.jsx         ← Shared nav: search, profile, cart badge
│   │   └── e-commerce-store/
│   │       ├── Landingpage.js
│   │       ├── Authonboarding.js
│   │       ├── Homepage.js
│   │       ├── Category.js          ← Horizontal-scroll product rail
│   │       ├── Offers.js            ← NEW: discounted products
│   │       ├── Cart.js              ← NEW: view cart
│   │       ├── Payment.js           ← NEW: payment methods (UI only)
│   │       ├── Profile.js           ← NEW: user profile + color likes/dislikes
│   │       ├── Search.js            ← NEW: search results
│   │       ├── AdminPanel.js        ← NEW: restricted admin product manager
│   │       └── CheckDemo.jsx
│   ├── package.json
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
    ├── products/                    ← NEW: product catalog + stock CRUD
    │   ├── products.controller.js
    │   └── products.routes.js
    ├── admin/                       ← NEW: owner-only login & session tokens
    │   ├── admin.controller.js
    │   └── admin.routes.js
    ├── middleware/
    │   └── requireAdmin.js          ← NEW: protects product write routes
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

## Setup

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
npm install
npm start
# Runs on http://localhost:4000
```

Set `REACT_APP_API_URL=http://localhost:4000` in `frontend/.env` for local development.

---

## Key Decisions

- **`frontend/src/styles/api.js`** — all `fetch()` calls live here. JSX components never call `fetch()` directly.
- **`frontend/src/styles/tokens.js`** — single source of truth for colours and fonts.
- **`CheckDemo.jsx`** moved from `src/pages/` into `src/e-commerce-store/` to sit alongside the other store pages.
- **`ContactForm.jsx`** is a new lightweight form — no heavy validation, minimal tokens, free-tier safe.
- Backend controllers are stateless functions; the in-memory stores are clearly marked for Phase 2 DB replacement.
- **Admin Panel** (`/admin`): owner-only login (`POST /api/admin/login`). Default credentials are `owner` / `veyra-admin-2026` (override via `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars before going live). The issued session token is sent as the `x-admin-token` header on every product write request and is enforced server-side by `backend/middleware/requireAdmin.js` — changing the frontend alone cannot bypass it.
- **Stock**: auto-decrements via `POST /api/products/:id/sell` (called from the Payment page on checkout) and can be manually incremented/set by the admin via `PATCH /api/products/:id/stock`. Each product's `status` ("in stock" / "out of stock") is derived from its `stock` count, never stored separately, so it can never drift out of sync.
- **Cart** (`frontend/src/context/CartContext.js`): persisted to `localStorage`, shared across Category/Offers/Search/Cart/Payment pages via React Context.
- **Payment page** is UI-only by design (per spec) — Card / PayPal / Bank Transfer / Cash on Delivery are all selectable, but "Place order" only triggers the stock-decrement call; no real gateway is wired up yet.
- **Profile page** stores name/email + color likes & dislikes in `localStorage` (`veyra_profile`) — ready for Phase 2 personalised recommendations, not yet applied to product ordering.
