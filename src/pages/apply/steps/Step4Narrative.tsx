import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWizard } from '@/context/WizardContext'
import WizardNav from '@/components/shared/WizardNav'
import { saveStep4 } from '@/services/applicationService'
import { toast } from 'react-toastify'

const MAX = 5000
const MIN = 50

export default function Step4Narrative() {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const { markStepComplete } = useWizard()
  const [loading, setLoading] = useState(false)
  const [narrative, setNarrative] = useState('')
  const [priorDealer, setPriorDealer] = useState(false)
  const [priorMfr, setPriorMfr] = useState(false)
  const [priorNotes, setPriorNotes] = useState('')
  const [desiredResolution, setDesiredResolution] = useState('REFUND')
  const [error, setError] = useState('')

  const handleNext = async () => {
    if (narrative.trim().length < MIN) {
      setError(`Please provide at least ${MIN} characters.`)
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await saveStep4(applicationId!, {
        narrativeStatement: narrative,
        priorContactWithDealer: priorDealer,
        priorContactWithMfr: priorMfr,
        priorContactNotes: priorNotes || undefined,
        desiredResolution: desiredResolution,
      })
      if (!res.success) {
        toast.error(res.message || 'Failed to save.')
        return
      }
      markStepComplete(4)
      navigate(`/apply/${applicationId}/step/5`)
    } catch {
      toast.error('Unable to save. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const charColor = narrative.length < MIN ? '#dc3545' : narrative.length > MAX * 0.9 ? '#f59e0b' : 'var(--mass-primary-green)'

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 'var(--text-lg-med)', fontWeight: 700, color: 'var(--theme-color)', marginBottom: 6 }}>
          Your Statement
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)' }}>
          Describe your experience in your own words. This statement will be included in the dealer outreach package.
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label className="vll-label" htmlFor="narrative">
          Narrative Statement<span className="required">*</span>
        </label>
        <textarea
          id="narrative"
          value={narrative}
          onChange={e => { setNarrative(e.target.value); setError('') }}
          className={`vll-input${error ? ' error' : ''}`}
          rows={8}
          maxLength={MAX}
          placeholder="Describe the defects, how they affect your vehicle's use and safety, and what steps you have taken to resolve the issue…"
          style={{ resize: 'vertical' }}
          aria-describedby="narrative-count"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          {error && <p className="field-error" role="alert">{error}</p>}
          <p id="narrative-count" style={{ fontSize: 'var(--text-xs)', color: charColor, fontWeight: 600, marginLeft: 'auto' }}>
            {narrative.length} / {MAX} characters {narrative.length < MIN && `(minimum ${MIN})`}
          </p>
        </div>
      </div>

      <div className="vll-card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--dark-color)', marginBottom: 16 }}>
          Prior Contact
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
            <input type="checkbox" checked={priorDealer} onChange={e => setPriorDealer(e.target.checked)} style={{ accentColor: 'var(--theme-color)', width: 16, height: 16 }} />
            I have already contacted the dealer about this issue
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
            <input type="checkbox" checked={priorMfr} onChange={e => setPriorMfr(e.target.checked)} style={{ accentColor: 'var(--theme-color)', width: 16, height: 16 }} />
            I have already contacted the manufacturer about this issue
          </label>
          {(priorDealer || priorMfr) && (
            <div style={{ marginTop: 8 }}>
              <label className="vll-label" htmlFor="priorNotes">Details of prior contact attempts</label>
              <textarea id="priorNotes" value={priorNotes} onChange={e => setPriorNotes(e.target.value)} className="vll-input" rows={3} placeholder="Describe when and how you contacted them and what response you received…" style={{ resize: 'vertical' }} />
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label className="vll-label" htmlFor="resolution">Desired Resolution<span className="required">*</span></label>
        <select id="resolution" value={desiredResolution} onChange={e => setDesiredResolution(e.target.value)} className="vll-input" style={{ maxWidth: 320 }}>
          <option value="REFUND">Full Refund</option>
          <option value="REPLACEMENT">Vehicle Replacement</option>
          <option value="REIMBURSEMENT">Reimbursement of Expenses</option>
          <option value="ARBITRATION">Arbitration</option>
          <option value="UNSURE">Unsure</option>
        </select>
      </div>

      <WizardNav onBack={() => navigate(`/apply/${applicationId}/step/3`)} onNext={handleNext} loading={loading} />
    </div>
  )
}
