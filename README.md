# CareerPilot — Frontend

React 19 + Vite + Tailwind v4 single-page app for CareerPilot.

## Run locally

```bash
cp .env.example .env    # set VITE_API_URL, e.g. http://localhost:5000
npm install
npm run dev
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | production build |
| `npm run preview` | serve the built app |
| `npm run lint` | oxlint |

## Environment

`VITE_API_URL` is the only variable. It is public (compiled into the bundle), so it must never hold a secret. A production build **throws** if it is missing rather than silently calling localhost.

## Structure

```
src/
  App.jsx          routes, ToastProvider, skip link
  index.css        "Ink & Signal" OKLCH theme tokens
  components/      design-system + app components
  hooks/           useApi, useDocumentTitle
  lib/             api client, auth, toast context
  pages/           one screen per route
```

## Behaviour worth knowing

- All HTTP goes through `src/lib/api.js`: Bearer header, 60s timeout, and a 401 clears the session and redirects to `/login?next=<path>`.
- `ProtectedRoute` decodes the JWT and checks `exp`; the backend is still the real gate.
- Jobs filters live in the URL, so refresh and back keep them.
- Type is opt-in motion: everything is gated behind `prefers-reduced-motion`.

## Deploy

Vercel, framework Vite, `vercel.json` rewrites every path to `index.html`. Set `VITE_API_URL` for Production and Preview.
