import { useEffect, useRef, useState } from 'react'
import { LANGUAGES } from './translate'

export default function LanguageSwitcher({ value, onChange, busy }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const current = LANGUAGES.find((l) => l.code === value) || LANGUAGES[0]

  // Close on outside click and on Escape, as a menu is expected to.
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="lang" ref={rootRef}>
      <button
        type="button"
        className="lang__btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${current.label}. Change language`}
      >
        <span className="lang__globe" aria-hidden="true" />
        <span className="lang__current">{current.native}</span>
        {busy && <span className="lang__spinner" aria-hidden="true" />}
        <span className="lang__caret" aria-hidden="true" />
      </button>

      {open && (
        <ul className="lang__menu" role="listbox" aria-label="Choose a language">
          {LANGUAGES.map((l) => (
            <li key={l.code} role="none">
              <button
                type="button"
                role="option"
                aria-selected={l.code === value}
                className={`lang__opt${l.code === value ? ' lang__opt--active' : ''}`}
                onClick={() => {
                  onChange(l.code)
                  setOpen(false)
                }}
              >
                <span className="lang__native">{l.native}</span>
                <span className="lang__latin">{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
