# StreeSure Phase 9 — Local Integration & Smoke Testing

Phase 9 intentionally does **not** deploy StreeSure. It makes the application easier to run and verify end-to-end on a local machine.

## Run locally

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## Verify the backend

In a second terminal:

```bash
npm run smoke
```

The smoke test checks:

- `/api/health` is reachable
- `/api/system/status` reports a storage provider
- protected profile routes reject unauthenticated requests
- local demo authentication creates a server session

## Full static check

```bash
npm run check
```

This runs TypeScript checking followed by the Vite + Express production build.

## Local demo authentication

The evaluator buttons now use `/api/auth/demo-login` and receive a real HttpOnly session cookie. Demo login is automatically disabled when `NODE_ENV=production`.

## Important

Phase 9 is a local integration milestone, not a clinical validation milestone. Do not use real patient health information in the local JSON development database.
