import { useState, useEffect, useRef } from 'react'
import logo from '@/assets/logo.png'

// ── High Contrast Toggle ──────────────────────────────────────────────────────
function HighContrastToggle() {
  const [on, setOn] = useState(() => sessionStorage.getItem('vll_high_contrast') === 'true')

  useEffect(() => {
    if (on) document.body.classList.add('high-contrast')
    else document.body.classList.remove('high-contrast')
  }, [on])

  const toggle = () => {
    const next = !on
    setOn(next)
    sessionStorage.setItem('vll_high_contrast', String(next))
    if (next) document.body.classList.add('high-contrast')
    else document.body.classList.remove('high-contrast')
  }

  return (
    <button
      onClick={toggle}
      className="header-ctrl-btn"
      aria-label={on ? 'Disable high contrast' : 'Enable high contrast'}
      title={on ? 'Disable high contrast' : 'Enable high contrast'}
      aria-pressed={on}
    >
      <i className={`fa-solid ${on ? 'fa-circle-half-stroke' : 'fa-adjust'}`}></i>
    </button>
  )
}

// ── Text Size Controller ──────────────────────────────────────────────────────
type TextSize = 'small' | 'normal' | 'large'
const SIZE_MAP: Record<TextSize, number> = { small: 13, normal: 16, large: 20 }
const SIZE_LABELS: Record<TextSize, string> = { small: 'Small', normal: 'Normal', large: 'Large' }

function TextSizeController() {
  const [size, setSize] = useState<TextSize>(() => {
    const s = sessionStorage.getItem('vll_text_size')
    return (s as TextSize) || 'normal'
  })
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.style.fontSize = `${SIZE_MAP[size]}px`
  }, [size])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = (s: TextSize) => {
    setSize(s)
    sessionStorage.setItem('vll_text_size', s)
    document.documentElement.style.fontSize = `${SIZE_MAP[s]}px`
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="header-ctrl-btn"
        aria-label={`Text size: ${SIZE_LABELS[size]}`}
        title={`Text size: ${SIZE_LABELS[size]}`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <i className="fa-solid fa-text-height"></i>
      </button>
      {open && (
        <div className="header-ctrl-dropdown" role="listbox" aria-label="Text size options">
          {(Object.keys(SIZE_MAP) as TextSize[]).map(s => (
            <button
              key={s}
              role="option"
              aria-selected={size === s}
              onClick={() => select(s)}
              className={`header-ctrl-dropdown-item${size === s ? ' selected' : ''}`}
            >
              {SIZE_LABELS[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Language Switcher ─────────────────────────────────────────────────────────
type Lang = 'en' | 'es'
const LANG_LABELS: Record<Lang, string> = { en: 'English (US)', es: 'Español (ES)' }

function LanguageSwitcher() {
  const [lang, setLang] = useState<Lang>(() => (sessionStorage.getItem('vll_lang') as Lang) || 'en')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = (l: Lang) => {
    setLang(l)
    sessionStorage.setItem('vll_lang', l)
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="header-ctrl-btn"
        aria-label={`Language: ${LANG_LABELS[lang]}`}
        title={`Language: ${LANG_LABELS[lang]}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        style={{ gap: 5, paddingLeft: 10, paddingRight: 10 }}
      >
        <i className="fa-solid fa-globe" style={{ fontSize: 13 }}></i>
        <span style={{ fontSize: 12, fontWeight: 600 }}>{lang.toUpperCase()}</span>
      </button>
      {open && (
        <div className="header-ctrl-dropdown" role="listbox" aria-label="Language options" style={{ minWidth: 140, right: 0, left: 'auto' }}>
          {(Object.keys(LANG_LABELS) as Lang[]).map(l => (
            <button
              key={l}
              role="option"
              aria-selected={lang === l}
              onClick={() => select(l)}
              className={`header-ctrl-dropdown-item${lang === l ? ' selected' : ''}`}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Header ────────────────────────────────────────────────────────────────────
export default function Header() {
  return (
    <header className="massgov-banner">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Left — Logo + Mass.gov */}
        <div className="gov-logo">
          <img src={logo} alt="Commonwealth of Massachusetts" style={{ width: 65, height: 65, objectFit: 'contain' }} />
          <span style={{ fontSize: '1.4rem', color: '#388557', fontWeight: 500, WebkitTextStroke: '1px #388557' }}>Mass.gov</span>
        </div>

        {/* Right — OCABR label + separator + controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ms-gray-dark)', marginRight: 16 }}>
            OCABR — Vehicle Lemon Law Program
          </span>

          {/* Separator */}
          <div style={{ width: 1, height: 22, background: '#d1d5db', marginRight: 12 }} aria-hidden="true" />

          {/* Accessibility + Language controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <TextSizeController />
            <HighContrastToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
