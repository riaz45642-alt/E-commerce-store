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
│   │   ├── components/
│   │   │   ├── Avatar.jsx           ← SVG avatar, UI only
│   │   │   ├── BodyControls.jsx     ← Profile sliders/chips, UI only
│   │   │   ├── ProductLinkForm.jsx  ← Link inputs, UI only
│   │   │   └── ContactForm.jsx      ← NEW: contact / feedback form
│   │   └── e-commerce-store/
│   │       ├── Landingpage.js
│   │       ├── Authonboarding.js
│   │       ├── Homepage.js
│   │       ├── Category.js
│   │       └── CheckDemo.jsx        ← Moved here from /pages
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── backend/                         ← Express API (logic only)
    ├── server.js                    ← Entry point, mounts all routes
    ├── package.json
    ├── contact.controller.js        ← NEW: contact form handler
    ├── home/
    │   ├── home.controller.js
    │   └── home.routes.js
    ├── landing/
    │   ├── landing.controller.js
    │   └── landing.routes.js
    ├── auth/
    │   ├── auth.controller.js
    │   └── auth.routes.js
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
