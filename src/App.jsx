import { useState } from 'react'
import { sections, title } from './data'
import ShotPanel from './ShotPanel'
import './App.css'

export default function App() {
  const [sectionId, setSectionId] = useState(sections[0].id)
  const section = sections.find((s) => s.id === sectionId)

  // Sub-tab selection is tracked per section so switching away and back
  // returns you to the shot you were last looking at.
  const [shotIds, setShotIds] = useState({})
  const shots = section.shots
  const shotId = shots ? (shotIds[section.id] ?? shots[0].id) : null
  const shot = shots ? shots.find((s) => s.id === shotId) : null

  return (
    <div className="app">
      <header className="header">
        <h1 className="header__title">{title}</h1>
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
            {s.label}
          </button>
        ))}
      </nav>

      <main className="content" role="tabpanel" id={`panel-${section.id}`} aria-labelledby={`tab-${section.id}`}>
        {shots ? (
          <>
            <nav className="subtabs" role="tablist" aria-label={`${section.label} shots`}>
              {shots.map((s) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={s.id === shotId}
                  className={`subtab${s.id === shotId ? ' subtab--active' : ''}`}
                  onClick={() => setShotIds((prev) => ({ ...prev, [section.id]: s.id }))}
                >
                  {s.label}
                </button>
              ))}
            </nav>
            <ShotPanel {...shot} />
          </>
        ) : (
          <ShotPanel {...section} />
        )}
      </main>
    </div>
  )
}
