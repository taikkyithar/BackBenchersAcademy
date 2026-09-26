import { Suspense, lazy, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GRADES, LEVEL_COLOR, levelOf } from '../data/curriculum'
import { useCatalog, useLessons } from '../data/catalog'
import { useSettings, useT, num } from '../i18n'

const Campus = lazy(() => import('../scenes/Campus'))

export default function Home() {
  const { t, lang } = useT()
  const use3D = useSettings((s) => s.use3D)
  const nav = useNavigate()
  const cat = useCatalog()
  const lessons = useLessons()
  const [quickQuery, setQuickQuery] = useState('')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (quickQuery.trim()) {
      nav(`/search?q=${encodeURIComponent(quickQuery.trim())}`)
    } else {
      nav('/search')
    }
  }

  const label = (g: string) => (g === 'KG' ? t('kg') : `${t('grade')} ${num(g, lang)}`)
  const count = (g: string) => cat.data?.entries.filter((e) => e.grade === g).length ?? 0
  return (
    <div>
      <section className="hero">
        <h1>{t('tagline')}</h1>
        <p>{cat.data ? `${num(cat.data.entries.length, lang)} ${t('books')} · ${num(lessons.data?.length ?? 0, lang)} ${t('lessons')} · ${t('offline')}` : t('loading')}</p>
        <form className="home-search-form" onSubmit={handleSearchSubmit}>
          <span className="home-search-icon">🔍</span>
          <input
            type="text"
            className="home-search-input"
            placeholder={t('searchPlaceholder')}
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
          />
          <button type="submit" className="btn home-search-btn">
            {t('search')}
          </button>
        </form>
      </section>
      {use3D && <Suspense fallback={<div className="scene" />}><Campus label={label} onPick={(g) => nav(`/grade/${g}`)} hint={t('home3dHint')} /></Suspense>}
      <h2>{t('chooseGrade')}</h2>
      <div className="grid">
        {GRADES.map((g) => (
          <Link key={g} to={`/grade/${g}`} className="card" style={{ ['--c' as string]: LEVEL_COLOR[levelOf(g)] }}>
            <div className="big">{g === 'KG' ? t('kg') : num(g, lang)}</div>
            <div className="sub">{g === 'KG' ? '' : t('grade')} · {t(levelOf(g))} · {num(count(g), lang)} {t('books')}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
