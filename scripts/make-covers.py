#!/usr/bin/env python3
"""Render page 1 of every downloaded textbook to data/covers/<catalog-id>.jpg (320 px wide) with poppler's pdftoppm.
Covers are committed (≈15 KB each) so the deployed site is visual without hot-linking third-party images."""
import json, os, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
m = json.load(open(os.path.join(ROOT, "data", "manifest.json")))["files"]
out = os.path.join(ROOT, "data", "covers"); os.makedirs(out, exist_ok=True)
n = 0
for cid, rec in m.items():
    dest = os.path.join(out, cid + ".jpg")
    src = os.path.join(ROOT, rec["path"])
    if os.path.exists(dest) or not os.path.exists(src):
        continue
    r = subprocess.run(["pdftoppm", "-f", "1", "-l", "1", "-jpeg", "-jpegopt", "quality=72", "-scale-to", "320", "-singlefile", src, dest[:-4]], capture_output=True)
    if r.returncode == 0 and os.path.exists(dest):
        n += 1
    else:
        print("cover failed:", cid, r.stderr.decode()[:100], file=sys.stderr)
print(f"rendered {n} new covers → data/covers ({len(os.listdir(out))} total)")
