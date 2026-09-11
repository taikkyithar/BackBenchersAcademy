"""Budgeted, resumable downloader. Downloads the preferred copy of each catalog entry into data/pdf/…

Priority order: KG→12, textbooks before guides, smaller files first — so a small disk budget still yields
the broadest coverage. Every completed file is hashed (sha256) and page-counted; results go to data/manifest.json.
Re-running skips finished files and continues with the remaining budget.
"""
from __future__ import annotations
import os, shutil, time
from .common import (gdrive_open, is_pdf, log, opener, pdf_info, quote_url, read_json, sha256_file, stream_to_file, write_json)
from .normalize import GRADES

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG = os.path.join(ROOT, "catalog", "catalog.json")
DATA = os.path.join(ROOT, "data")
PDF_DIR = os.path.join(DATA, "pdf")
MANIFEST = os.path.join(DATA, "manifest.json")
KIND_RANK = {"textbook": 0, "teacher_guide": 1, "workbook": 2, "answer_guide": 3, "exam_guide": 4, "interactive": 5, "learning_guide": 6, "syllabus": 7}
RESERVE_BYTES = 1_500_000_000  # never drop below 1.5 GB free


def dest_for(e: dict) -> str:
    return os.path.join(PDF_DIR, e["grade"], e["subject"], e["id"] + ".pdf")


def free_bytes(path: str) -> int:
    return shutil.disk_usage(path).free


def plan(entries, grades=None, kinds=None, include_off=False, sources=None):
    sel = []
    for e in entries:
        if e["off_curriculum"] and not include_off:
            continue
        if grades and e["grade"] not in grades:
            continue
        if kinds and e["kind"] not in kinds:
            continue
        if e["grade"] == "unknown" or e["subject"] == "unknown":
            continue
        files = [f for f in e["files"] if not sources or f["source"] in sources]
        if not files:
            continue
        sel.append((e, files))
    order = {g: i for i, g in enumerate(GRADES)}
    sel.sort(key=lambda ef: (KIND_RANK.get(ef[0]["kind"], 9), order.get(ef[0]["grade"], 99), ef[1][0].get("bytes") or 0))
    return sel


def fetch_one(e: dict, files: list[dict]) -> dict:
    dest = dest_for(e)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    last_err = None
    for f in files:
        try:
            t0 = time.time()
            if f.get("drive_id"):
                resp, name, _ = gdrive_open(f["drive_id"])
            else:
                resp = opener().open(quote_url(f["url"]), timeout=120)
                name = f.get("filename")
            n = stream_to_file(resp, dest)
            if not is_pdf(dest):
                os.remove(dest)
                raise RuntimeError("not a PDF (probably an HTML error page)")
            info = pdf_info(dest)
            rec = {"id": e["id"], "path": os.path.relpath(dest, ROOT), "bytes": n, "sha256": sha256_file(dest),
                   "source": f["source"], "url": f["url"], "original_filename": name, "downloaded_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                   "seconds": round(time.time() - t0, 1), **info}
            return rec
        except Exception as ex:  # noqa: BLE001
            last_err = f"{f['source']}: {ex}"
            log(f"    ! {last_err}")
            if os.path.exists(dest + ".part"):
                os.remove(dest + ".part")
    return {"id": e["id"], "error": last_err}


def run(budget_gb: float | None = None, grades=None, kinds=None, include_off=False, sources=None, dry_run=False, limit=None, pause: float = 1.0):
    cat = read_json(CATALOG)
    if not cat:
        raise SystemExit("catalog/catalog.json missing — run `python3 -m crawler catalog` first")
    manifest = read_json(MANIFEST, {"files": {}, "errors": {}})
    done = manifest["files"]
    os.makedirs(PDF_DIR, exist_ok=True)
    budget = int(budget_gb * 1e9) if budget_gb else max(0, free_bytes(DATA) - RESERVE_BYTES)
    budget = min(budget, max(0, free_bytes(DATA) - RESERVE_BYTES))
    todo = [(e, fs) for e, fs in plan(cat["entries"], grades, kinds, include_off, sources) if e["id"] not in done]
    log(f"[download] {len(done)} done · {len(todo)} to go · budget {budget/1e9:.2f} GB · free {free_bytes(DATA)/1e9:.2f} GB")
    spent = 0
    n_ok = n_skip = 0
    for e, fs in todo:
        if limit and n_ok >= limit:
            break
        size = fs[0].get("bytes") or 0
        if size and spent + size > budget:
            n_skip += 1
            continue
        if free_bytes(DATA) - size < RESERVE_BYTES:
            log("[download] stopping: disk reserve reached")
            break
        log(f"[download] {e['id']}  ({size/1e6:.0f} MB, {fs[0]['source']})")
        if dry_run:
            spent += size
            n_ok += 1
            continue
        rec = fetch_one(e, fs)
        if "error" in rec:
            manifest["errors"][e["id"]] = rec["error"]
        else:
            done[e["id"]] = rec
            manifest["errors"].pop(e["id"], None)
            spent += rec["bytes"]
            n_ok += 1
        write_json(MANIFEST, manifest)
        time.sleep(pause)  # be polite to the volunteer-run mirrors
    log(f"[download] finished: +{n_ok} files ({spent/1e9:.2f} GB) · {n_skip} deferred for budget · {len(manifest['errors'])} errors")
    return manifest
