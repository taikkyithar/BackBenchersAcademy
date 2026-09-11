# web/ — the learning site

Vite + React 19 + TypeScript + react-three-fiber. Static, offline-first PWA, hash routing (works on GitHub Pages).

```bash
npm install --legacy-peer-deps     # R3F declares optional expo peers that npm otherwise refuses
npm run dev                        # runs scripts/sync-catalog.mjs first, then vite on :5173
npm run build                      # → dist/
```

* `src/i18n.ts` — Burmese/English strings, settings store (language, 3D on/off; 3D auto-off on ≤2 GB devices / no WebGL)
* `src/data/` — catalog types/loader (`public/data/*.json`, generated), curriculum labels/colors
* `src/pages/` — Home (3D campus), Grade (3D bookshelf), Subject (books + lessons), Reader (pdf.js), Lesson (player)
* `src/scenes/` — procedural 3D scenes usable from lesson JSON: `atom`, `solar`, `pendulum` (+ Campus, Bookshelf)
* In dev, `/proxy/<host>/…` forwards to the textbook hosts so pdf.js can read them (they send no CORS headers).
  In production set `VITE_PDF_PROXY` to a deployed `scripts/pdf-proxy-worker.js`.
