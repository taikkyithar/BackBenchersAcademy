"""myanmarexam.org — Department of Myanmar Examinations (official). Hosts the KG teacher/learning guides.

Page: https://myanmarexam.org/news/23  → http://resources.mmoe.myanmarexam.org/docs/guide/*.pdf
"""
import html, re
from ..common import fetch_text, log

NAME = "myanmarexam"
PAGES = ["https://myanmarexam.org/news/23"]


def index() -> list[dict]:
    items = []
    for page in PAGES:
        try:
            h = fetch_text(page)
        except Exception as e:  # noqa: BLE001
            log(f"[myanmarexam] skip {page}: {e}")
            continue
        for m in re.finditer(r'<a[^>]+href="([^"]+\.pdf[^"]*)"[^>]*>(.*?)</a>', h, re.S | re.I):
            url = html.unescape(m.group(1))
            text = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html.unescape(m.group(2)))).strip()
            items.append({"source": NAME, "source_page": page, "url": url, "drive_id": None,
                          "title": text or url.rsplit("/", 1)[-1], "filename": url.rsplit("/", 1)[-1],
                          "bytes": None, "link_text": text, "section": None, "grade_hint": "KG"})
        log(f"[myanmarexam] {page}: {len(items)} pdfs")
    return items
