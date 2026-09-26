import { useEffect } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useSettings, useT } from './i18n'
import { REPO_URL } from './data/catalog'

export default function App() {
  const { t } = useT()
  const { lang, setLang, use3D, setUse3D } = useSettings()
  const nav = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault()
        if (location.pathname !== '/search') {
          nav('/search')
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nav, location.pathname])

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand"><img src={`${import.meta.env.BASE_URL}icons/icon.svg`} alt="" />{t('appName')}</Link>
        <span className="spacer" />
        <Link to="/search" className={`chip search-chip ${location.pathname === '/search' ? 'active' : ''}`} title={`${t('search')} (/)`}>
          🔍 {t('search')}
        </Link>
        <button className={`chip ${use3D ? 'active' : ''}`} onClick={() => setUse3D(!use3D)} title={t('twoD')}>{t('threeD')} {use3D ? t('on') : t('off')}</button>
        <button className={`chip ${lang === 'my' ? 'active' : ''}`} onClick={() => setLang('my')}>မြန်မာ</button>
        <button className={`chip ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
      </header>
      <main><Outlet /></main>
      <footer>{t('license')} · <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub</a></footer>
    </div>
  )
}
