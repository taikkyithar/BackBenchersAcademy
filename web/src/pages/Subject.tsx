import { Link, useParams } from 'react-router-dom'
import { KINDS, subjectInfo } from '../data/curriculum'
import { kindOrder, mb, useCatalog, useLessons, viewUrl, type Entry } from '../data/catalog'
import { useT, num } from '../i18n'

function BookRow({ e }: { e: Entry }) {
  const { t, lang, bi } = useT()
  const f = e.files[0]
  return (
    <div className="item">
      <div className="t">
        <div>{bi(KINDS[e.kind] ?? { my: e.kind, en: e.kind })}{e.part ? ` · ${t('part')} ${num(e.part, lang)}` : ''} {e.curriculum === 'old' && <span className="badge">{t('curriculumOld')}</span>} {e.language !== 'my' && <span className="badge">{e.language}</span>} {e.publisher.includes('NUG') && <span className="badge">NUG</span>}</div>
        <div className="m">{f.title || f.filename} · {mb(f.bytes)} · {t('source')}: {e.files.map((x) => x.source).join(', ')}</div>
      </div>
      <Link className="btn" to={`/read/${e.id}`}>📖 {t('read')}</Link>
      <a className="btn secondary" href={viewUrl(f)} target="_blank" rel="noreferrer">⬇ {t('openOriginal')}</a>
    </div>
  )
}

export default function SubjectPage() {
  const { grade = 'KG', subject = '' } = useParams()
  const { t, lang, bi } = useT()
  const cat = useCatalog()
  const lessons = useLessons()
  const info = subjectInfo(subject)
  const entries = (cat.data?.entries ?? []).filter((e) => e.grade === grade && e.subject === subject)
  const groups = kindOrder.map((k) => [k, entries.filter((e) => e.kind === k).sort((a, b) => (a.part ?? 0) - (b.part ?? 0))] as const).filter(([, v]) => v.length)
  const mine = (lessons.data ?? []).filter((l) => l.grade === grade && l.subject === subject)
  const gLabel = grade === 'KG' ? t('kg') : `${t('grade')} ${num(grade, lang)}`
  return (
    <div>
      <div className="crumbs"><Link to="/">{t('appName')}</Link> › <Link to={`/grade/${grade}`}>{gLabel}</Link> › {bi(info)}</div>
      <h1 style={{ margin: '.2rem 0', color: info.color }}>{info.icon} {bi(info)} <span className="muted" style={{ fontSize: '1rem' }}>· {gLabel}</span></h1>
      <h2>{t('lessons')}</h2>
      {mine.length === 0 ? (
        <div className="notice">{t('noLessonsYet')} <a href="https://github.com/" target="_blank" rel="noreferrer">{t('contribute')} →</a></div>
      ) : (
        <div className="list">
          {mine.map((l) => (
            <Link key={l.id} to={`/lesson/${l.id}`} className="item">
              <div className="t"><div>{l.has3d ? '🧊 ' : ''}{l.hasVideo ? '🎬 ' : ''}{bi(l.title)}</div><div className="m">{bi(l.summary)} {l.duration_min ? `· ${num(l.duration_min, lang)} ${t('min')}` : ''} · {num(l.steps, lang)} steps</div></div>
              <span className="btn warn">▶ {t('start')}</span>
            </Link>
          ))}
        </div>
      )}
      {groups.map(([k, list]) => (
        <div key={k}>
          <h2>{bi(KINDS[k] ?? { my: k, en: k })}</h2>
          <div className="list">{list.map((e) => <BookRow key={e.id} e={e} />)}</div>
        </div>
      ))}
      {cat.data && entries.length === 0 && <div className="notice">—</div>}
    </div>
  )
}
