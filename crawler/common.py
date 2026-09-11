"""Shared HTTP helpers (stdlib only), Google Drive confirm flow, hashing, pdf metadata."""
from __future__ import annotations
import hashlib, html, http.cookiejar, json, os, re, subprocess, sys, time, urllib.error, urllib.parse, urllib.request

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/124 Safari/537.36 BackBenchersAcademy-crawler/0.1 (open education project)")
DEFAULT_TIMEOUT = 90


def log(*a):
    print(*a, file=sys.stderr, flush=True)


def quote_url(u: str) -> str:
    """Percent-encode non-ASCII characters in path/query (Burmese filenames are common)."""
    p = urllib.parse.urlsplit(u)
    path = urllib.parse.quote(p.path, safe="/%:@&=+$,;~!*'()")
    query = urllib.parse.quote(p.query, safe="=&%?/:+,;")
    return urllib.parse.urlunsplit((p.scheme, p.netloc, path, query, p.fragment))


def opener(cookies: bool = False):
    handlers = []
    if cookies:
        handlers.append(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
    op = urllib.request.build_opener(*handlers)
    op.addheaders = [("User-Agent", UA)]
    return op


def fetch_text(url: str, retries: int = 3, timeout: int = DEFAULT_TIMEOUT) -> str:
    last = None
    for i in range(retries):
        try:
            with opener().open(quote_url(url), timeout=timeout) as r:
                return r.read().decode("utf-8", "ignore")
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(1.5 * (i + 1))
    raise RuntimeError(f"fetch failed {url}: {last}")


def head_size(url: str, timeout: int = 60) -> dict:
    """Return {'bytes','content_type','final_url'} using HEAD, falling back to a 1-byte Range GET."""
    qu = quote_url(url)
    try:
        req = urllib.request.Request(qu, headers={"User-Agent": UA}, method="HEAD")
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return {"bytes": int(r.headers.get("Content-Length") or 0),
                    "content_type": r.headers.get("Content-Type", ""), "final_url": r.geturl()}
    except Exception:  # noqa: BLE001
        req = urllib.request.Request(qu, headers={"User-Agent": UA, "Range": "bytes=0-0"})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            m = re.search(r"/(\d+)", r.headers.get("Content-Range", ""))
            return {"bytes": int(m.group(1)) if m else 0,
                    "content_type": r.headers.get("Content-Type", ""), "final_url": r.geturl()}


# ---------------------------------------------------------------- Google Drive

def gdrive_open(file_id: str, timeout: int = DEFAULT_TIMEOUT):
    """Open a public Google Drive file for streaming, handling the 'virus scan' confirm page.

    Returns (response, filename, size_hint). Raises RuntimeError on quota / unexpected pages.
    """
    op = opener(cookies=True)
    url = f"https://drive.google.com/uc?export=download&id={file_id}"
    for _hop in range(4):
        r = op.open(url, timeout=timeout)
        ct = r.headers.get("Content-Type", "")
        if "text/html" not in ct:
            cd = r.headers.get("Content-Disposition", "")
            m = re.search(r'filename\*=UTF-8\'\'([^;]+)', cd) or re.search(r'filename="([^"]+)"', cd)
            name = urllib.parse.unquote(m.group(1)) if m else None
            return r, name, int(r.headers.get("Content-Length") or 0)
        body = r.read().decode("utf-8", "ignore")
        low = body.lower()
        if "quota exceeded" in low or "too many users have viewed or downloaded" in low:
            raise RuntimeError("gdrive-quota")
        m = re.search(r'<form[^>]+id="download-form"[^>]+action="([^"]+)"', body)
        if not m:
            raise RuntimeError("gdrive-unexpected-page: " + re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", body))[:200])
        params = dict(re.findall(r'<input type="hidden" name="([^"]+)" value="([^"]*)"', body))
        url = html.unescape(m.group(1)) + "?" + urllib.parse.urlencode(params)
    raise RuntimeError("gdrive-too-many-hops")


def gdrive_probe(file_id: str) -> dict:
    """Size + filename without downloading (reads the confirm page or the headers only)."""
    op = opener(cookies=True)
    url = f"https://drive.google.com/uc?export=download&id={file_id}"
    for _hop in range(3):
        r = op.open(url, timeout=DEFAULT_TIMEOUT)
        ct = r.headers.get("Content-Type", "")
        if "text/html" not in ct:
            cd = r.headers.get("Content-Disposition", "")
            m = re.search(r'filename="([^"]+)"', cd)
            n = int(r.headers.get("Content-Length") or 0)
            r.close()
            return {"bytes": n, "filename": m.group(1) if m else None, "content_type": ct}
        body = r.read().decode("utf-8", "ignore")
        if "quota exceeded" in body.lower():
            return {"error": "gdrive-quota"}
        m = re.search(r'<form[^>]+id="download-form"[^>]+action="([^"]+)"', body)
        if not m:
            return {"error": "gdrive-unexpected-page"}
        name = re.search(r'<a href="/open\?id=[^"]+"[^>]*>([^<]+)</a>', body)
        size = re.search(r"\((\d+(?:\.\d+)?)\s*([KMG])\)", body)
        if size:
            v = float(size.group(1)) * {"K": 1e3, "M": 1e6, "G": 1e9}[size.group(2)]
            return {"bytes": int(v), "filename": html.unescape(name.group(1)) if name else None, "approx": True}
        params = dict(re.findall(r'<input type="hidden" name="([^"]+)" value="([^"]*)"', body))
        url = html.unescape(m.group(1)) + "?" + urllib.parse.urlencode(params)
    return {"error": "gdrive-too-many-hops"}


# ---------------------------------------------------------------- files

def stream_to_file(resp, dest: str, mode: str = "wb", progress_every: int = 20 << 20) -> int:
    n = 0
    tmp = dest + ".part"
    with open(tmp, mode) as f:
        while True:
            b = resp.read(1 << 20)
            if not b:
                break
            f.write(b)
            n += len(b)
            if progress_every and n % progress_every < (1 << 20):
                log(f"    … {n/1e6:.0f} MB")
    os.replace(tmp, dest)
    return n


def sha256_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def pdf_info(path: str) -> dict:
    """Page count + title via poppler's pdfinfo if available; empty dict otherwise."""
    try:
        out = subprocess.run(["pdfinfo", path], capture_output=True, text=True, timeout=60).stdout
    except Exception:  # noqa: BLE001
        return {}
    d = {}
    for line in out.splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            d[k.strip().lower().replace(" ", "_")] = v.strip()
    res = {}
    if d.get("pages", "").isdigit():
        res["pages"] = int(d["pages"])
    if d.get("title"):
        res["pdf_title"] = d["title"]
    return res


def is_pdf(path: str) -> bool:
    try:
        with open(path, "rb") as f:
            return f.read(5) == b"%PDF-"
    except OSError:
        return False


def write_json(path: str, data) -> None:
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
        f.write("\n")


def read_json(path: str, default=None):
    if not os.path.exists(path):
        return default
    with open(path, encoding="utf-8") as f:
        return json.load(f)
