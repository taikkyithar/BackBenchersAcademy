# Contributing / ပါဝင်ကူညီရန်

**ရည်ရွယ်ချက်** — မြန်မာနိုင်ငံ သူငယ်တန်းမှ ၁၂ တန်းအထိ အမျိုးသားသင်ရိုးကို အခမဲ့၊ 3D immersive၊ video explainer ပုံစံဖြင့်
မည်သူမဆို သင်ယူနိုင်ရန်။ ကုဒ်ရေးသူ၊ ဆရာ/ဆရာမ၊ ဘာသာပြန်သူ၊ 3D artist၊ video editor၊ ကျောင်းသား — အားလုံး လိုအပ်ပါသည်။

## Ways to help (no coding needed for most)

| Role | What to do | Where |
|---|---|---|
| Teacher / subject expert | Check the catalog is correct (right grade, subject, curriculum). Write lesson outlines for a chapter. | `catalog/COVERAGE.md`, `content/` |
| Translator | Burmese ↔ English UI strings and lesson text. Unicode only (no Zawgyi). | `web/src/i18n/` |
| 3D / motion | Build a scene for a lesson (glTF, ≤ 2 MB, mobile-friendly). | `content/<grade>/<subject>/<lesson>/scene.glb` |
| Video | Record a 3–8 minute explainer in Burmese for a lesson; upload to a public host; add the link to the lesson JSON. | `content/…/lesson.json` |
| Developer | Crawler sources, normalizer rules, PDF text extraction, web app, offline/PWA, low-end device performance. | `crawler/`, `web/` |

## Ground rules

1. **Unicode Burmese only.** Zawgyi files are converted before merge.
2. **Textbooks are MoE copyright** — never commit PDFs; commit catalog entries and hashes instead (see `CONTENT-LICENSE.md`).
3. **Mobile first, offline first.** Assume a 2 GB RAM Android phone on a slow connection. 3D scenes must have a 2D fallback.
4. **Lessons follow the national curriculum order** (grade → subject → chapter) so students can use them alongside school.
5. Be kind. Politics stay out of lesson content; the goal is that every child can learn regardless of who runs their school.

## Dev setup

```bash
python3 -m crawler index      # ~3 min, crawls the public sources → catalog/raw/*.json
python3 -m crawler catalog    # → catalog/catalog.json, catalog.csv, COVERAGE.md
python3 -m crawler download --budget-gb 2
cd web && npm install && npm run dev
```

Python needs no third-party packages. `pdfinfo`/`pdftotext` (poppler) are optional but recommended for page counts and text extraction.

## Adding a source

Create `crawler/sources/<name>.py` with an `index()` returning items in the raw schema documented in
`crawler/sources/__init__.py`, register it in `SOURCES`, and add provenance notes to `docs/SOURCES.md`.

## Pull requests

Small, focused PRs. Run `python3 -m crawler catalog` if you touched `normalize.py` and commit the regenerated
`catalog/` files. CI checks that the catalog builds and the web app compiles.
