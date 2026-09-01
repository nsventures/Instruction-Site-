import { useEffect, useMemo, useState } from 'react'
import { sections, title } from './data'
import ShotPanel from './ShotPanel'
import LanguageSwitcher from './LanguageSwitcher'
import { isRtl, translateAll } from './translate'
import './App.css'

// Every English string the page renders, gathered once so a language change is
// a single batched translation request rather than one per visible element.
const SOURCE_STRINGS = [
  title,
  ...sections.flatMap((s) => [s.label, ...(s.shots ? s.shots.flatMap((x) => [x.label, x.brief]) : [s.brief])]),
].filter(Boolean)

export default function App() {
  const [sectionId, setSectionId] = useState(sections[0].id)
  const [shotIds, setShotIds] = useState({})
  const [lang, setLang] = useState('en')
  const [dicts, setDicts] = useState({})
  const [busy, setBusy] = useState(false)
  const [failedLang, setFailedLang] = useState(null)

  // Fetching from the change handler rather than an effect: the translation is
  // a response to the user picking a language, not state to synchronise.
  const changeLang = async (code) => {
    setLang(code)
    if (code === 'en' || dicts[code]) return
    setBusy(true)
    setFailedLang(null)
    try {
      const d = await translateAll(SOURCE_STRINGS, code)
      setDicts((prev) => ({ ...prev, [code]: d }))
    } catch {
      // Leave the English copy in place rather than showing a broken page.
      setFailedLang(code)
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = isRtl(lang) ? 'rtl' : 'ltr'
  }, [lang])

  // Falls back to the original English whenever a string has no translation.
  const dict = dicts[lang]
  const t = useMemo(() => (s) => (dict && dict[s]) || s, [dict])
  const failed = failedLang === lang

  const section = sections.find((s) => s.id === sectionId)
  const shots = section.shots
  const shotId = shots ? (shotIds[section.id] ?? shots[0].id) : null
  const shot = shots ? shots.find((s) => s.id === shotId) : null
  const active = shot ?? section

  return (
    <div className={`app${busy ? ' app--busy' : ''}`}>
      <header className="header">
        <LanguageSwitcher value={lang} onChange={changeLang} busy={busy} />
        <h1 className="header__title">{t(title)}</h1>
        {failed && (
          <p className="header__notice" role="status">
            Translation unavailable right now — showing English.
          </p>
        )}
      </header>

      <nav className="tabs" role="tablist" aria-label="Shoot sections">
        {sections.map((s) => (
          <button
            key={s.id}
            role="tab"
            id={`tab-${s.id}`}
            aria-selected={s.id === sectionId}
            aria-controls={`panel-${s.id}`}
            className={`tab${s.id === sectionId ? ' tab--active' : ''}`}
            onClick={() => setSectionId(s.id)}
          >
            {t(s.label)}
          </button>
        ))}
      </nav>

      <main className="content" role="tabpanel" id={`panel-${section.id}`} aria-labelledby={`tab-${section.id}`}>
        {shots && (
          <nav className="subtabs" role="tablist" aria-label={`${section.label} shots`}>
            {shots.map((s) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={s.id === shotId}
                className={`subtab${s.id === shotId ? ' subtab--active' : ''}`}
                onClick={() => setShotIds((prev) => ({ ...prev, [section.id]: s.id }))}
              >
                {t(s.label)}
              </button>
            ))}
          </nav>
        )}

        <ShotPanel
          key={active.id}
          label={t(active.label)}
          brief={t(active.brief)}
          videoId={active.videoId}
        />
      </main>
    </div>
  )
}
