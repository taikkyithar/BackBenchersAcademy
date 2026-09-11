# content/ — lessons (CC BY 4.0)

One folder per lesson: `content/<grade>/<subject>/<slug>/lesson.json` (+ optional `scene.glb`, images).
`grade` is `KG` or `1`…`12`; `subject` is a catalog subject id (see `crawler/normalize.py` SUBJECT_RULES).
Text fields are bilingual objects `{ "my": "…", "en": "…" }`. Burmese must be Unicode.

```jsonc
{
  "id": "g10-chemistry-atomic-structure",          // unique, url-safe
  "grade": "10", "subject": "chemistry",
  "title": { "my": "…", "en": "…" },
  "summary": { "my": "…", "en": "…" },
  "duration_min": 12,
  "textbook_ref": { "catalog_id": "g10-chemistry-textbook-p1", "chapter": "1", "pages": "1-18" }, // catalog id from catalog/catalog.json
  "steps": [
    { "type": "text",  "title": {…}, "body": {…} },
    { "type": "video", "title": {…}, "url": "https://www.youtube.com/watch?v=…", "provider": "youtube" },   // url null = "video wanted"
    { "type": "scene", "title": {…}, "scene": "atom", "params": { "element": "C" }, "narration": {…} },   // scenes: atom · solar · pendulum (web/src/scenes)
    { "type": "quiz",  "question": {…}, "choices": [{…}, {…}], "answer": 1, "explain": {…} }
  ],
  "contributors": ["your name or handle"],
  "license": "CC-BY-4.0"
}
```

Rules: follow the textbook's order and terminology; keep each step short (a phone screen); every 3D scene needs a
narration so the lesson still works in 2D mode; quizzes have exactly one correct answer.
Run `node scripts/sync-catalog.mjs` to validate (it fails on missing fields) and `cd web && npm run dev` to preview.
