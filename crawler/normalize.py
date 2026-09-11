"""Turn messy titles/filenames from each source into a canonical (grade, subject, kind, part, language, curriculum).

The rules are plain regex tables so teachers and contributors can extend them without deep Python knowledge.
Run `python3 -m crawler catalog` and read catalog/COVERAGE.md to see what did not classify (subject == 'unknown')
and which entries need a human look (same source hosting two files that look like the same book).
"""
from __future__ import annotations
import re

GRADES = ["KG"] + [str(i) for i in range(1, 13)]

# (canonical subject, [regex patterns]) — rules are tried in order, first match wins.
SUBJECT_RULES: list[tuple[str, list[str]]] = [
    ("optional_myanmar", [r"စိတ်ကြိုက်", r"optional\s*(myanmar|burmese)", r"elective\s*myanmar", r"specialized\s*myanmar", r"\bOB\b",
                          r"\b(poem|prose|plays?|drama|essay|oral)\b.*\b(course|myanmarsar)\b"]),
    ("islamic", [r"islam", r"qur'?an", r"qaida", r"hadith"]),
    ("social_studies", [r"social", r"steams", r"လူမှု"]),
    ("geography_history", [r"geograph\w*\s*(and|&|,)\s*histor", r"\bgeo\s*hist", r"ပထဝီ.*သမိုင်း"]),
    ("geography", [r"geograph", r"\bgeo\b", r"ပထဝီ"]),
    ("history", [r"histor", r"သမိုင်း"]),
    ("economics", [r"econom", r"\becon\b", r"ဘောဂဗေဒ"]),
    ("biology", [r"biolog", r"\bbio\b", r"ဇီဝ"]),
    ("chemistry", [r"chemis", r"hemistry", r"\bchem\b", r"ဓာတု"]),
    ("physics", [r"physic(?!al)", r"\bphy\b", r"ရူပ"]),
    ("physical_education", [r"physical\s*(edu|exer)", r"\bP\.?E\b", r"ကာယ", r"sport"]),
    ("morality_civics", [r"moral", r"molarity", r"civic", r"\bM\s?C\b", r"\bMC\b", r"ethic", r"thics\b", r"ပြည်သူ့နီတိ", r"ကိုယ်ကျင့်"]),
    ("life_skills", [r"life\s*skill", r"ဘဝတွက်တာ"]),
    ("ict", [r"\bICT\b", r"computer", r"digital\s*lit"]),
    ("performing_arts", [r"perfor?ming", r"music", r"ဂီတ", r"dance", r"song", r"artmusic", r"\bPA\b"]),
    ("visual_arts", [r"vir?sual\s*art", r"drawing", r"painting", r"ပန်းချီ", r"\bDRW\b"]),
    ("arts", [r"\barts?\b"]),
    ("mathematics", [r"math", r"geometr", r"algebra", r"trigonometr", r"calculus", r"arithmetic", r"သချ", r"သင်္ချာ", r"numbers?\b"]),
    ("science", [r"scien", r"\bsci\b", r"သိပ္ပံ"]),
    ("english", [r"english", r"nglish", r"\beng\b", r"အင်္ဂလိပ်"]),
    ("myanmar", [r"myanmar", r"burmese", r"\bmm\b", r"pinyin", r"ပင်ရင်း", r"မြန်မာ", r"alphabet"]),
    ("general", [r"teacher'?s?\s*guide", r"learning\s*guide", r"language\s*guide"]),
]

KIND_RULES: list[tuple[str, list[str]]] = [
    ("teacher_guide", [r"teacher'?s?\s*guide", r"\bTGG?\b", r"\btg\b", r"teaching\s*guide", r"ဆရာ.*လမ်းညွှန်"]),
    ("answer_guide", [r"answer", r"solution", r"အဖြေ", r"learner'?s?\s*choice", r"\bguide\b.*20\d\d"]),
    ("exam_guide", [r"exam\s*guide", r"past\s*paper", r"question", r"မေးခွန်း"]),
    ("workbook", [r"work\s*book", r"practical", r"listening", r"activity", r"exercise\s*book", r"experimental", r"လေ့ကျင့်ခန်း"]),
    ("interactive", [r"interactive"]),
    ("syllabus", [r"syllabus", r"contents?\s*competenc", r"curriculum\s*framework"]),
    ("learning_guide", [r"learning\s*guide", r"language\s*guide"]),
]

