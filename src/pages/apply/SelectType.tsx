import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWizard } from '@/context/WizardContext'
import type { ApplicationType } from '@/context/WizardContext'
import { APPLICATION_TYPE_LABELS } from '@/constants/appConstants'
import { saveSession } from '@/utils/storage'
import { createApplication } from '@/services/applicationService'
import { toast } from 'react-toastify'

const TYPE_DESCRIPTIONS: Record<ApplicationType, string> = {
  NEW_CAR: 'Applies to new vehicles purchased or leased within the last 36 months or 36,000 miles under the manufacturer\'s original warranty.',
  USED_CAR: 'Applies to used vehicles purchased from a dealer with an implied warranty in effect at time of sale.',
  LEASED: 'Applies to consumers leasing a new vehicle experiencing repeated defects under the manufacturer\'s warranty.',
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
      // Call real API — creates the application record in DB
      const res = await createApplication(selected)
      if (!res.success) {
        toast.error(res.message || 'Failed to start application.')
        return
      }
      const { applicationId, caseNumber, accessToken } = res.data
      setApplicationType(selected)
      setApplicationId(applicationId)
      setCaseNumber(caseNumber)
      saveSession(applicationId, accessToken)
      navigate(`/apply/${applicationId}/step/1`)
    } catch {
      toast.error('Unable to start application. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 'var(--text-xl-med)', fontWeight: 800, color: 'var(--theme-color)', marginBottom: 8 }}>
          Select Application Type
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ms-gray-dark)' }}>
          Choose the type of Lemon Law application that applies to your situation.
        </p>
      </div>

      <fieldset style={{ border: 'none', padding: 0, margin: '0 0 28px' }}>
        <legend className="vll-label" style={{ marginBottom: 16, fontSize: 'var(--text-base)', fontWeight: 700 }}>
          Application Type <span className="required">*</span>
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(Object.keys(TYPE_DESCRIPTIONS) as ApplicationType[]).map((type) => (
            <label
              key={type}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 20px',
                border: `2px solid ${selected === type ? 'var(--theme-color)' : '#e5e7eb'}`,
                borderRadius: 10, cursor: 'pointer',
                background: selected === type ? 'rgba(2,101,163,0.04)' : '#fff',
                transition: 'all 0.15s',
              }}
            >
              <input
                type="radio"
                name="applicationType"
                value={type}
                checked={selected === type}
                onChange={() => setSelected(type)}
                style={{ marginTop: 4, accentColor: 'var(--theme-color)', width: 18, height: 18, flexShrink: 0 }}
              />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1 }}>
                <div className="page-heading-icon-wrapper" style={{ flexShrink: 0 }}>
                  <i className={`fa-solid ${TYPE_ICONS[type]} page-heading-icon`}></i>
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--dark-color)', margin: '0 0 4px' }}>
                    {APPLICATION_TYPE_LABELS[type]}
                  </p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)', margin: 0, lineHeight: 1.6 }}>
                    {TYPE_DESCRIPTIONS[type]}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      {selected && (
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 28, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            style={{ marginTop: 3, accentColor: 'var(--theme-color)', width: 18, height: 18, flexShrink: 0 }}
          />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--dark-color)', lineHeight: 1.6 }}>
            I confirm that I meet the eligibility criteria for{' '}
            <strong>{APPLICATION_TYPE_LABELS[selected]}</strong> and wish to proceed.
          </span>
        </label>
      )}

      <button
        onClick={handleContinue}
        disabled={!selected || !acknowledged || loading}
        className="btn-theme"
        style={{ fontSize: 'var(--text-base)', padding: '12px 32px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
        aria-busy={loading}
      >
        {loading
          ? <><i className="fa-solid fa-spinner fa-spin"></i> Starting…</>
          : <><i className="fa-solid fa-arrow-right"></i> Continue</>
        }
      </button>
    </div>
  )
}
