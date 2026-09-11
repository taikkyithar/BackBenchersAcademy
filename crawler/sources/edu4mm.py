"""edu4mm.com — 'Education for Myanmar'. WordPress site with one page per grade holding direct PDF links.

Pages: https://edu4mm.com/kindergarten/ and https://edu4mm.com/grade-1/ … /grade-12/
"""
import html, re
from ..common import fetch_text, log

BASE = "https://edu4mm.com"
NAME = "edu4mm"


def _strip(t: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html.unescape(t))).strip()


def discover_pages() -> list[str]:
    tb = fetch_text(f"{BASE}/text-books/")
    slugs = sorted(set(re.findall(r'href="https://edu4mm\.com/([a-z0-9-]+)/"', tb)))
    pages = [s for s in slugs if re.match(r"^(grade-\d+|kindergarten)$", s)]
    return sorted(pages, key=lambda s: 0 if s == "kindergarten" else int(s.split("-")[1]))


def index() -> list[dict]:
    items = []
    for slug in discover_pages():
        page = f"{BASE}/{slug}/"
        try:
            h = fetch_text(page)
        except Exception as e:  # noqa: BLE001
            log(f"[edu4mm] skip {slug}: {e}")
            continue
        seen = set()
        for m in re.finditer(r'<a[^>]+href="([^"]+\.pdf[^"]*)"[^>]*>(.*?)</a>', h, re.S | re.I):
            url = html.unescape(m.group(1))
            if url in seen:
                continue
            seen.add(url)
            before = h[: m.start()]
            heads = re.findall(r"<h[1-6][^>]*>(.*?)</h[1-6]>", before, re.S)
            section = _strip(heads[-1]) if heads else None
            text = _strip(m.group(2))
            # site quirk: the first letter is often outside the <a> ("C<a …>hemistry</a>")
            if text[:1].islower() and before[-1:].isalpha() and before[-1:].isupper():
                text = before[-1] + text
            fname = url.rsplit("/", 1)[-1]
            items.append({"source": NAME, "source_page": page, "url": url, "drive_id": None,
                          "title": f"{section or ''} {text}".strip() or fname,
                          "filename": fname, "bytes": None, "link_text": text, "section": section,
                          "grade_hint": "KG" if slug == "kindergarten" else slug.split("-")[1]})
        log(f"[edu4mm] {slug}: {len(seen)} pdfs")
    return items
