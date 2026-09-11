import { Suspense, lazy, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { subjectInfo } from '../data/curriculum'
import { useCatalog, useLessons } from '../data/catalog'
import { useSettings, useT, num } from '../i18n'

const Bookshelf = lazy(() => import('../scenes/Bookshelf'))

export default function GradePage() {
  const { grade = 'KG' } = useParams()
  const { t, lang, bi } = useT()
  const use3D = useSettings((s) => s.use3D)
  const nav = useNavigate()
  const cat = useCatalog()
  const lessons = useLessons()
  const entries = cat.data?.entries.filter((e) => e.grade === grade) ?? []
  const subjects = [...new Set(entries.map((e) => e.subject))]
  const title = grade === 'KG' ? t('kg') : `${t('grade')} ${num(grade, lang)}`
  useEffect(() => {
    const h = (e: Event) => nav(`/grade/${grade}/${(e as CustomEvent<string>).detail}`)
    document.addEventListener('bba:pick', h)
    return () => document.removeEventListener('bba:pick', h)
  }, [grade, nav])
  return (
    <div>
      <div className="crumbs"><Link to="/">{t('appName')}</Link> › {title}</div>
      <h1 style={{ margin: '.2rem 0' }}>{title}</h1>
      {cat.error && <div className="notice">{cat.error}</div>}
      {use3D && subjects.length > 0 && (
        <Suspense fallback={<div className="scene small" />}>
          <Bookshelf hint={t('shelfHint')} books={subjects.map((s) => ({ id: s, color: subjectInfo(s).color, label: bi(subjectInfo(s)) }))} />
        </Suspense>
      )}
      <h2>{t('chooseSubject')}</h2>
      <div className="grid">
        {subjects.map((s) => {
          const info = subjectInfo(s)
          const n = entries.filter((e) => e.subject === s).length
          const nl = lessons.data?.filter((l) => l.grade === grade && l.subject === s).length ?? 0
          return (
            <Link key={s} to={`/grade/${grade}/${s}`} className="card" style={{ ['--c' as string]: info.color }}>
              <div className="big">{info.icon}</div>
              <div>{bi(info)}</div>
              <div className="sub">{num(n, lang)} {t('books')}{nl ? ` · ${num(nl, lang)} ${t('lessons')}` : ''}</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
