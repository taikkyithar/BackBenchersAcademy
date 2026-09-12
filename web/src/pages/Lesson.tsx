import { Suspense, lazy, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { loadLesson, useAsync, type LessonStep } from '../data/catalog'
import { subjectInfo } from '../data/curriculum'
import { useT, num } from '../i18n'

const SceneOrFallback = lazy(() => import('../scenes').then((m) => ({ default: m.SceneOrFallback })))

function readProgress(id: string) { try { return Number(localStorage.getItem(`progress:${id}`) || 0) } catch { return 0 } }
function writeProgress(id: string, i: number) { try { localStorage.setItem(`progress:${id}`, String(i)) } catch { /* ignore */ } }

function Quiz({ step, onDone }: { step: Extract<LessonStep, { type: 'quiz' }>; onDone: () => void }) {
  const { t, bi } = useT()
  const [picked, setPicked] = useState<number | null>(null)
  const right = picked === step.answer
  return (
    <div className="quiz">
      <div className="narration">{bi(step.question)}</div>
      {step.choices.map((c, i) => (
        <button key={i} className={`choice ${picked === i ? (right ? 'right' : 'wrong') : ''}`} onClick={() => { setPicked(i); if (i === step.answer) onDone() }}>{bi(c)}</button>
      ))}
      {picked !== null && <div className="notice" style={{ borderColor: right ? 'var(--ok)' : 'var(--bad)' }}>{right ? t('correct') : t('wrong')} {right && step.explain ? bi(step.explain) : ''}</div>}
    </div>
  )
}

function Video({ url, provider }: { url: string | null; provider?: string }) {
  const { t } = useT()
  if (!url) return <div className="notice">{t('videoWanted')}</div>
  const yt = provider === 'youtube' || /youtu\.?be/.test(url)
  const src = yt ? url.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/') : url
  return yt ? <iframe className="video" src={src} title="video" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <video className="video" src={src} controls playsInline />
}

export default function LessonPage() {
  const { id = '' } = useParams()
  const { t, lang, bi } = useT()
  const lesson = useAsync(() => loadLesson(id), [id])
  const [i, setI] = useState(0)
  const [quizOk, setQuizOk] = useState(false)
  useEffect(() => { setI(Math.min(readProgress(id), 9999)) }, [id])
  useEffect(() => { setQuizOk(false) }, [i])
  if (lesson.error) return <div className="notice">{lesson.error}</div>
  if (!lesson.data) return <div className="notice">{t('loading')}</div>
  const L = lesson.data
  const cur = Math.min(i, L.steps.length - 1)
  const step = L.steps[cur]
  const info = subjectInfo(L.subject)
  const gLabel = L.grade === 'KG' ? t('kg') : `${t('grade')} ${num(L.grade, lang)}`
  const go = (n: number) => { const k = Math.max(0, Math.min(L.steps.length - 1, n)); setI(k); writeProgress(id, k) }
  const stepLabel = { text: t('readingText'), video: t('videoExplainer'), scene: t('scene3d'), quiz: t('quiz') }[step.type]
  const canNext = step.type !== 'quiz' || quizOk
  return (
    <div className="player">
      <div className="crumbs"><Link to="/">{t('appName')}</Link> › <Link to={`/grade/${L.grade}`}>{gLabel}</Link> › <Link to={`/grade/${L.grade}/${L.subject}`}>{bi(info)}</Link></div>
      <h1 style={{ margin: 0 }}>{bi(L.title)}</h1>
      {L.summary && <div className="muted">{bi(L.summary)}</div>}
      {L.textbook_ref?.catalog_id && <div className="muted">{t('textbookRef')}: <Link to={`/read/${L.textbook_ref.catalog_id}`}>{L.textbook_ref.chapter ? `${lang === 'my' ? 'အခန်း' : 'Chapter'} ${num(L.textbook_ref.chapter, lang)}` : t('read')}{L.textbook_ref.pages ? ` · ${t('pages')} ${num(L.textbook_ref.pages, lang)}` : ''}</Link></div>}
      <div className="steps">{L.steps.map((_, k) => <span key={k} className={`dot ${k < cur ? 'done' : k === cur ? 'cur' : ''}`} onClick={() => go(k)} style={{ cursor: 'pointer' }} />)}</div>
      <div className="row"><span className="badge">{stepLabel}</span> {'title' in step && step.title && <strong>{bi(step.title)}</strong>}</div>
      {step.type === 'text' && <div className="narration" style={{ whiteSpace: 'pre-line' }}>{bi(step.body)}</div>}
      {step.type === 'video' && <Video url={step.url} provider={step.provider} />}
      {step.type === 'scene' && <><Suspense fallback={<div className="scene small" />}><SceneOrFallback name={step.scene} params={step.params} /></Suspense>{step.narration && <div className="narration">{bi(step.narration)}</div>}</>}
      {step.type === 'quiz' && <Quiz key={cur} step={step} onDone={() => setQuizOk(true)} />}
      <div className="row">
        <button className="btn secondary" disabled={cur === 0} onClick={() => go(cur - 1)}>‹ {t('prev')}</button>
        <span className="muted">{num(cur + 1, lang)} / {num(L.steps.length, lang)}</span>
        {cur < L.steps.length - 1
          ? <button className="btn" disabled={!canNext} onClick={() => go(cur + 1)}>{t('next')} ›</button>
          : <Link className="btn warn" to={`/grade/${L.grade}/${L.subject}`} onClick={() => writeProgress(id, 0)}>✓ {t('finish')}</Link>}
        <span className="spacer" />
        <button className="chip" onClick={() => go(0)}>{t('restart')}</button>
      </div>
    </div>
  )
}
