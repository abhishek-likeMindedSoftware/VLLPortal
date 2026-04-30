import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWizard } from '@/context/WizardContext'
import WizardNav from '@/components/shared/WizardNav'
import AddressAutocomplete from '@/components/shared/AddressAutocomplete'
import { saveStep1 } from '@/services/applicationService'
import type { Step1Data } from '@/context/WizardContext'
import { toast } from 'react-toastify'

interface ConsumerForm {
  firstName: string; lastName: string; middleName: string
  emailAddress: string; emailConfirm: string
  phoneNumber: string; phoneType: string
  addressLine1: string; addressLine2: string
  city: string; state: string; zipCode: string
  placeId: string
  preferredContactMethod: string
}

const INITIAL: ConsumerForm = {
  firstName: '', lastName: '', middleName: '',
  emailAddress: '', emailConfirm: '',
  phoneNumber: '', phoneType: 'MOBILE',
  addressLine1: '', addressLine2: '',
  city: '', state: 'MA', zipCode: '',
  placeId: '',
  preferredContactMethod: 'EMAIL',
}

// Field component defined OUTSIDE to prevent remount on every render
interface FieldProps {
  label: string; field: keyof ConsumerForm; required?: boolean
  type?: string; half?: boolean; value: string; error?: string
  onChange: (field: keyof ConsumerForm, value: string) => void
}

function Field({ label, field, required, type = 'text', half, value, error, onChange }: FieldProps) {
  return (
    <div style={{ gridColumn: half ? 'span 1' : 'span 2' }}>
      <label className="vll-label" htmlFor={field}>
        {label}{required && <span className="required">*</span>}
      </label>
      <input
        id={field} type={type} value={value}
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
  const { markStepComplete, saveStep1: saveStep1Ctx, state } = useWizard()

  // Pre-fill from context if user navigates back
  const [form, setForm] = useState<ConsumerForm>(() =>
    state.step1
      ? { ...INITIAL, ...state.step1, emailConfirm: state.step1.emailAddress, middleName: state.step1.middleName ?? '', addressLine2: state.step1.addressLine2 ?? '', placeId: state.step1.placeId ?? '' }
      : INITIAL
  )
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
      const stepData: Step1Data = {
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
        placeId: form.placeId || undefined,
        preferredContactMethod: form.preferredContactMethod,
      }
      const res = await saveStep1(applicationId!, stepData)
      if (!res.success) {
        toast.error(res.message || 'Failed to save. Please try again.')
        return
      }
      saveStep1Ctx(stepData)
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
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 'var(--text-lg-med)', fontWeight: 700, color: 'var(--theme-color)', marginBottom: 6 }}>
          Your Information
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)' }}>
          All fields marked <span style={{ color: '#dc3545' }}>*</span> are required.
        </p>
      </div>

      {/* Two-panel layout: personal info left, address right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 28px', alignItems: 'start' }}>

        {/* ── LEFT PANEL: Personal & Contact ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--dark-color)', margin: '0 0 2px', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
            Personal Information
          </p>

          {/* First + Last */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            <Field label="First Name" field="firstName" required half value={form.firstName} error={errors.firstName} onChange={set} />
            <Field label="Last Name" field="lastName" required half value={form.lastName} error={errors.lastName} onChange={set} />
          </div>

          {/* Middle + Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            <div>
              <label className="vll-label" htmlFor="middleName">Middle Name / Initial</label>
              <input id="middleName" type="text" value={form.middleName} onChange={e => set('middleName', e.target.value)} className="vll-input" />
            </div>
            <div>
              <label className="vll-label" htmlFor="phoneNumber">Phone Number<span className="required">*</span></label>
              <input id="phoneNumber" type="tel" value={form.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} className={`vll-input${errors.phoneNumber ? ' error' : ''}`} placeholder="(617) 555-0100" />
              {errors.phoneNumber && <p className="field-error" role="alert">{errors.phoneNumber}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="vll-label" htmlFor="emailAddress">Email Address<span className="required">*</span></label>
            <input id="emailAddress" type="email" value={form.emailAddress} onChange={e => set('emailAddress', e.target.value)} className={`vll-input${errors.emailAddress ? ' error' : ''}`} />
            {errors.emailAddress && <p className="field-error" role="alert">{errors.emailAddress}</p>}
          </div>

          {/* Confirm Email */}
          <div>
            <label className="vll-label" htmlFor="emailConfirm">Confirm Email<span className="required">*</span></label>
            <input id="emailConfirm" type="email" value={form.emailConfirm} onChange={e => set('emailConfirm', e.target.value)} className={`vll-input${errors.emailConfirm ? ' error' : ''}`} />
            {errors.emailConfirm && <p className="field-error" role="alert">{errors.emailConfirm}</p>}
          </div>

          {/* Phone Type + Preferred Contact */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            <div>
              <label className="vll-label" htmlFor="phoneType">Phone Type<span className="required">*</span></label>
              <select id="phoneType" value={form.phoneType} onChange={e => set('phoneType', e.target.value)} className="vll-input">
                <option value="MOBILE">Mobile</option>
                <option value="HOME">Home</option>
                <option value="WORK">Work</option>
              </select>
            </div>
            <div>
              <label className="vll-label">Preferred Contact<span className="required">*</span></label>
              <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
                {['EMAIL', 'PHONE'].map(m => (
                  <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                    <input type="radio" name="preferredContact" value={m} checked={form.preferredContactMethod === m} onChange={() => set('preferredContactMethod', m)} style={{ accentColor: 'var(--theme-color)', width: 15, height: 15 }} />
                    {m === 'EMAIL' ? 'Email' : 'Phone'}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: Home Address ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--dark-color)', margin: '0 0 2px', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
            Home Address
          </p>

          {/* Street Address */}
          <div>
            <label className="vll-label" htmlFor="addressLine1">Street Address<span className="required">*</span></label>
            <AddressAutocomplete
              id="addressLine1"
              value={form.addressLine1}
              onChange={v => set('addressLine1', v)}
              onPlaceSelected={place => {
                setForm(f => ({ ...f, addressLine1: place.addressLine1, city: place.city, state: place.state, zipCode: place.zipCode, placeId: place.placeId }))
                setErrors(e => ({ ...e, addressLine1: '', city: '', zipCode: '' }))
              }}
              error={!!errors.addressLine1}
            />
            {errors.addressLine1 && <p className="field-error" role="alert">{errors.addressLine1}</p>}
          </div>

          {/* Apt / Suite */}
          <div>
            <label className="vll-label" htmlFor="addressLine2">Apt / Suite / Unit</label>
            <input id="addressLine2" type="text" value={form.addressLine2} onChange={e => set('addressLine2', e.target.value)} className="vll-input" />
          </div>

          {/* City */}
          <div>
            <label className="vll-label" htmlFor="city">City<span className="required">*</span></label>
            <input id="city" type="text" value={form.city} onChange={e => set('city', e.target.value)} className={`vll-input${errors.city ? ' error' : ''}`} />
            {errors.city && <p className="field-error" role="alert">{errors.city}</p>}
          </div>

          {/* State + ZIP side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0 12px' }}>
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
        </div>

      </div>

      <WizardNav onNext={handleNext} loading={loading} />
    </div>
  )
}
