"""Source adapters. Each exposes index() -> list[dict] with the raw item schema:

{ "source": str, "source_page": str, "url": str|None, "drive_id": str|None,
  "title": str, "filename": str|None, "bytes": int|None, "link_text": str|None, "section": str|None }
"""
from . import edu4mm, learnbig, bookhub, myanmarexam

SOURCES = {
    "edu4mm": edu4mm,          # direct PDFs, KG-12, includes teacher guides + NUG-MoE editions
    "learnbig": learnbig,      # direct PDFs (UNESCO-backed LearnBig library), KG-11
    "bookhub": bookhub,        # Google Drive files behind mbsi.vercel.app, grades 1-12 + answer guides
    "myanmarexam": myanmarexam,  # official Dept. of Myanmar Examinations KG guides
}
