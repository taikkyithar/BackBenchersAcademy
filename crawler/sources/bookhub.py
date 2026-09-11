"""mbsi.vercel.app — 'Myanmar Book Hub' (community site by Ismail). Next.js pages that server-render
Google Drive download links for each grade. Files live on Google Drive (public).

Pages: https://mbsi.vercel.app/grades/Grade_1 … Grade_12  (also /grades/Islamic, /grades/General — off-curriculum, opt-in)
"""
import html, os, re
from concurrent.futures import ThreadPoolExecutor
from ..common import fetch_text, gdrive_probe, log, read_json, write_json

BASE = "https://mbsi.vercel.app"
NAME = "bookhub"
GRADE_PAGES = [f"/grades/Grade_{i}" for i in range(1, 13)]
# Drive sizes/filenames are slow to probe (one request per file), so they are cached in the repo.
SIZE_CACHE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "catalog", "raw", "bookhub_sizes.json")
EXTRA_PAGES = ["/grades/Islamic", "/grades/General"]


def index(include_extra: bool = False, probe_sizes: bool = False) -> list[dict]:
    items = []
    for p in GRADE_PAGES + (EXTRA_PAGES if include_extra else []):
        try:
            h = html.unescape(fetch_text(BASE + p)).replace('\\"', '"')
        except Exception as e:  # noqa: BLE001
            log(f"[bookhub] skip {p}: {e}")
            continue
        seen = set()
        for m in re.finditer(r'(?:<img src="([^"]+)" )?alt="([^"]+?)"[\s\S]{0,4000}?drive\.google\.com/uc\?export=download&id=([A-Za-z0-9_-]{20,})', h):
            fid = m.group(3)
            if fid in seen:
                continue
            seen.add(fid)
            title = re.sub(r"\s+", " ", m.group(2)).strip()
            cover = m.group(1) if m.group(1) and m.group(1).startswith("http") else None
            g = re.search(r"Grade_(\d+)", p)
            items.append({"source": NAME, "source_page": BASE + p, "url": f"https://drive.google.com/uc?export=download&id={fid}",
                          "drive_id": fid, "title": title, "filename": None, "bytes": None, "link_text": None,
                          "section": None, "cover_url": cover, "grade_hint": g.group(1) if g else p.rsplit("/", 1)[-1]})
        log(f"[bookhub] {p}: {len(seen)} files")
    cache = read_json(SIZE_CACHE, {})
    for it in items:
        c = cache.get(it["drive_id"])
        if c:
            it["bytes"], it["filename"] = c.get("bytes"), c.get("filename")
    todo = [it for it in items if probe_sizes and not it.get("bytes")]
    if todo:
        def _probe(it):
            r = gdrive_probe(it["drive_id"])
            if r.get("bytes"):
                it["bytes"], it["filename"] = r["bytes"], r.get("filename")
                cache[it["drive_id"]] = {"bytes": r["bytes"], "filename": r.get("filename")}
            else:
                it["probe_error"] = r.get("error", "no-size")
            return it
        with ThreadPoolExecutor(4) as ex:
            list(ex.map(_probe, todo))
        write_json(SIZE_CACHE, cache)
        log(f"[bookhub] probed {len(todo)} Drive files → {SIZE_CACHE}")
    return items
