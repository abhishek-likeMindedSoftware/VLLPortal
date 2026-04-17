import { useState } from 'react'
import { getSession } from '@/utils/storage'

const MILESTONES = [
  { key: 'SUBMITTED', label: 'Submitted', icon: 'fa-paper-plane' },
  { key: 'ACCEPTED', label: 'Accepted', icon: 'fa-check-circle' },
  { key: 'DEALER_RESPONDED', label: 'Dealer Responded', icon: 'fa-reply' },
  { key: 'HEARING_SCHEDULED', label: 'Hearing Scheduled', icon: 'fa-calendar' },
  { key: 'DECISION_ISSUED', label: 'Decision Issued', icon: 'fa-gavel' },
]

// Demo simulated status
const DEMO_STATUS = {
  caseNumber: 'LL-2026-00142',
  status: 'ACCEPTED',
  applicationType: 'New Car Lemon Law',
  submittedAt: 'April 10, 2026',
  lastActivity: 'April 14, 2026',
  notifications: [
    { date: 'Apr 14', message: 'Your application has been accepted. Dealer outreach has been initiated.' },
    { date: 'Apr 10', message: 'Application received. Case number LL-2026-00142 assigned.' },
  ]
}

export default function Status() {
  const { applicationId } = getSession()
  const [lookupId, setLookupId] = useState(applicationId ?? '')
  const [status, setStatus] = useState<typeof DEMO_STATUS | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLookup = async () => {
    if (!lookupId.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setStatus(DEMO_STATUS)
    setLoading(false)
  }

  const currentIdx = MILESTONES.findIndex(m => m.key === status?.status)

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 'var(--text-xl-med)', fontWeight: 800, color: 'var(--theme-color)', marginBottom: 8 }}>
          Application Status
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ms-gray-dark)' }}>
          Enter your Application ID or use the secure link from your confirmation email.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32, maxWidth: 480 }}>
        <input
          type="text" value={lookupId}
          onChange={e => setLookupId(e.target.value)}
          className="vll-input"
          placeholder="Application ID or case number"
          style={{ flex: 1 }}
        />
        <button onClick={handleLookup} disabled={loading} className="btn-theme" style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {loading ? <><i className="fa-solid fa-spinner fa-spin"></i></> : <><i className="fa-solid fa-magnifying-glass"></i> Look Up</>}
        </button>
      </div>

      {status && (
        <>
          {/* Case header */}
          <div className="vll-card" style={{ padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ms-gray-dark)', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Case Number</p>
                <h2 style={{ fontSize: 'var(--text-lg-med)', fontWeight: 800, color: 'var(--theme-color)', margin: '0 0 8px' }}>{status.caseNumber}</h2>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)', margin: 0 }}>{status.applicationType} · Submitted {status.submittedAt}</p>
              </div>
              <span className={`status-badge badge-${status.status.toLowerCase().replace('_', '-')}`} style={{ fontSize: 'var(--text-sm)', padding: '6px 16px' }}>
                {status.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Milestone timeline */}
          <div className="vll-card" style={{ padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 'var(--text-base-med)', fontWeight: 700, color: 'var(--dark-color)', marginBottom: 24 }}>Progress</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
              {MILESTONES.map((m, i) => {
                const done = i <= currentIdx
                const current = i === currentIdx
                return (
                  <div key={m.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    {i < MILESTONES.length - 1 && (
                      <div style={{ position: 'absolute', top: 16, left: '50%', width: '100%', height: 3, background: done && i < currentIdx ? 'var(--mass-primary-green)' : '#e5e7eb', zIndex: 0 }} />
                    )}
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: done ? (current ? 'var(--theme-color)' : 'var(--mass-primary-green)') : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative', flexShrink: 0 }}>
                      <i className={`fa-solid ${m.icon}`} style={{ color: done ? '#fff' : '#9ca3af', fontSize: 13 }}></i>
                    </div>
                    <p style={{ fontSize: 10, fontWeight: current ? 700 : 500, color: done ? 'var(--dark-color)' : '#9ca3af', textAlign: 'center', marginTop: 8, lineHeight: 1.3 }}>
                      {m.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Notifications */}
          <div className="vll-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 'var(--text-base-med)', fontWeight: 700, color: 'var(--dark-color)', marginBottom: 16 }}>Notifications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {status.notifications.map((n, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: 12, borderBottom: i < status.notifications.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(2,101,163,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="fa-solid fa-bell" style={{ color: 'var(--theme-color)', fontSize: 14 }}></i>
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ms-gray-dark)', margin: '0 0 4px', fontWeight: 600 }}>{n.date}</p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--dark-color)', margin: 0, lineHeight: 1.6 }}>{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
