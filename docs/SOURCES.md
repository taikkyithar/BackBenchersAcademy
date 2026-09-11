# Where the textbooks come from (provenance)

Checked 2026-09-11. "Official" = operated by a Myanmar government education body.

| Source | Status | What it hosts | How we use it |
|---|---|---|---|
| **myanmarexam.org** (Dept. of Myanmar Examinations, official) | live | KG language/learning/teacher guides (3 PDFs at `resources.mmoe.myanmarexam.org`) | `crawler/sources/myanmarexam.py` |
| **mdep.moe.edu.mm/DBEBox** (MoE "Myanmar Digital Education Platform", official) | offline since ~2021 | 2020 "study at home" distribution of KG–11 textbooks + videos | provenance only; a few PDFs survive in the Wayback Machine |
| **derpt.moe.edu.mm** (MoE Dept. of Education Research, Planning & Training, official) | offline | 2020 textbook download page (`?page_id=11989`) referenced by press | provenance only |
| **createmm.org** (MoE + JICA CREATE project, official) | offline (DNS gone) | primary (KG–5) textbooks & teacher guides in Myanmar and English | provenance only |
| **edu4mm.com** "Education for Myanmar" | live | direct PDFs, KG–12, textbooks + teacher guides, incl. 2024 NUG-MoE Grade 10–12 editions | `sources/edu4mm.py` (preferred: direct links) |
| **learnbig.net** (LearnBig library, UNESCO-supported, Thailand-based) | live | direct PDFs, KG–11 textbooks incl. arts/PE/life-skills, some English translations | `sources/learnbig.py` |
| **mbsi.vercel.app** "Myanmar Book Hub" (community, by Ismail) | live | Google Drive copies, Grades 1–12 textbooks + *answer guides* + exam guides | `sources/bookhub.py` (only source for answer guides) |
| **be.moeedu.org** (NUG MoE Basic Education eLearning Center, Moodle) | live, login required | 140+ courses KG–12 | not crawled (login wall) |
| **mmteacherplatform.net** (UNESCO Myanmar Teacher Platform) | live | e-library of 200+ teacher resources, videos | candidate for teacher-guide videos, not yet crawled |
| Myanmar Tech Press 2020 articles | live | MediaFire mirrors of the 2020 MoE distribution | fallback only |

Sources that duplicate each other are merged in `catalog/catalog.json`; every alternate URL is kept under `files[]`.

## Curriculum background

* KG–Grade 12 "new curriculum" (သင်ရိုးသစ်) was rolled out one grade per year from 2016-17 (KG) to 2022-23 (Grade 12). Primary grades were developed with JICA (CREATE), middle school with ADB, and high school with the MoE curriculum committees.
* Since 2021 two ministries publish: the MoE in Naypyidaw and the NUG MoE. Grade 10–12 textbook editions differ slightly between them; the catalog tags `publisher` so lessons can reference either.
* Subject list per level: KG (Myanmar, English, Maths, Science, Social, Arts, PE), Grade 1–5 (Myanmar, English, Maths, Science, Social Studies, Morality & Civics, Life Skills, PE, Visual Arts, Performing Arts), Grade 6–9 (+ Geography, History, ICT), Grade 10–12 (Myanmar, English, Maths + electives: Physics, Chemistry, Biology, Economics, Geography, History, Optional Myanmar).

## File format note

Every textbook PDF checked so far is a **scan**: each page is one CMYK JPX/JPEG image at 150 dpi and the PDF has no fonts,
so there is no selectable/searchable text. Any text-based feature (search, chapter detection, read-aloud, translation)
needs OCR first — see the roadmap. Burmese OCR quality with Tesseract's `mya` model is usable for headings and chapter
titles; body text needs cleanup by volunteers.