OLD_CURRICULUM = [r"old\s*(curriculum|course|syllabus)", r"သင်ရိုးဟောင်း"]
NEW_CURRICULUM = [r"new\s*(curriculum|course|syllabus)", r"သင်ရိုးသစ်"]
ENGLISH_EDITION = [r"english\s*(translation|version|edition)", r"\beng\b", r"\ben\b"]
BILINGUAL = [r"myanmar\s*(&|and)\s*english", r"bilingual"]
PUBLISHER_NUG = [r"\bNUG\b", r"nugmyanmar"]

_SUBJ_WORDS = r"(?:maths?|mathematics?|mathematic|science|chemistry|chem|biology|bio|physics|phy|socialscience|social|geography|geo|history|hist|myanmar|english|eng|economics|econ|arts?)"
PART_PATTERNS = [
    r"\bpart\s*(\d{1,2})\b",
    r"\bp(\d{1,2})\b",
    r"\b(?:vol|volume|book)\s*(\d{1,2})\b",
    _SUBJ_WORDS + r"\s*(\d)\b",
    r"\s(\d)\s+pdf$",
    r"အပိုင်း\s*[(]?\s*([၁၂၃123])",
    r"(?:သင်္ချာ|သချာ်|သိပ္ပံ|မြန်မာစာ|မြန်မာ|အင်္ဂလိပ်)\s*([၁၂၃])",
]
_MY_DIGITS = str.maketrans("၀၁၂၃၄၅၆၇၈၉", "0123456789")


def _first(rules, text):
    for canon, pats in rules:
        for p in pats:
            if re.search(p, text, re.I):
                return canon
    return None


def _clean(text: str) -> str:
    """Underscores, dashes, dots and brackets become spaces so \\b word boundaries work on filenames."""
    return re.sub(r"\s+", " ", re.sub(r"[_\-.()\[\]{},:]+", " ", text)).strip()


def _strip_prefix(title: str) -> str:
    t = re.sub(r"^\s*Myanmar\s+(Grade\s*\d+|Kindergarten|KG)\s*", " ", title, flags=re.I)
    return re.sub(r"\bTextbook\s+PDF\b|\bPDF\b", " ", t, flags=re.I)


def grade_from(text: str, hint: str | None) -> str | None:
    if hint:
        h = hint.strip().upper()
        if h in GRADES:
            return h
        if h in ("0", "KINDERGARTEN", "K"):
            return "KG"
    m = re.search(r"(?:grade|class|g)\s*(\d{1,2})\b", text, re.I)
    if m and m.group(1) in GRADES:
        return m.group(1)
    if re.search(r"\bKG\b|kindergarten|သူငယ်တန်း", text, re.I):
        return "KG"
    return None


def part_from(text: str | None) -> int | None:
    if not text:
        return None
    t = _clean(text)
    for p in PART_PATTERNS:
        m = re.search(p, t, re.I)
        if m:
            d = m.group(1).translate(_MY_DIGITS)
            if d.isdigit() and 0 < int(d) < 30:
                return int(d)
    return None


def normalize(item: dict) -> dict:
    """Return the item enriched with canonical fields. Never raises."""
    title = item.get("title") or ""
    fname = item.get("filename") or ""
    section = item.get("section") or ""
    link = item.get("link_text") or ""
    blob = _clean(" | ".join(x for x in (_strip_prefix(title), fname, section, link) if x))
    subject = _first(SUBJECT_RULES, blob) or "unknown"
    kind = _first(KIND_RULES, blob) or "textbook"
    grade = grade_from(blob, item.get("grade_hint")) or "unknown"
    part = part_from(fname) or part_from(link) or part_from(_strip_prefix(title))
    if kind in ("syllabus", "teacher_guide") and part and part > 3:
        part = None
    curriculum = "old" if _first([("old", OLD_CURRICULUM)], blob) else "new"
    if _first([("new", NEW_CURRICULUM)], blob):
        curriculum = "new"
    if subject == "english":
        language = "en"
    elif _first([("bi", BILINGUAL)], blob):
        language = "my+en"
    elif _first([("en", ENGLISH_EDITION)], blob):
        language = "en"
    else:
        language = "my"
    publisher = "NUG Ministry of Education" if _first([("nug", PUBLISHER_NUG)], blob) else "Ministry of Education (Myanmar)"
    off_curriculum = subject == "islamic" or item.get("grade_hint") in ("Islamic", "General")
    key = "|".join([grade, subject, kind, str(part or ""), curriculum, language, "nug" if "NUG" in publisher else "moe"])
    return {**item, "grade": grade, "subject": subject, "kind": kind, "part": part, "curriculum": curriculum,
            "language": language, "publisher": publisher, "off_curriculum": off_curriculum, "key": key}
