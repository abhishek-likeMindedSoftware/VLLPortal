import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getSession, saveSession } from '@/utils/storage'
import { getPortalStatus, getPortalDocuments, uploadPortalDocument } from '@/services/applicationService'
import { toast } from 'react-toastify'

const MILESTONES = [
  { key: 'SUBMITTED',         label: 'Submitted',         icon: 'fa-paper-plane' },
  { key: 'ACCEPTED',          label: 'Accepted',          icon: 'fa-check-circle' },
  { key: 'DEALER_RESPONDED',  label: 'Dealer Responded',  icon: 'fa-reply' },
  { key: 'HEARING_SCHEDULED', label: 'Hearing Scheduled', icon: 'fa-calendar' },
  { key: 'DECISION_ISSUED',   label: 'Decision Issued',   icon: 'fa-gavel' },
]

const STATUS_LABELS: Record<string, string> = {
  SUBMITTED:          'Submitted',
  INCOMPLETE:         'Incomplete — Action Required',
  ACCEPTED:           'Accepted',
  DEALER_RESPONDED:   'Dealer Responded',
  HEARING_SCHEDULED:  'Hearing Scheduled',
  HEARING_COMPLETE:   'Hearing Complete',
  DECISION_ISSUED:    'Decision Issued',
  WITHDRAWN:          'Withdrawn',
  CLOSED:             'Closed',
}

const DOC_TYPES = [
  { value: 'PURCHASE_CONTRACT',           label: 'Purchase Contract' },
  { value: 'LEASE_AGREEMENT',             label: 'Lease Agreement' },
  { value: 'RMV1_REGISTRATION',           label: 'RMV-1 Registration' },
  { value: 'REPAIR_RECORDS',              label: 'Repair Records' },
  { value: 'WARRANTY_DOCUMENT',           label: 'Warranty Document' },
  { value: 'MANUFACTURER_CORRESPONDENCE', label: 'Manufacturer Correspondence' },
  { value: 'DEALER_CORRESPONDENCE',       label: 'Dealer Correspondence' },
  { value: 'EXPENSE_RECEIPT',             label: 'Expense Receipt' },
  { value: 'OTHER',                       label: 'Other' },
]

interface PortalStatus {
  applicationId: string
  caseNumber: string
  status: string
  applicationTypeFriendly?: string
  submittedAt: string
  milestones?: Array<{ label: string; completed: boolean }>
  notifications?: Array<{ type: string; subject: string; sentAt: string; deliveryStatus: string }>
}

interface DocumentItem {
  documentId: string
  documentType: string
  fileName: string
  fileSizeBytes: number
  status: string
  uploadedAt: string
  uploadedByRole: string
}

