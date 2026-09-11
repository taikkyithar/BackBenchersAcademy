"""python3 -m crawler <command>

  index     crawl sources → catalog/raw/<source>.json   (--source edu4mm,learnbig,bookhub,myanmarexam) (--sizes)
  catalog   merge + normalize → catalog/catalog.json, catalog.csv, COVERAGE.md
  download  fetch preferred copies → data/pdf, data/manifest.json   (--budget-gb, --grades, --kinds, --dry-run)
  verify    re-hash downloaded files against data/manifest.json
"""
from __future__ import annotations
import argparse, os, sys
from concurrent.futures import ThreadPoolExecutor
from .common import head_size, log, read_json, sha256_file, write_json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def cmd_index(a):
    from .sources import SOURCES
    names = a.source.split(",") if a.source else list(SOURCES)
    for n in names:
        mod = SOURCES[n]
        items = mod.index(probe_sizes=a.sizes, include_extra=a.include_extra) if n == "bookhub" else mod.index()
        if a.sizes and n != "bookhub":
            def _sz(it):
                try:
                    it["bytes"] = head_size(it["url"])["bytes"]
                except Exception as e:  # noqa: BLE001
                    it["size_error"] = str(e)[:100]
                return it
            with ThreadPoolExecutor(12) as ex:
                items = list(ex.map(_sz, items))
        out = os.path.join(ROOT, "catalog", "raw", f"{n}.json")
        write_json(out, items)
        log(f"[index] {n}: {len(items)} items → {out}")


def cmd_catalog(a):
    from .catalog import build
    cat = build()
    print(f"{cat['n_raw']} raw items → {cat['n_entries']} catalog entries. See catalog/COVERAGE.md")


def cmd_download(a):
    from .download import run
    run(budget_gb=a.budget_gb, grades=a.grades.split(",") if a.grades else None, kinds=a.kinds.split(",") if a.kinds else None,
        include_off=a.include_off, sources=a.sources.split(",") if a.sources else None, dry_run=a.dry_run, limit=a.limit)


def cmd_verify(a):
    m = read_json(os.path.join(ROOT, "data", "manifest.json"), {"files": {}})
    bad = 0
    for k, rec in m["files"].items():
        p = os.path.join(ROOT, rec["path"])
        if not os.path.exists(p):
            print("MISSING", k); bad += 1; continue
        if sha256_file(p) != rec["sha256"]:
            print("HASH MISMATCH", k); bad += 1
    print(f"{len(m['files'])} files checked, {bad} problems")
    sys.exit(1 if bad else 0)


def main(argv=None):
    p = argparse.ArgumentParser(prog="python3 -m crawler", description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = p.add_subparsers(dest="cmd", required=True)
    s = sp.add_parser("index"); s.add_argument("--source"); s.add_argument("--sizes", action="store_true"); s.add_argument("--include-extra", action="store_true"); s.set_defaults(fn=cmd_index)
    s = sp.add_parser("catalog"); s.set_defaults(fn=cmd_catalog)
    s = sp.add_parser("download"); s.add_argument("--budget-gb", type=float); s.add_argument("--grades"); s.add_argument("--kinds"); s.add_argument("--sources")
    s.add_argument("--include-off", action="store_true"); s.add_argument("--dry-run", action="store_true"); s.add_argument("--limit", type=int); s.set_defaults(fn=cmd_download)
    s = sp.add_parser("verify"); s.set_defaults(fn=cmd_verify)
    a = p.parse_args(argv)
    a.fn(a)


if __name__ == "__main__":
    main()
