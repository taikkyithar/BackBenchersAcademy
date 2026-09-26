import type { Bi, Lang } from '../i18n'
import type { Entry, LessonSummary } from './catalog'
import { CURRICULUM_CHAPTERS, type CurriculumChapter } from './curriculum_chapters'
import { subjectInfo, KINDS } from './curriculum'

export type SearchResultType = 'lesson' | 'chapter' | 'book'

export type SearchResult = {
  id: string
  type: SearchResultType
  grade: string
  subject: string
  title: Bi | string
  subtitle?: Bi | string
  chapter?: number | string | null
  pages?: string | null
  link: string
  has3d?: boolean
  hasVideo?: boolean
  kind?: string
  score: number
  matchReason?: string
}

const MY_DIGITS = '၀၁၂၃၄၅၆၇၈၉'
const EN_DIGITS = '0123456789'

export function burmeseToEnglishDigits(str: string): string {
  let res = ''
  for (const ch of str) {
    const idx = MY_DIGITS.indexOf(ch)
    res += idx !== -1 ? EN_DIGITS[idx] : ch
  }
  return res
}

export function englishToBurmeseDigits(str: string): string {
  let res = ''
  for (const ch of str) {
    const idx = EN_DIGITS.indexOf(ch)
    res += idx !== -1 ? MY_DIGITS[idx] : ch
  }
  return res
}

