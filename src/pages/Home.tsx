import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 20px' }}>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 'var(--text-xl-med)', fontWeight: 800, color: 'var(--dark-color)', margin: '0 0 10px' }}>
          Vehicle Lemon Law Services
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ms-gray-dark)', margin: 0 }}>
          File a new application or check the status of an existing one.
        </p>
      </div>

      {/* Two cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>

        {/* Card 1 — File */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: '32px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          transition: 'box-shadow 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)')}
        >
          {/* Icon */}
          <div style={{
            width: 52, height: 52, borderRadius: 10,
            background: 'rgba(2,101,163,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="fa-solid fa-file-lines" style={{ fontSize: 22, color: 'var(--theme-color)' }}></i>
          </div>

          <div>
            <h2 style={{ fontSize: 'var(--text-base-med)', fontWeight: 700, color: 'var(--dark-color)', margin: '0 0 6px' }}>
              File an Application
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)', margin: 0, lineHeight: 1.6 }}>
              Submit a new Lemon Law application against a manufacturer or dealer. No account required.
            </p>
          </div>

          {/* Feature list */}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['New, used, or leased vehicles', '6-step guided process', 'No fee to file'].map(item => (
              <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)' }}>
                <i className="fa-solid fa-circle-check" style={{ color: 'var(--mass-primary-green)', fontSize: 15, flexShrink: 0 }}></i>
                {item}
              </li>
            ))}
          </ul>

          <Link
            to="/apply"
            style={{
              marginTop: 4,
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              color: 'var(--theme-color)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Start your application
            <i className="fa-solid fa-arrow-right" style={{ fontSize: 12 }}></i>
          </Link>
        </div>

        {/* Card 2 — Look Up */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: '32px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          transition: 'box-shadow 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)')}
        >
          {/* Icon */}
          <div style={{
            width: 52, height: 52, borderRadius: 10,
            background: 'rgba(249,168,37,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="fa-solid fa-magnifying-glass" style={{ fontSize: 22, color: '#b45309' }}></i>
          </div>

          <div>
            <h2 style={{ fontSize: 'var(--text-base-med)', fontWeight: 700, color: 'var(--dark-color)', margin: '0 0 6px' }}>
              Look Up Filed Application
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)', margin: 0, lineHeight: 1.6 }}>
              Check the status of a previously submitted application using your confirmation details.
            </p>
          </div>

          {/* Feature list */}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Search by case number', 'Search by license plate', 'Search by personal details'].map(item => (
              <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)' }}>
                <i className="fa-solid fa-circle-check" style={{ color: 'var(--mass-primary-green)', fontSize: 15, flexShrink: 0 }}></i>
                {item}
              </li>
            ))}
          </ul>

          <Link
            to="/status"
            style={{
              marginTop: 4,
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              color: 'var(--theme-color)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Look up your application
            <i className="fa-solid fa-arrow-right" style={{ fontSize: 12 }}></i>
          </Link>
        </div>
      </div>

      {/* Privacy notice */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        background: 'rgba(2,101,163,0.04)',
        border: '1px solid rgba(2,101,163,0.15)',
        borderRadius: 10,
        padding: '14px 18px',
      }}>
        <i className="fa-solid fa-shield-halved" style={{ color: 'var(--theme-color)', fontSize: 16, marginTop: 2, flexShrink: 0 }}></i>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)', margin: 0, lineHeight: 1.6 }}>
          Your information is protected under Massachusetts data privacy laws. All submissions are encrypted and handled by the{' '}
          <strong style={{ color: 'var(--dark-color)' }}>Office of Consumer Affairs and Business Regulation</strong>.
        </p>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 640px) {
          .home-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
