import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWizard } from '@/context/WizardContext'
import WizardNav from '@/components/shared/WizardNav'
import { saveStep1 } from '@/services/applicationService'
import { toast } from 'react-toastify'

interface ConsumerForm {
  firstName: string; lastName: string; middleName: string
  emailAddress: string; emailConfirm: string
  phoneNumber: string; phoneType: string
  addressLine1: string; addressLine2: string
  city: string; state: string; zipCode: string
  preferredContactMethod: string
}

const INITIAL: ConsumerForm = {
  firstName: '', lastName: '', middleName: '',
  emailAddress: '', emailConfirm: '',
  phoneNumber: '', phoneType: 'MOBILE',
  addressLine1: '', addressLine2: '',
  city: '', state: 'MA', zipCode: '',
  preferredContactMethod: 'EMAIL',
}

// ── Defined OUTSIDE the parent component so React doesn't remount on every render ──
interface FieldProps {
  label: string
  field: keyof ConsumerForm
  required?: boolean
  type?: string
  half?: boolean
  value: string
  error?: string
  onChange: (field: keyof ConsumerForm, value: string) => void
}

function Field({ label, field, required, type = 'text', half, value, error, onChange }: FieldProps) {
  return (
    <div style={{ gridColumn: half ? 'span 1' : 'span 2' }}>
      <label className="vll-label" htmlFor={field}>
        {label}{required && <span className="required">*</span>}
      </label>
      <input
        id={field}
        type={type}
        value={value}
        onChange={e => onChange(field, e.target.value)}
        className={`vll-input${error ? ' error' : ''}`}
        aria-describedby={error ? `${field}-err` : undefined}
        aria-required={required}
      />
      {error && <p id={`${field}-err`} className="field-error" role="alert">{error}</p>}
    </div>
  )
}

export default function Step1ConsumerInfo() {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const { markStepComplete } = useWizard()
  const [form, setForm] = useState<ConsumerForm>(INITIAL)
  const [errors, setErrors] = useState<Partial<ConsumerForm>>({})
  const [loading, setLoading] = useState(false)

  const set = (field: keyof ConsumerForm, value: string) => {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const e: Partial<ConsumerForm> = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim()) e.lastName = 'Last name is required'
    if (!form.emailAddress.trim()) e.emailAddress = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailAddress)) e.emailAddress = 'Enter a valid email'
    if (form.emailAddress !== form.emailConfirm) e.emailConfirm = 'Emails do not match'
    if (!form.phoneNumber.trim()) e.phoneNumber = 'Phone number is required'
    if (!form.addressLine1.trim()) e.addressLine1 = 'Address is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.zipCode.trim()) e.zipCode = 'ZIP code is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const res = await saveStep1(applicationId!, {
        firstName: form.firstName,
        middleName: form.middleName || undefined,
        lastName: form.lastName,
        emailAddress: form.emailAddress,
        phoneNumber: form.phoneNumber,
        phoneType: form.phoneType,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2 || undefined,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
        preferredContactMethod: form.preferredContactMethod,
      })
      if (!res.success) {
        toast.error(res.message || 'Failed to save. Please try again.')
        return
      }
      markStepComplete(1)
      navigate(`/apply/${applicationId}/step/2`)
    } catch {
      toast.error('Unable to save. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 'var(--text-lg-med)', fontWeight: 700, color: 'var(--theme-color)', marginBottom: 6 }}>
          Your Information
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)' }}>
          All fields marked <span style={{ color: '#dc3545' }}>*</span> are required.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
        <Field label="First Name" field="firstName" required half value={form.firstName} error={errors.firstName} onChange={set} />
        <Field label="Last Name" field="lastName" required half value={form.lastName} error={errors.lastName} onChange={set} />

        <div style={{ gridColumn: 'span 2' }}>
          <label className="vll-label" htmlFor="middleName">Middle Name / Initial</label>
          <input id="middleName" type="text" value={form.middleName} onChange={e => set('middleName', e.target.value)} className="vll-input" style={{ maxWidth: 240 }} />
        </div>

        <Field label="Email Address" field="emailAddress" required type="email" value={form.emailAddress} error={errors.emailAddress} onChange={set} />
        <Field label="Confirm Email" field="emailConfirm" required type="email" value={form.emailConfirm} error={errors.emailConfirm} onChange={set} />

        <div style={{ gridColumn: 'span 1' }}>
          <label className="vll-label" htmlFor="phoneNumber">Phone Number<span className="required">*</span></label>
          <input id="phoneNumber" type="tel" value={form.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} className={`vll-input${errors.phoneNumber ? ' error' : ''}`} placeholder="(617) 555-0100" />
          {errors.phoneNumber && <p className="field-error" role="alert">{errors.phoneNumber}</p>}
        </div>
        <div style={{ gridColumn: 'span 1' }}>
          <label className="vll-label" htmlFor="phoneType">Phone Type<span className="required">*</span></label>
          <select id="phoneType" value={form.phoneType} onChange={e => set('phoneType', e.target.value)} className="vll-input">
            <option value="MOBILE">Mobile</option>
            <option value="HOME">Home</option>
            <option value="WORK">Work</option>
          </select>
        </div>

        <div style={{ gridColumn: 'span 2', marginTop: 8 }}>
          <p style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--dark-color)', marginBottom: 4 }}>Home Address</p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ms-gray-dark)', marginBottom: 12 }}>
            <i className="fa-solid fa-location-dot" style={{ marginRight: 4, color: 'var(--theme-color)' }}></i>
            In a live environment, this field uses Google Places autocomplete.
          </p>
        </div>

        <Field label="Street Address" field="addressLine1" required value={form.addressLine1} error={errors.addressLine1} onChange={set} />

        <div style={{ gridColumn: 'span 2' }}>
          <label className="vll-label" htmlFor="addressLine2">Apt / Suite / Unit</label>
          <input id="addressLine2" type="text" value={form.addressLine2} onChange={e => set('addressLine2', e.target.value)} className="vll-input" style={{ maxWidth: 300 }} />
        </div>

        <Field label="City" field="city" required half value={form.city} error={errors.city} onChange={set} />

        <div style={{ gridColumn: 'span 1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label className="vll-label" htmlFor="state">State<span className="required">*</span></label>
            <input id="state" type="text" value={form.state} onChange={e => set('state', e.target.value)} className="vll-input" maxLength={2} />
          </div>
          <div>
            <label className="vll-label" htmlFor="zipCode">ZIP Code<span className="required">*</span></label>
            <input id="zipCode" type="text" value={form.zipCode} onChange={e => set('zipCode', e.target.value)} className={`vll-input${errors.zipCode ? ' error' : ''}`} placeholder="02101" />
            {errors.zipCode && <p className="field-error" role="alert">{errors.zipCode}</p>}
          </div>
        </div>

        <div style={{ gridColumn: 'span 2', marginTop: 8 }}>
          <label className="vll-label">Preferred Contact Method<span className="required">*</span></label>
          <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
            {['EMAIL', 'PHONE'].map(m => (
              <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                <input type="radio" name="preferredContact" value={m} checked={form.preferredContactMethod === m} onChange={() => set('preferredContactMethod', m)} style={{ accentColor: 'var(--theme-color)', width: 16, height: 16 }} />
                {m === 'EMAIL' ? 'Email' : 'Phone'}
              </label>
            ))}
          </div>
        </div>
      </div>

      <WizardNav onNext={handleNext} loading={loading} />
    </div>
  )
}
