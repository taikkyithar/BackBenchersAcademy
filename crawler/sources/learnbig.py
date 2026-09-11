"""learnbig.net — LearnBig digital library (UNESCO-supported). Category pages per grade, one PDF per book page.

Category: https://www.learnbig.net/book_category/textbooks_myanmar_basic_education_{kindergarten|gradeN}/
Book page: https://www.learnbig.net/books/<slug>/  → PDF at https://books.learnbig.net/uploads/YYYY/MM/<name>.pdf
"""
import html, re
from concurrent.futures import ThreadPoolExecutor
from ..common import fetch_text, log

BASE = "https://www.learnbig.net"
NAME = "learnbig"
CATS = ["kindergarten"] + [f"grade{i}" for i in range(1, 13)]


def _book_links(cat: str) -> list[str]:
    base = f"{BASE}/book_category/textbooks_myanmar_basic_education_{cat}/"
    links, page = [], 1
    while page < 20:
        try:
            t = fetch_text(base if page == 1 else f"{base}page/{page}/", retries=1)
        except Exception:  # noqa: BLE001
            break
        new = [x for x in dict.fromkeys(re.findall(r'href="(https://www\.learnbig\.net/books/[^"]+)"', t)) if x not in links]
        if not new:
            break
        links += new
        page += 1
    return links


def _book(args):
    cat, url = args
    try:
        h = fetch_text(url)
    except Exception as e:  # noqa: BLE001
        log(f"[learnbig] fail {url}: {e}")
        return None
    pdfs = re.findall(r"https://books\.learnbig\.net/uploads/[^\"'\s<>]+\.pdf", h)
    if not pdfs:
        return None
    t = re.search(r'<meta property="og:title" content="([^"]*)"', h) or re.search(r"<title>([^<]*)", h)
    title = html.unescape(t.group(1)).replace(" | LearnBig", "").strip() if t else url
    og = re.search(r'<meta property="og:image" content="([^"]+)"', h)
    return {"source": NAME, "source_page": url, "url": pdfs[0], "drive_id": None, "title": title,
            "filename": pdfs[0].rsplit("/", 1)[-1], "bytes": None, "link_text": None, "section": None,
            "cover_url": html.unescape(og.group(1)) if og else None,
            "grade_hint": "KG" if cat == "kindergarten" else cat.replace("grade", "")}


def index() -> list[dict]:
    jobs = []
    for cat in CATS:
        links = _book_links(cat)
        log(f"[learnbig] {cat}: {len(links)} book pages")
        jobs += [(cat, u) for u in links]
    with ThreadPoolExecutor(8) as ex:
        return [x for x in ex.map(_book, jobs) if x]
