import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWizard } from '@/context/WizardContext'
import type { ApplicationType } from '@/context/WizardContext'
import { APPLICATION_TYPE_LABELS } from '@/constants/appConstants'
import { saveSession } from '@/utils/storage'
import { createApplication } from '@/services/applicationService'
import { toast } from 'react-toastify'

const TYPE_DESCRIPTIONS: Record<ApplicationType, string> = {
  NEW_CAR: 'New vehicle purchased or leased within the last 36 months or 36,000 miles under the manufacturer\'s original warranty.',
  USED_CAR: 'Used vehicle purchased from a dealer with an implied warranty in effect at time of sale.',
  LEASED: 'Leasing a new vehicle experiencing repeated defects under the manufacturer\'s warranty.',
}

const TYPE_ICONS: Record<ApplicationType, string> = {
  NEW_CAR: 'fa-car',
  USED_CAR: 'fa-car-side',
  LEASED: 'fa-file-contract',
}

export default function SelectType() {
  const navigate = useNavigate()
  const { setApplicationType, setApplicationId, setCaseNumber } = useWizard()
  const [selected, setSelected] = useState<ApplicationType | null>(null)
  const [acknowledged, setAcknowledged] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleContinue = async () => {
    if (!selected || !acknowledged) return
    setLoading(true)
    try {
      const res = await createApplication(selected)
      if (!res.success) {
        toast.error(res.message || 'Failed to start application.')
        return
      }
      const { applicationId, caseNumber, accessToken } = res.data
      setApplicationType(selected)
      setApplicationId(applicationId)
      setCaseNumber(caseNumber)
      saveSession(caseNumber, accessToken)
      navigate(`/apply/${applicationId}/step/1`)
    } catch {
      toast.error('Unable to start application. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="wizard-shell-container" style={{ maxWidth: 1100, width: '100%' }}>
      <div className="vll-card" style={{ padding: '32px 36px', width: '100%' }}>
      {/* Header — matches other steps */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 'var(--text-lg-med)', fontWeight: 700, color: 'var(--theme-color)', marginBottom: 6 }}>
          Select Application Type
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)' }}>
          Choose the type of Lemon Law application that applies to your situation.
        </p>
      </div>

      {/* Three square selection cards */}
      <fieldset style={{ border: 'none', padding: 0, margin: '0 0 28px' }}>
        <legend className="vll-label" style={{ marginBottom: 16 }}>
          Application Type <span className="required">*</span>
        </legend>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {(Object.keys(TYPE_DESCRIPTIONS) as ApplicationType[]).map((type) => {
            const isSelected = selected === type
            return (
              <label
                key={type}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 14,
                  padding: '28px 20px 24px',
                  border: `2px solid ${isSelected ? 'var(--theme-color)' : '#e5e7eb'}`,
                  borderRadius: 12,
                  cursor: 'pointer',
                  background: isSelected ? 'rgba(2,101,163,0.05)' : '#fafafa',
                  transition: 'all 0.15s',
                  position: 'relative',
                }}
              >
                {/* Hidden radio */}
                <input
                  type="radio"
                  name="applicationType"
                  value={type}
                  checked={isSelected}
                  onChange={() => { setSelected(type); setAcknowledged(false) }}
                  style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                />

                {/* Selected indicator */}
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  width: 20, height: 20, borderRadius: '50%',
                  border: `2px solid ${isSelected ? 'var(--theme-color)' : '#d1d5db'}`,
                  background: isSelected ? 'var(--theme-color)' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}>
                  {isSelected && <i className="fa-solid fa-check" style={{ fontSize: 9, color: '#fff' }}></i>}
                </div>

                {/* Icon */}
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: isSelected ? 'rgba(2,101,163,0.12)' : 'rgba(2,101,163,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s',
                }}>
                  <i className={`fa-solid ${TYPE_ICONS[type]}`} style={{ fontSize: 22, color: 'var(--theme-color)' }}></i>
                </div>

                {/* Label */}
                <div>
                  <p style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: isSelected ? 'var(--theme-color)' : 'var(--dark-color)', margin: '0 0 8px', lineHeight: 1.3 }}>
                    {APPLICATION_TYPE_LABELS[type]}
                  </p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ms-gray-dark)', margin: 0, lineHeight: 1.6 }}>
                    {TYPE_DESCRIPTIONS[type]}
                  </p>
                </div>
              </label>
            )
          })}
        </div>
      </fieldset>

      {/* Acknowledgement */}
      {selected && (
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 28, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            style={{ marginTop: 3, accentColor: 'var(--theme-color)', width: 16, height: 16, flexShrink: 0 }}
          />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--dark-color)', lineHeight: 1.6 }}>
            I confirm that I meet the eligibility criteria for{' '}
            <strong>{APPLICATION_TYPE_LABELS[selected]}</strong> and wish to proceed.
          </span>
        </label>
      )}

      {/* Continue button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingTop: 24, borderTop: '1px solid #e5e7eb' }}>
        <button
          onClick={handleContinue}
          disabled={!selected || !acknowledged || loading}
          className="btn-theme"
          style={{ fontSize: 'var(--text-base)', padding: '11px 28px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          aria-busy={loading}
        >
          {loading
            ? <><i className="fa-solid fa-spinner fa-spin"></i> Starting…</>
            : <>Continue <i className="fa-solid fa-arrow-right"></i></>
          }
        </button>
      </div>
    </div>
    </div>
  )
}
