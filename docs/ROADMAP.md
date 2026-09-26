# Roadmap

## Phase 0 — Corpus (now)
- [x] Find every live public source of the KG–12 textbooks (4 live, 3 official sites offline — see SOURCES.md)
- [x] Crawler + normalizer + deduplicated catalog with alternates (307 books)
- [ ] Download the full preferred set (~8 GB) on a machine with space; publish `data/manifest.json` hashes
- [ ] Human review of the 26 `needs_review` entries (editions vs volumes), fill missing subjects (G8–9 arts/PE/life-skills, G11–12 geography/history teacher guides)
- [ ] Mirror the corpus somewhere with CORS + range requests (Internet Archive item or Cloudflare R2) so the in-app reader works everywhere
- [ ] **OCR pipeline** — the MoE PDFs are pure image scans (JPX/JPEG pages, no fonts, `pdftotext` returns nothing). Use Tesseract `mya` (+`eng`) via `ocrmypdf` to add a text layer, then extract per-chapter text + table of contents for every book (feeds lesson authoring, search, and `textbook_ref.chapter` in lessons)
- [ ] Mobile-optimized editions: re-encode scans (150 dpi JPX → ~100 dpi JPEG/MRC) so a Grade 10 textbook is ~5 MB instead of 20–350 MB

## Phase 1 — Web platform MVP
- [x] Vite + React + R3F scaffold, Burmese/English UI, 3D campus → grade → subject → book
- [x] PDF reader (pdf.js) with fallback to original link
- [x] Lesson player: text · 3D scene · video · quiz, progress in localStorage
- [x] PWA offline shell
- [x] Search (chapter titles, Burmese)
- [ ] Downloadable "grade packs" for offline use (service worker + storage estimate)
- [ ] Low-end profiling: 2 GB RAM Android, 3G; target < 1.5 MB first load without 3D
- [ ] Deploy to GitHub Pages / Cloudflare Pages

## Phase 2 — Content at scale
- [ ] Lesson authoring template + review workflow (teacher review → merge)
- [ ] 1 lesson per chapter for Grade 5 Science and Grade 10 Physics/Chemistry/Biology (pilot)
- [ ] Video explainers in Burmese (3–8 min), hosted on YouTube/PeerTube, embedded by ID
- [ ] Reusable 3D scene library (procedural first: atoms, solar system, cells, waves, geometry solids, circuits)
- [ ] Reading-along mode for KG–G3 (audio + highlighted text)
- [ ] Ethnic-language subtitles (Karen, Shan, Kachin, Mon, Rakhine, Chin) via community translation

## Phase 3 — Reach
- [ ] Android wrapper (TWA) for Play Store / APK distribution via Telegram
- [ ] SMS/USSD-free zero-rating partnerships with operators
- [ ] Teacher dashboard (offline-first, no personal data)
- [ ] Accessibility: screen reader for Burmese, dyslexia-friendly font option
