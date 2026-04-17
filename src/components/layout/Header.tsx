import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="massgov-banner">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="gov-logo">
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--theme-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
            MA
          </div>
          <span>Mass.gov</span>
        </div>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ms-gray-dark)' }}>
          OCABR — Vehicle Lemon Law Program
        </div>
      </div>
    </header>
  )
}
