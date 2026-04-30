import { Link } from 'react-router-dom'

const CARDS = [
  {
    icon: 'fa-file-lines',
    color: 'var(--theme-color)',
    bg: 'rgba(2,101,163,0.07)',
    title: 'File an Application',
    desc: 'Submit a new Lemon Law application against a manufacturer or dealer. No account required.',
    features: ['New, used, or leased vehicles', '6-step guided process', 'No fee to file'],
    link: '/apply',
    linkLabel: 'Start your application',
  },
  {
    icon: 'fa-magnifying-glass',
    color: '#b45309',
    bg: 'rgba(249,168,37,0.09)',
    title: 'Look Up Application',
    desc: 'Check the status of a previously submitted application using your confirmation details.',
    features: ['Search by case number', 'Search by license plate', 'Search by personal details'],
    link: '/status',
    linkLabel: 'Look up your application',
  },
]

export default function Home() {
  return (
    <div className="wizard-shell-container" style={{ maxWidth: 1100, width: '100%' }}>

      {/* Header — matches wizard step style */}
      <div className="vll-card" style={{ padding: '28px 36px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(2,101,163,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fa-solid fa-scale-balanced" style={{ color: 'var(--theme-color)', fontSize: 18 }}></i>
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--text-lg-med)', fontWeight: 700, color: 'var(--theme-color)', margin: '0 0 3px', lineHeight: 1.2 }}>
              Vehicle Lemon Law Services
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)', margin: 0 }}>
              OCABR — Commonwealth of Massachusetts
            </p>
          </div>
        </div>
      </div>

      {/* Action cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {CARDS.map(card => (
          <div
            key={card.title}
            className="vll-card"
            style={{
              padding: '24px 26px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              borderTop: `3px solid ${card.color}`,
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 10, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className={`fa-solid ${card.icon}`} style={{ fontSize: 18, color: card.color }}></i>
            </div>

            <div>
              <h2 style={{ fontSize: 'var(--text-base-med)', fontWeight: 700, color: 'var(--dark-color)', margin: '0 0 5px' }}>
                {card.title}
              </h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)', margin: 0, lineHeight: 1.65 }}>
                {card.desc}
              </p>
            </div>

            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {card.features.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: '#4b5563' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: 'var(--mass-primary-green)', fontSize: 13, flexShrink: 0 }}></i>
                  {f}
                </li>
              ))}
            </ul>

            <div style={{ height: 1, background: '#f3f4f6' }} />

            <Link
              to={card.link}
              style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: card.color, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'gap 0.15s' }}
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
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: 'rgba(2,101,163,0.04)', border: '1px solid rgba(2,101,163,0.12)', borderRadius: 10, padding: '12px 18px' }}>
        <i className="fa-solid fa-shield-halved" style={{ color: 'var(--theme-color)', fontSize: 14, marginTop: 2, flexShrink: 0 }}></i>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)', margin: 0, lineHeight: 1.65 }}>
          Your information is protected under Massachusetts data privacy laws. All submissions are encrypted and handled by the{' '}
          <strong style={{ color: 'var(--dark-color)' }}>Office of Consumer Affairs and Business Regulation</strong>.
        </p>
      </div>

    </div>
  )
}
