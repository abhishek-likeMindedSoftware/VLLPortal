import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getSession, saveSession } from '@/utils/storage'
import { getPortalStatus } from '@/services/applicationService'

const MILESTONES = [
  { key: 'SUBMITTED',        label: 'Submitted',        icon: 'fa-paper-plane' },
  { key: 'ACCEPTED',         label: 'Accepted',         icon: 'fa-check-circle' },
  { key: 'DEALER_RESPONDED', label: 'Dealer Responded', icon: 'fa-reply' },
  { key: 'HEARING_SCHEDULED',label: 'Hearing Scheduled',icon: 'fa-calendar' },
  { key: 'DECISION_ISSUED',  label: 'Decision Issued',  icon: 'fa-gavel' },
]

const STATUS_LABELS: Record<string, string> = {
  SUBMITTED:         'Submitted',
  INCOMPLETE:        'Incomplete — Action Required',
  ACCEPTED:          'Accepted',
  DEALER_RESPONDED:  'Dealer Responded',
  HEARING_SCHEDULED: 'Hearing Scheduled',
  HEARING_COMPLETE:  'Hearing Complete',
  DECISION_ISSUED:   'Decision Issued',
  WITHDRAWN:         'Withdrawn',
  CLOSED:            'Closed',
}

interface PortalStatus {
  applicationId: string
  caseNumber: string
  status: string
  applicationTypeFriendly?: string
  submittedAt: string
  milestones?: Array<{ key: string; label: string; completedAt?: string }>
}

export default function Status() {
  const [searchParams] = useSearchParams()
  const session = getSession()

  // Token link from email: /status?applicationId=<guid>&token=<cleartext>
  const urlApplicationId = searchParams.get('applicationId')
  const urlToken         = searchParams.get('token')

  const [lookupId, setLookupId] = useState(urlApplicationId ?? session.applicationId ?? '')
  const [status, setStatus]     = useState<PortalStatus | null>(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const fetchStatus = async (appId: string, token?: string | null) => {
    setLoading(true)
    setError(null)
    try {
      // If a token came from the URL, persist it so subsequent API calls use it
      if (token) saveSession(appId, token)

      const res = await getPortalStatus(appId, token ?? undefined)
      if (res.success) {
        setStatus(res.data)
      } else {
        setError(res.message ?? 'Unable to retrieve application status.')
      }
    } catch {
      setError('Unable to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch when arriving via email link
  useEffect(() => {
    if (urlApplicationId) {
      fetchStatus(urlApplicationId, urlToken)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLookup = () => {
    if (!lookupId.trim()) return
    fetchStatus(lookupId.trim(), session.token ?? undefined)
  }

  const currentIdx = MILESTONES.findIndex(m => m.key === status?.status)

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 'var(--text-xl-med)', fontWeight: 800, color: 'var(--theme-color)', marginBottom: 8 }}>
          Application Status
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ms-gray-dark)' }}>
          Use the secure link from your confirmation email, or enter your Application ID below.
        </p>
      </div>

      {/* Manual lookup — hidden if we already loaded via URL token */}
      {!status && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, maxWidth: 480 }}>
          <input
            type="text"
            value={lookupId}
            onChange={e => setLookupId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLookup()}
            className="vll-input"
            placeholder="Application ID (paste from email)"
            style={{ flex: 1 }}
            aria-label="Application ID"
          />
          <button
            onClick={handleLookup}
            disabled={loading}
            className="btn-theme"
            style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            {loading
              ? <i className="fa-solid fa-spinner fa-spin"></i>
              : <><i className="fa-solid fa-magnifying-glass"></i> Look Up</>}
          </button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--ms-gray-dark)' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 28, marginBottom: 12 }}></i>
          <p>Loading your application status…</p>
        </div>
      )}

      {error && !loading && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '16px 20px', color: '#991b1b', marginBottom: 24 }}>
          <i className="fa-solid fa-circle-exclamation" style={{ marginRight: 8 }}></i>
          {error}
        </div>
      )}

      {status && !loading && (
        <>
          {/* Case header */}
          <div className="vll-card" style={{ padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ms-gray-dark)', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Case Number</p>
                <h2 style={{ fontSize: 'var(--text-lg-med)', fontWeight: 800, color: 'var(--theme-color)', margin: '0 0 8px' }}>
                  {status.caseNumber}
                </h2>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)', margin: 0 }}>
                  {status.applicationTypeFriendly} · Submitted {new Date(status.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <span
                className={`status-badge badge-${status.status.toLowerCase().replace(/_/g, '-')}`}
                style={{ fontSize: 'var(--text-sm)', padding: '6px 16px' }}
              >
                {STATUS_LABELS[status.status] ?? status.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Milestone timeline */}
          <div className="vll-card" style={{ padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 'var(--text-base-med)', fontWeight: 700, color: 'var(--dark-color)', marginBottom: 24 }}>Progress</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
              {MILESTONES.map((m, i) => {
                const done    = i <= currentIdx
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

          {/* Look up a different application */}
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <button
              onClick={() => { setStatus(null); setError(null) }}
              style={{ background: 'none', border: 'none', color: 'var(--theme-color)', fontSize: 'var(--text-sm)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Look up a different application
            </button>
          </div>
        </>
      )}
    </div>
  )
}
