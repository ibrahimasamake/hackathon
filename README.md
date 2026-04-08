# Local Farmers Digital Platform

Production-minded hackathon MVP for a farmer-to-buyer marketplace with a mobile-first PWA frontend and a secure Spring Boot backend.

## Stack
- Frontend: Angular 21, Tailwind CSS v4, PWA (service worker + manifest)
- Backend: Spring Boot 3, Java 21, Spring Security, JWT auth
- Database: PostgreSQL + Flyway migrations
- Storage: Cloudflare R2 (Sougba-compatible env keys; direct multipart upload + presigned flow support)

## Repository Layout
```txt
.
├── apps/backend
├── docs
├── infra
├── public
├── src
└── .env.example
```

## Quick Start
1. Start PostgreSQL:
```bash
npm run db:up
```
2. Copy env values from `.env.example`.
3. Run backend:
```bash
npm run backend:start
```
4. Run frontend:
```bash
npm start
```

## API Overview
Key modules:
- `/api/auth/*`
- `/api/farmers/*`
- `/api/products/*`
- `/api/orders/*`
- `/api/storage/product-image/*`
- `/api/admin/*`

Full list: `docs/api.md`.

## Demo Accounts
- `admin@farmers.local`
- `farmer@demo.com`
- `buyer@demo.com`

Passwords are seeded in Flyway migrations and should be rotated before production usage.

## PWA Notes
- Manifest: `public/manifest.webmanifest`
- Service worker config: `ngsw-config.json`
- Icons: `public/icons`

## Docs
- `docs/architecture.md`
- `docs/frontend-structure.md`
- `docs/backend-structure.md`
- `docs/r2-upload-flow.md`
- `docs/pwa-strategy.md`
- `docs/ai-flow.md`
- `docs/multilingual-strategy.md`
# hackathon
