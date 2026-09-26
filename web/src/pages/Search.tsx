import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCatalog, useLessons } from '../data/catalog'
import { searchAll } from '../data/search'
import { GRADES, LEVEL_COLOR, levelOf, subjectInfo } from '../data/curriculum'
import { useT, num } from '../i18n'

const SUGGESTIONS = [
  { my: 'အက်တမ်', en: 'Atom' },
  { my: 'ချိန်သီး', en: 'Pendulum' },
  { my: 'နေအဖွဲ့အစည်း', en: 'Solar System' },
  { my: 'အခန်း ၁', en: 'Chapter 1' },
  { my: 'ဆဲလ်', en: 'Cell' },
  { my: 'ဒြပ်စင်အလှည့်ကျဇယား', en: 'Periodic Table' },
  { my: '၁၀ တန်း', en: 'Grade 10' },
  { my: 'သင်္ချာ', en: 'Mathematics' },
]

export default function SearchPage() {
  const { t, lang, bi } = useT()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const gradeFilter = searchParams.get('grade') || ''
  const [typeFilter, setTypeFilter] = useState<'all' | 'lessons' | 'chapters' | 'books'>('all')

  const cat = useCatalog()
  const lessons = useLessons()

  const handleQueryChange = (val: string) => {
    const params: Record<string, string> = {}
    if (val.trim()) params.q = val
    if (gradeFilter) params.grade = gradeFilter
    setSearchParams(params, { replace: true })
  }

  const handleGradeChange = (g: string) => {
    const next = gradeFilter === g ? '' : g
    const params: Record<string, string> = {}
    if (query.trim()) params.q = query
    if (next) params.grade = next
    setSearchParams(params, { replace: true })
  }

  const results = useMemo(() => {
    if (!query.trim()) return []
    return searchAll({
      query,
      catalog: cat.data?.entries,
      lessons: lessons.data,
      gradeFilter: gradeFilter || undefined,
      typeFilter: typeFilter === 'all' ? undefined : typeFilter,
      lang,
    })
  }, [query, cat.data?.entries, lessons.data, gradeFilter, typeFilter, lang])

  const counts = useMemo(() => {
    if (!query.trim()) return { all: 0, lessons: 0, chapters: 0, books: 0 }
    const all = searchAll({
      query,
      catalog: cat.data?.entries,
      lessons: lessons.data,
      gradeFilter: gradeFilter || undefined,
      lang,
    })
    return {
      all: all.length,
      lessons: all.filter((r) => r.type === 'lesson').length,
      chapters: all.filter((r) => r.type === 'chapter').length,
      books: all.filter((r) => r.type === 'book').length,
    }
  }, [query, cat.data?.entries, lessons.data, gradeFilter, lang])

  return (
    <div className="search-page">
      <div className="crumbs">
        <Link to="/">{t('appName')}</Link> › {t('search')}
      </div>

      <div className="search-header">
        <h1>{t('search')}</h1>
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            autoFocus
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
          />
          {query && (
            <button className="search-clear-btn" onClick={() => handleQueryChange('')} title={t('clear')}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grade filters */}
      <div className="filter-scroll">
        <button
          className={`chip ${gradeFilter === '' ? 'active' : ''}`}
          onClick={() => handleGradeChange('')}
        >
          {t('filterByGrade')}
        </button>
        {GRADES.map((g) => (
          <button
            key={g}
            className={`chip ${gradeFilter === g ? 'active' : ''}`}
            onClick={() => handleGradeChange(g)}
          >
            {g === 'KG' ? t('kg') : `${t('grade')} ${num(g, lang)}`}
          </button>
        ))}
      </div>

      {/* Category tabs when searching */}
      {query.trim() && (
        <div className="search-tabs">
          <button
            className={`tab-btn ${typeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTypeFilter('all')}
          >
            {t('allResults')} ({num(counts.all, lang)})
          </button>
          <button
            className={`tab-btn ${typeFilter === 'chapters' || typeFilter === 'lessons' ? 'active' : ''}`}
            onClick={() => setTypeFilter(typeFilter === 'chapters' ? 'all' : 'chapters')}
          >
            {t('chaptersAndLessons')} ({num(counts.chapters + counts.lessons, lang)})
          </button>
          <button
            className={`tab-btn ${typeFilter === 'books' ? 'active' : ''}`}
            onClick={() => setTypeFilter(typeFilter === 'books' ? 'all' : 'books')}
          >
            {t('booksAndGuides')} ({num(counts.books, lang)})
          </button>
        </div>
      )}

      {/* Suggested keywords when idle */}
      {!query.trim() && (
        <div className="search-suggestions">
          <h3>{lang === 'my' ? 'ရှာဖွေရန် အကြံပြုချက်များ' : 'Suggested Topics & Chapters'}</h3>
          <div className="chips-row">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                className="chip"
                onClick={() => handleQueryChange(lang === 'my' ? s.my : s.en)}
              >
                {lang === 'my' ? s.my : s.en}
              </button>
            ))}
          </div>
          <p className="muted" style={{ marginTop: '1rem', fontSize: '0.88rem' }}>
            {t('searchSuggestions')}
          </p>
        </div>
      )}

      {/* Search results */}
      {query.trim() && (
        <div className="search-results">
          {results.length === 0 ? (
            <div className="notice" style={{ marginTop: '1rem' }}>
              <p>
                <strong>{t('noResultsFor')}</strong> "{query}"
              </p>
              <p style={{ fontSize: '0.85rem' }}>{t('searchSuggestions')}</p>
            </div>
          ) : (
            <div className="list" style={{ marginTop: '1rem' }}>
              {results.map((r) => {
                const sInfo = subjectInfo(r.subject)
                const gLabel = r.grade === 'KG' ? t('kg') : `${t('grade')} ${num(r.grade, lang)}`
                const levelColor = LEVEL_COLOR[levelOf(r.grade)]

                return (
                  <div key={`${r.type}-${r.id}`} className="item search-item">
                    <div className="item-badge-col">
                      <span className="badge" style={{ background: levelColor, color: '#111', fontWeight: 'bold' }}>
                        {gLabel}
                      </span>
                      <span className="badge" style={{ color: sInfo.color, borderColor: sInfo.color, border: '1px solid' }}>
                        {sInfo.icon} {bi(sInfo)}
                      </span>
                    </div>

                    <div className="t">
                      <div className="search-item-title">
                        {r.has3d && <span title="3D Scene">🧊 </span>}
                        {r.hasVideo && <span title="Video">🎬 </span>}
                        <strong>{bi(r.title)}</strong>
                        {r.chapter !== undefined && r.chapter !== null && (
                          <span className="chapter-tag">
                            · {t('chapter')} {num(r.chapter, lang)}
                          </span>
                        )}
                      </div>
                      {r.subtitle && <div className="m">{bi(r.subtitle)}</div>}
                    </div>

                    <div className="item-actions">
                      {r.type === 'lesson' && (
                        <Link to={r.link} className="btn warn">
                          ▶ {t('start')}
                        </Link>
                      )}
                      {r.type === 'chapter' && (
                        <Link to={r.link} className="btn">
                          {r.has3d ? `▶ ${t('start')}` : `${sInfo.icon} ${t('read')}`}
                        </Link>
                      )}
                      {r.type === 'book' && (
                        <Link to={r.link} className="btn">
                          📖 {t('read')}
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