export default function Status() {
  const [searchParams] = useSearchParams()
  const session = getSession()

  // Email link format: /status?caseNumber=LL-2026-00142&token=<cleartext>
  const urlCaseNumber = searchParams.get('caseNumber')
  const urlToken      = searchParams.get('token')

  const [lookupValue, setLookupValue] = useState(urlCaseNumber ?? session.caseNumber ?? '')
  const [status, setStatus]           = useState<PortalStatus | null>(null)
  const [documents, setDocuments]     = useState<DocumentItem[]>([])
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const [activeTab, setActiveTab]     = useState<'status' | 'documents' | 'notifications'>('status')

  const [uploadType, setUploadType] = useState('REPAIR_RECORDS')
  const [uploading, setUploading]   = useState(false)

  const fetchStatus = async (caseNumber: string, token?: string | null) => {
    setLoading(true)
    setError(null)
    try {
      if (token) saveSession(caseNumber, token)
      const res = await getPortalStatus(caseNumber, token ?? undefined)
      if (res.success) {
        setStatus(res.data)
        const docsRes = await getPortalDocuments(caseNumber, token ?? undefined)
        if (docsRes.success) setDocuments(docsRes.data ?? [])
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
    if (urlCaseNumber) fetchStatus(urlCaseNumber, urlToken)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLookup = () => {
    const trimmed = lookupValue.trim().toUpperCase()
    if (!trimmed) return
    fetchStatus(trimmed, session.token ?? undefined)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !status) return
    e.target.value = ''

    if (file.size > 25 * 1024 * 1024) {
      toast.error('File exceeds the 25 MB limit.')
      return
    }

    const token = session.token ?? urlToken ?? ''
    setUploading(true)
    try {
      const res = await uploadPortalDocument(status.caseNumber, token, file, uploadType)
      if (res.success) {
        toast.success(`${file.name} uploaded successfully.`)
        const docsRes = await getPortalDocuments(status.caseNumber, token)
        if (docsRes.success) setDocuments(docsRes.data ?? [])
      } else {
        toast.error(res.message || 'Upload failed.')
      }
    } catch {
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const currentIdx = MILESTONES.findIndex(m => m.key === status?.status)

  const tabStyle = (tab: typeof activeTab) => ({
    padding: '10px 20px',
    border: 'none',
    borderBottom: `3px solid ${activeTab === tab ? 'var(--theme-color)' : 'transparent'}`,
    background: 'none',
    color: activeTab === tab ? 'var(--theme-color)' : 'var(--ms-gray-dark)',
    fontWeight: activeTab === tab ? 700 : 500,
    fontSize: 'var(--text-sm)',
    cursor: 'pointer',
  } as React.CSSProperties)

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 'var(--text-xl-med)', fontWeight: 800, color: 'var(--theme-color)', marginBottom: 8 }}>
          Application Status
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ms-gray-dark)' }}>
          Use the secure link from your confirmation email, or enter your case number below.
        </p>
      </div>

      {/* Manual lookup — hidden once a result is loaded */}
      {!status && (
        <div style={{ marginBottom: 32, maxWidth: 480 }}>
          <label className="vll-label" htmlFor="caseNumberInput">
            Case Number
          </label>
          <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
            <input
              id="caseNumberInput"
              type="text"
              value={lookupValue}
              onChange={e => setLookupValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLookup()}
              className="vll-input"
              placeholder="e.g. LL-2026-00142"
              style={{ flex: 1, fontFamily: 'monospace', letterSpacing: 1 }}
              aria-label="Case Number"
              autoComplete="off"
            />
            <button
              onClick={handleLookup}
              disabled={loading || !lookupValue.trim()}
              className="btn-theme"
              style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              {loading
                ? <i className="fa-solid fa-spinner fa-spin" />
                : <><i className="fa-solid fa-magnifying-glass" /> Look Up</>}
            </button>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ms-gray-dark)', marginTop: 6 }}>
            Your case number is in the format <strong>LL-YYYY-NNNNN</strong> and was included in your confirmation email.
          </p>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--ms-gray-dark)' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 28, marginBottom: 12 }} />
          <p>Loading your application status…</p>
        </div>
      )}

      {error && !loading && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '16px 20px', color: '#991b1b', marginBottom: 24 }}>
          <i className="fa-solid fa-circle-exclamation" style={{ marginRight: 8 }} />
          {error}
        </div>
      )}

      {status && !loading && (
        <>
          {/* Case header */}
          <div className="vll-card" style={{ padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ms-gray-dark)', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Case Number
                </p>
                <h2 style={{ fontSize: 'var(--text-lg-med)', fontWeight: 800, color: 'var(--theme-color)', margin: '0 0 8px' }}>
                  {status.caseNumber}
                </h2>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)', margin: 0 }}>
                  {status.applicationTypeFriendly} · Submitted{' '}
                  {new Date(status.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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

          {/* Tabs */}
          <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: 24, display: 'flex', gap: 0 }}>
            <button style={tabStyle('status')} onClick={() => setActiveTab('status')}>
              <i className="fa-solid fa-chart-line" style={{ marginRight: 6 }} />Progress
            </button>
            <button style={tabStyle('documents')} onClick={() => setActiveTab('documents')}>
              <i className="fa-solid fa-file" style={{ marginRight: 6 }} />
              Documents {documents.length > 0 && `(${documents.length})`}
            </button>
            <button style={tabStyle('notifications')} onClick={() => setActiveTab('notifications')}>
              <i className="fa-solid fa-bell" style={{ marginRight: 6 }} />
              Notifications {(status.notifications?.length ?? 0) > 0 && `(${status.notifications!.length})`}
            </button>
          </div>

          {/* Tab: Progress */}
          {activeTab === 'status' && (
            <div className="vll-card" style={{ padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: 'var(--text-base-med)', fontWeight: 700, color: 'var(--dark-color)', marginBottom: 24 }}>
                Progress
              </h3>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
                {MILESTONES.map((m, i) => {
                  const done    = i <= currentIdx
                  const current = i === currentIdx
                  return (
                    <div key={m.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                      {i < MILESTONES.length - 1 && (
                        <div style={{
                          position: 'absolute', top: 16, left: '50%', width: '100%', height: 3,
                          background: done && i < currentIdx ? 'var(--mass-primary-green)' : '#e5e7eb',
                          zIndex: 0
                        }} />
                      )}
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: done ? (current ? 'var(--theme-color)' : 'var(--mass-primary-green)') : '#e5e7eb',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1, position: 'relative', flexShrink: 0
                      }}>
                        <i className={`fa-solid ${m.icon}`} style={{ color: done ? '#fff' : '#9ca3af', fontSize: 13 }} />
                      </div>
                      <p style={{
                        fontSize: 10, fontWeight: current ? 700 : 500,
                        color: done ? 'var(--dark-color)' : '#9ca3af',
                        textAlign: 'center', marginTop: 8, lineHeight: 1.3
                      }}>
                        {m.label}
                      </p>
                    </div>
                  )
                })}
              </div>

              {status.status === 'INCOMPLETE' && (
                <div style={{ marginTop: 24, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '16px 20px' }}>
                  <p style={{ fontWeight: 700, color: '#c2410c', margin: '0 0 6px' }}>
                    <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: 8 }} />
                    Action Required
                  </p>
                  <p style={{ fontSize: 'var(--text-sm)', color: '#7c2d12', margin: 0 }}>
                    OCABR has identified missing information or documents. Please upload the requested documents in the Documents tab.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab: Documents */}
          {activeTab === 'documents' && (
            <div className="vll-card" style={{ padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: 'var(--text-base-med)', fontWeight: 700, color: 'var(--dark-color)', marginBottom: 16 }}>
                Documents
              </h3>

              {documents.length === 0 ? (
                <p style={{ color: 'var(--ms-gray-dark)', fontSize: 'var(--text-sm)' }}>No documents on file yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  {documents.map(doc => (
                    <div key={doc.documentId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <i className="fa-solid fa-file-pdf" style={{ color: '#dc3545', fontSize: 18, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {doc.fileName}
                        </p>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ms-gray-dark)', margin: 0 }}>
                          {doc.documentType.replace(/_/g, ' ')} · {(doc.fileSizeBytes / 1024).toFixed(1)} KB ·{' '}
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span style={{
                        fontSize: 'var(--text-xs)', fontWeight: 600, padding: '3px 10px', borderRadius: 12,
                        background: doc.status === 'ACCEPTED' ? '#dcfce7' : doc.status === 'REJECTED' ? '#fee2e2' : '#f3f4f6',
                        color: doc.status === 'ACCEPTED' ? '#166534' : doc.status === 'REJECTED' ? '#991b1b' : '#374151'
                      }}>
                        {doc.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload additional documents */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--dark-color)', marginBottom: 12 }}>
                  Upload Additional Document
                </h4>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div>
                    <label className="vll-label">Document Type</label>
                    <select
                      value={uploadType}
                      onChange={e => setUploadType(e.target.value)}
                      className="vll-input"
                      style={{ maxWidth: 240 }}
                    >
                      {DOC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <label className="btn-theme" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, opacity: uploading ? 0.7 : 1 }}>
                    {uploading
                      ? <><i className="fa-solid fa-spinner fa-spin" /> Uploading…</>
                      : <><i className="fa-solid fa-cloud-arrow-up" /> Choose File</>}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.tiff"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ms-gray-dark)', marginTop: 8 }}>
                  Accepted: PDF, JPEG, PNG, TIFF. Max 25 MB.
                </p>
              </div>
            </div>
          )}

          {/* Tab: Notifications */}
          {activeTab === 'notifications' && (
            <div className="vll-card" style={{ padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: 'var(--text-base-med)', fontWeight: 700, color: 'var(--dark-color)', marginBottom: 16 }}>
                Notifications
              </h3>
              {!status.notifications || status.notifications.length === 0 ? (
                <p style={{ color: 'var(--ms-gray-dark)', fontSize: 'var(--text-sm)' }}>No notifications sent yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {status.notifications.map((n, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0', borderBottom: i < status.notifications!.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(2,101,163,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className="fa-solid fa-envelope" style={{ color: 'var(--theme-color)', fontSize: 14 }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', margin: '0 0 2px', color: 'var(--dark-color)' }}>
                          {n.subject}
                        </p>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ms-gray-dark)', margin: 0 }}>
                          {new Date(n.sentAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                          {' · '}
                          <span style={{ color: n.deliveryStatus === 'DELIVERED' || n.deliveryStatus === 'OPENED' ? 'var(--mass-primary-green)' : 'var(--ms-gray-dark)' }}>
                            {n.deliveryStatus}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Look up a different application */}
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <button
              onClick={() => { setStatus(null); setDocuments([]); setError(null) }}
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
