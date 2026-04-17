import { useState, useRef, useEffect } from 'react'

interface Props {
  onSkipToMain: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export default function OfficialBanner({ onSkipToMain }: Props) {
  const [expanded, setExpanded] = useState(false)
  const detailsRef = useRef<HTMLDivElement>(null)

  // Animate the collapse panel height
  useEffect(() => {
    const el = detailsRef.current
    if (!el) return
    if (expanded) {
      el.style.maxHeight = el.scrollHeight + 'px'
      el.style.opacity = '1'
    } else {
      el.style.maxHeight = '0px'
      el.style.opacity = '0'
    }
  }, [expanded])

  return (
    <section className="official-banner" aria-label="Official government website">
      <div className="official-banner__inner">
        <div className="official-banner__bar">
          <div className="official-banner__left">
            <i className="fa-solid fa-shield" aria-hidden="true" style={{ fontSize: 13 }}></i>
            <span>
              An official website of the{' '}
              <strong>Commonwealth of Massachusetts</strong>
              {' '}
              <button
                type="button"
                className="official-banner__toggle"
                onClick={() => setExpanded(e => !e)}
                aria-expanded={expanded}
                aria-controls="official-banner-info"
              >
                Here's how you know{' '}
                <i
                  className="fa-solid fa-chevron-down"
                  aria-hidden="true"
                  style={{
                    fontSize: 11,
                    transition: 'transform 0.2s',
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    display: 'inline-block',
                  }}
                ></i>
              </button>
            </span>
          </div>

          <div className="official-banner__right">
            <a
              href="#main-content"
              className="app-skip-link app-skip-link-inline"
              onClick={onSkipToMain}
            >
              Skip to main content
            </a>
          </div>
        </div>

        {/* Collapsible details panel */}
        <div
          id="official-banner-info"
          ref={detailsRef}
          role="region"
          aria-label="How to identify an official website"
          style={{
            maxHeight: 0,
            opacity: 0,
            overflow: 'hidden',
            transition: 'max-height 0.3s ease, opacity 0.25s ease',
          }}
        >
          <div className="official-banner__details">
            <div className="official-banner__detail-item">
              <div style={{ width: 20, display: 'flex', justifyContent: 'center', paddingTop: 2, flexShrink: 0 }}>
                <i className="fa-solid fa-landmark" aria-hidden="true"></i>
              </div>
              <p>
                <strong>Official websites use .mass.gov</strong>
                <br />
                <small>
                  A .mass.gov website belongs to an official government organization in Massachusetts.
                </small>
              </p>
            </div>
            <div className="official-banner__detail-item">
              <div style={{ width: 20, display: 'flex', justifyContent: 'center', paddingTop: 2, flexShrink: 0 }}>
                <i className="fa-solid fa-lock" aria-hidden="true"></i>
              </div>
              <p>
                <strong>Secure websites use HTTPS</strong>
                <br />
                <small>
                  A lock icon (<i className="fa-solid fa-lock" style={{ fontSize: 11 }}></i>) or https:// means you've safely connected to the official website.
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
