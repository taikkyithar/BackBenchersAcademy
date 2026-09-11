import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { readerUrl, useCatalog, viewUrl } from '../data/catalog'
import { KINDS, subjectInfo } from '../data/curriculum'
import { useT, num } from '../i18n'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

export default function ReaderPage() {
  const { id = '' } = useParams()
  const { t, lang, bi } = useT()
  const cat = useCatalog()
  const entry = cat.data?.entries.find((e) => e.id === id)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [doc, setDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'blocked'>('idle')

  useEffect(() => {
    if (!entry) return
    let cancelled = false
    setStatus('loading')
    const f = entry.files.find((x) => !x.drive_id) ?? entry.files[0]
    const url = readerUrl(f)
    if (!url) { setStatus('blocked'); return }
    pdfjsLib.getDocument({ url, withCredentials: false }).promise
      .then((d) => { if (!cancelled) { setDoc(d); setStatus('ok'); setPage(1) } })
      .catch(() => { if (!cancelled) setStatus('blocked') })
    return () => { cancelled = true }
  }, [entry])

  useEffect(() => {
    if (!doc || !canvas.current) return
    let cancelled = false
    doc.getPage(page).then(async (p) => {
      if (cancelled || !canvas.current) return
      const width = Math.min(window.innerWidth - 32, 900)
      const vp0 = p.getViewport({ scale: 1 })
      const scale = (width / vp0.width) * Math.min(window.devicePixelRatio || 1, 2)
      const vp = p.getViewport({ scale })
      const c = canvas.current
      c.width = vp.width; c.height = vp.height; c.style.width = `${width}px`
      await p.render({ canvasContext: c.getContext('2d')!, viewport: vp, canvas: c }).promise
    })
    return () => { cancelled = true }
  }, [doc, page])

  if (cat.error) return <div className="notice">{cat.error}</div>
  if (!entry) return <div className="notice">{t('loading')}</div>
  const info = subjectInfo(entry.subject)
  const gLabel = entry.grade === 'KG' ? t('kg') : `${t('grade')} ${num(entry.grade, lang)}`
  return (
    <div>
      <div className="crumbs"><Link to="/">{t('appName')}</Link> › <Link to={`/grade/${entry.grade}`}>{gLabel}</Link> › <Link to={`/grade/${entry.grade}/${entry.subject}`}>{bi(info)}</Link> › {bi(KINDS[entry.kind] ?? { my: entry.kind, en: entry.kind })}{entry.part ? ` ${num(entry.part, lang)}` : ''}</div>
      <div className="row" style={{ margin: '.4rem 0' }}>
        <a className="btn secondary" href={viewUrl(entry.files[0])} target="_blank" rel="noreferrer">⬇ {t('openOriginal')}</a>
        {doc && <>
          <button className="btn secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>‹ {t('prev')}</button>
          <span className="muted">{t('page')} {num(page, lang)} / {num(doc.numPages, lang)}</span>
          <button className="btn secondary" disabled={page >= doc.numPages} onClick={() => setPage(page + 1)}>{t('next')} ›</button>
        </>}
      </div>
      {status === 'loading' && <div className="notice">{t('loading')}</div>}
      {status === 'blocked' && <div className="notice">{t('unavailableInApp')} <a href={viewUrl(entry.files[0])} target="_blank" rel="noreferrer">{entry.files[0].url}</a></div>}
      <div className="reader" hidden={status !== 'ok'}><canvas ref={canvas} /></div>
    </div>
  )
}
