import { Link } from 'react-router-dom'

const CARD_FEATURES: Record<string, { icon: string; color: string; bg: string; title: string; desc: string; features: string[]; link: string; linkLabel: string }> = {
  file: {
    icon: 'fa-file-lines',
    color: 'var(--theme-color)',
    bg: 'rgba(2,101,163,0.07)',
    title: 'File an Application',
    desc: 'Submit a new Lemon Law application against a manufacturer or dealer. No account required.',
    features: ['New, used, or leased vehicles', '6-step guided process', 'No fee to file'],
    link: '/apply',
    linkLabel: 'Start your application',
  },
  lookup: {
    icon: 'fa-magnifying-glass',
    color: '#b45309',
    bg: 'rgba(249,168,37,0.09)',
    title: 'Look Up Application',
    desc: 'Check the status of a previously submitted application using your confirmation details.',
    features: ['Search by case number', 'Search by license plate', 'Search by personal details'],
    link: '/status',
    linkLabel: 'Look up your application',
  },
}

export default function Home() {
  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(2,101,163,0.07)', borderRadius: 20,
          padding: '5px 14px', marginBottom: 14,
        }}>
          <i className="fa-solid fa-scale-balanced" style={{ color: 'var(--theme-color)', fontSize: 13 }}></i>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--theme-color)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            OCABR — Commonwealth of Massachusetts
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
          fontWeight: 800,
          color: 'var(--theme-color)',
          margin: '0 0 10px',
          lineHeight: 1.2,
        }}>
          Vehicle Lemon Law Services
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ms-gray-dark)', margin: 0, lineHeight: 1.6 }}>
          File a new application or check the status of an existing one.
        </p>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {Object.entries(CARD_FEATURES).map(([key, card]) => (
          <div
            key={key}
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 14,
              padding: '28px 26px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              borderTop: `3px solid ${card.color}`,
              transition: 'transform 0.15s, box-shadow 0.15s',
              cursor: 'default',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            {/* Icon */}
            <div style={{
              width: 48, height: 48, borderRadius: 10,
              background: card.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <i className={`fa-solid ${card.icon}`} style={{ fontSize: 20, color: card.color }}></i>
            </div>

            {/* Text */}
            <div>
              <h2 style={{ fontSize: 'var(--text-base-med)', fontWeight: 700, color: 'var(--dark-color)', margin: '0 0 6px' }}>
                {card.title}
              </h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)', margin: 0, lineHeight: 1.65 }}>
                {card.desc}
              </p>
            </div>

            {/* Features */}
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {card.features.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: '#4b5563' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: 'var(--mass-primary-green)', fontSize: 14, flexShrink: 0 }}></i>
                  {f}
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div style={{ height: 1, background: '#f3f4f6', margin: '2px 0' }} />

            {/* CTA */}
            <Link
              to={card.link}
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                color: card.color,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'gap 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.gap = '10px')}
              onMouseLeave={e => (e.currentTarget.style.gap = '6px')}
            >
              {card.linkLabel}
              <i className="fa-solid fa-arrow-right" style={{ fontSize: 11 }}></i>
            </Link>
          </div>
        ))}
      </div>

      {/* Privacy notice */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        background: 'rgba(2,101,163,0.04)',
        border: '1px solid rgba(2,101,163,0.12)',
        borderRadius: 10,
        padding: '13px 18px',
      }}>
        <i className="fa-solid fa-shield-halved" style={{ color: 'var(--theme-color)', fontSize: 15, marginTop: 2, flexShrink: 0 }}></i>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)', margin: 0, lineHeight: 1.65 }}>
          Your information is protected under Massachusetts data privacy laws. All submissions are encrypted and handled by the{' '}
          <strong style={{ color: 'var(--dark-color)' }}>Office of Consumer Affairs and Business Regulation</strong>.
        </p>
      </div>

      {/* Mobile */}
      <style>{`
        @media (max-width: 600px) {
          .home-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
