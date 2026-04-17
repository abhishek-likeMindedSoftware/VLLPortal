import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWizard } from '@/context/WizardContext'
import WizardNav from '@/components/shared/WizardNav'

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
    await new Promise(r => setTimeout(r, 400)) // simulate save
    markStepComplete(1)
    setLoading(false)
    navigate(`/apply/${applicationId}/step/2`)
  }

  const F = ({ label, field, required, type = 'text', half }: { label: string; field: keyof ConsumerForm; required?: boolean; type?: string; half?: boolean }) => (
    <div style={{ gridColumn: half ? 'span 1' : 'span 2' }}>
      <label className="vll-label" htmlFor={field}>
        {label}{required && <span className="required">*</span>}
      </label>
      <input
        id={field} type={type} value={form[field]}
        onChange={e => set(field, e.target.value)}
        className={`vll-input${errors[field] ? ' error' : ''}`}
        aria-describedby={errors[field] ? `${field}-err` : undefined}
        aria-required={required}
      />
      {errors[field] && <p id={`${field}-err`} className="field-error" role="alert">{errors[field]}</p>}
    </div>
  )

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
        <F label="First Name" field="firstName" required half />
        <F label="Last Name" field="lastName" required half />
        <div style={{ gridColumn: 'span 2' }}>
          <label className="vll-label" htmlFor="middleName">Middle Name / Initial</label>
          <input id="middleName" type="text" value={form.middleName} onChange={e => set('middleName', e.target.value)} className="vll-input" style={{ maxWidth: 240 }} />
        </div>
        <F label="Email Address" field="emailAddress" required type="email" />
        <F label="Confirm Email" field="emailConfirm" required type="email" />
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
        <F label="Street Address" field="addressLine1" required />
        <div style={{ gridColumn: 'span 2' }}>
          <label className="vll-label" htmlFor="addressLine2">Apt / Suite / Unit</label>
          <input id="addressLine2" type="text" value={form.addressLine2} onChange={e => set('addressLine2', e.target.value)} className="vll-input" style={{ maxWidth: 300 }} />
        </div>
        <F label="City" field="city" required half />
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
