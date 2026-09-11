import { Link, Outlet } from 'react-router-dom'
import { useSettings, useT } from './i18n'

export default function App() {
  const { t } = useT()
  const { lang, setLang, use3D, setUse3D } = useSettings()
  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand"><img src={`${import.meta.env.BASE_URL}icons/icon.svg`} alt="" />{t('appName')}</Link>
        <span className="spacer" />
        <button className={`chip ${use3D ? 'active' : ''}`} onClick={() => setUse3D(!use3D)} title={t('twoD')}>{t('threeD')} {use3D ? t('on') : t('off')}</button>
        <button className={`chip ${lang === 'my' ? 'active' : ''}`} onClick={() => setLang('my')}>မြန်မာ</button>
        <button className={`chip ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
      </header>
      <main><Outlet /></main>
      <footer>{t('license')} · <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a></footer>
    </div>
  )
}
