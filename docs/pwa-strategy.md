# PWA Strategy

## Installability
- `public/manifest.webmanifest`
- App icons in `public/icons`
- Theme color and manifest linked in `src/index.html`

## Service Worker
- Angular service worker enabled in `app.config.ts`
- `ngsw-config.json` caches app shell and key assets
- API data group for public product pages

## Offline UX
- Cached shell + assets enable startup offline
- Marketplace responses cached with freshness strategy
- `public/offline.html` available for network fallback extension