/** Normalize string for search: lowercase, normalize spaces and punctuation. */
export function normalizeForSearch(text: string): string {
  if (!text) return ''
  return text
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // zero-width spaces
    .replace(/[—–\-._,:;()/[\]{}"'?!=+*&^%$#@~`|\\<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Check if text matches query with digit transliteration. */
function scoreMatch(target: string, queryWords: string[], normalizedQuery: string): number {
  if (!target) return 0
  const norm = normalizeForSearch(target)
  const normDigitsEn = burmeseToEnglishDigits(norm)
  const normDigitsMy = englishToBurmeseDigits(norm)

  // Exact phrase match gives highest boost
  if (norm === normalizedQuery || normDigitsEn === normalizedQuery || normDigitsMy === normalizedQuery) {
    return 100
  }
  if (norm.includes(normalizedQuery) || normDigitsEn.includes(normalizedQuery) || normDigitsMy.includes(normalizedQuery)) {
    return 60
  }

  // Word-by-word matching
  let matchedWords = 0
  for (const word of queryWords) {
    const wordEn = burmeseToEnglishDigits(word)
    const wordMy = englishToBurmeseDigits(word)
    if (
      norm.includes(word) ||
      norm.includes(wordEn) ||
      norm.includes(wordMy) ||
      normDigitsEn.includes(word) ||
      normDigitsEn.includes(wordEn)
    ) {
      matchedWords++
    }
  }

  if (matchedWords === queryWords.length) {
    return 40 + matchedWords * 5
  }
  if (matchedWords > 0) {
    return matchedWords * 10
  }

  return 0
}

/** Match grade filter and number queries like "G10", "Grade 10", "၁၀", "သူငယ်တန်း" */
function matchesGrade(itemGrade: string, query: string): boolean {
  const q = normalizeForSearch(query)
  const qEn = burmeseToEnglishDigits(q)
  const qMy = englishToBurmeseDigits(q)
  const g = itemGrade.toLowerCase()
  const gMy = englishToBurmeseDigits(g)

  if (q === g || qEn === g || qMy === gMy) return true
  if (g === 'kg' && (q.includes('kg') || q.includes('kindergarten') || q.includes('သူငယ်တန်း'))) return true
  if (q.includes(`grade ${g}`) || qEn.includes(`grade ${g}`) || q.includes(`g${g}`) || qMy.includes(`${gMy} တန်း`) || qMy.includes(`${gMy}တန်း`)) return true
  return false
}

export function searchAll({
  query,
  catalog = [],
  lessons = [],
  chapters = CURRICULUM_CHAPTERS,
  gradeFilter,
  typeFilter,
  lang = 'my',
}: {
  query: string
  catalog?: Entry[]
  lessons?: LessonSummary[]
  chapters?: CurriculumChapter[]
  gradeFilter?: string
  typeFilter?: 'all' | 'lessons' | 'chapters' | 'books'
  lang?: Lang
}): SearchResult[] {
  const rawQ = query.trim()
  if (!rawQ) return []

  const normQ = normalizeForSearch(rawQ)
  const normQEn = burmeseToEnglishDigits(normQ)
  const queryWords = normQ.split(' ').filter(Boolean)
  if (queryWords.length === 0) return []

  const results: SearchResult[] = []

  // Check if query is looking for a chapter specifically ("အခန်း ၁", "chapter 1", etc.)
  const chapterMatch = normQEn.match(/(?:အခန်း|chapter|ch)\s*(\d+)/i)
  const targetChapter = chapterMatch ? chapterMatch[1] : null

  // 1. Search Lessons
  if (typeFilter !== 'books' && typeFilter !== 'chapters') {
    for (const l of lessons) {
      if (gradeFilter && l.grade !== gradeFilter) continue

      const sInfo = subjectInfo(l.subject)
      const stepText = (l.step_titles || []).map((st) => `${st.my} ${st.en}`).join(' ')
      const targets = [
        l.title.my,
        l.title.en,
        l.summary?.my ?? '',
        l.summary?.en ?? '',
        sInfo.my,
        sInfo.en,
        l.grade,
        englishToBurmeseDigits(l.grade),
        l.textbook_ref?.chapter ? `အခန်း ${l.textbook_ref.chapter} chapter ${l.textbook_ref.chapter}` : '',
        stepText,
      ]

      let maxScore = 0
      let reason = ''
      for (const t of targets) {
        const sc = scoreMatch(t, queryWords, normQ)
        if (sc > maxScore) {
          maxScore = sc
          reason = t
        }
      }

      // Bonus for chapter number match
      if (targetChapter && l.textbook_ref?.chapter && String(l.textbook_ref.chapter) === targetChapter) {
        maxScore += 45
        reason = `အခန်း ${targetChapter} / Chapter ${targetChapter}`
      }

      if (matchesGrade(l.grade, normQ)) {
        maxScore += 15
      }

      if (maxScore > 0) {
        results.push({
          id: l.id,
          type: 'lesson',
          grade: l.grade,
          subject: l.subject,
          title: l.title,
          subtitle: l.summary ?? undefined,
          chapter: l.textbook_ref?.chapter ?? null,
          pages: l.textbook_ref?.pages ?? null,
          link: `/lesson/${l.id}`,
          has3d: l.has3d,
          hasVideo: l.hasVideo,
          score: maxScore + 20, // boost interactive lessons
          matchReason: reason,
        })
      }
    }
  }

  // 2. Search Curriculum Chapters
  if (typeFilter !== 'books' && typeFilter !== 'lessons') {
    for (const ch of chapters) {
      if (gradeFilter && ch.grade !== gradeFilter) continue

      const sInfo = subjectInfo(ch.subject)
      const topicsText = (ch.topics || []).map((tp) => `${tp.my} ${tp.en}`).join(' ')
      const chTargets = [
        ch.title.my,
        ch.title.en,
        sInfo.my,
        sInfo.en,
        `အခန်း ${ch.chapter} chapter ${ch.chapter}`,
        `အခန်း ${englishToBurmeseDigits(String(ch.chapter))}`,
        ch.grade,
        englishToBurmeseDigits(ch.grade),
        topicsText,
      ]

      let maxScore = 0
      let reason = ''
      for (const t of chTargets) {
        const sc = scoreMatch(t, queryWords, normQ)
        if (sc > maxScore) {
          maxScore = sc
          reason = t
        }
      }

      if (targetChapter && String(ch.chapter) === targetChapter) {
        maxScore += 50
        reason = `အခန်း ${targetChapter} / Chapter ${targetChapter}`
      }

      if (matchesGrade(ch.grade, normQ)) {
        maxScore += 15
      }

      if (maxScore > 0) {
        // Link to existing lesson if available, or to subject page
        const link = ch.lesson_id ? `/lesson/${ch.lesson_id}` : `/grade/${ch.grade}/${ch.subject}`
        results.push({
          id: ch.id,
          type: 'chapter',
          grade: ch.grade,
          subject: ch.subject,
          title: ch.title,
          subtitle: ch.topics && ch.topics.length > 0 ? ch.topics[0] : undefined,
          chapter: ch.chapter,
          link,
          has3d: Boolean(ch.lesson_id),
          score: maxScore + 15,
          matchReason: reason,
        })
      }
    }
  }

  // 3. Search Catalog Books & Textbooks
  if (typeFilter !== 'chapters' && typeFilter !== 'lessons') {
    for (const b of catalog) {
      if (b.off_curriculum) continue
      if (gradeFilter && b.grade !== gradeFilter) continue

      const sInfo = subjectInfo(b.subject)
      const kInfo = KINDS[b.kind] ?? { my: b.kind, en: b.kind }
      const filesText = b.files.map((f) => `${f.title || ''} ${f.filename || ''}`).join(' ')
      const bTargets = [
        b.title,
        b.subject_label,
        sInfo.my,
        sInfo.en,
        kInfo.my,
        kInfo.en,
        b.grade,
        englishToBurmeseDigits(b.grade),
        b.publisher,
        b.part ? `အပိုင်း ${b.part} part ${b.part}` : '',
        filesText,
      ]

      let maxScore = 0
      let reason = ''
      for (const t of bTargets) {
        const sc = scoreMatch(t, queryWords, normQ)
        if (sc > maxScore) {
          maxScore = sc
          reason = t
        }
      }

      if (matchesGrade(b.grade, normQ)) {
        maxScore += 15
      }

      if (maxScore > 0) {
        results.push({
          id: b.id,
          type: 'book',
          grade: b.grade,
          subject: b.subject,
          title: b.title,
          subtitle: {
            my: `${kInfo.my}${b.part ? ` (အပိုင်း ${englishToBurmeseDigits(String(b.part))})` : ''}`,
            en: `${kInfo.en}${b.part ? ` (Part ${b.part})` : ''}`,
          },
          kind: b.kind,
          link: `/read/${b.id}`,
          score: maxScore,
          matchReason: reason,
        })
      }
    }
  }

  // Deduplicate and Sort
  // If a chapter and lesson share the same subject, chapter, and title, merge/prioritize lesson
  const seen = new Set<string>()
  const filtered: SearchResult[] = []

  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    const aLang = typeof a.title === 'object' && a.title[lang] ? 1 : 0
    const bLang = typeof b.title === 'object' && b.title[lang] ? 1 : 0
    return bLang - aLang
  })

  for (const item of results) {
    const key = item.type === 'book' ? `book:${item.id}` : `content:${item.grade}:${item.subject}:${item.chapter || item.id}`
    if (seen.has(key)) continue
    seen.add(key)
    filtered.push(item)
  }

  return filtered.slice(0, 50)
}
