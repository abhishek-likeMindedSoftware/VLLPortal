import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWizard } from '@/context/WizardContext'
import WizardNav from '@/components/shared/WizardNav'
import { lookupVin } from '@/services/vinService'
import { saveStep2 } from '@/services/applicationService'
import { toast } from 'react-toastify'
import AddressAutocomplete from '@/components/shared/AddressAutocomplete'

interface VinResult { year: number; make: string; model: string; trim: string }

export default function Step2VehicleInfo() {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const { markStepComplete } = useWizard()
  const [loading, setLoading] = useState(false)

  const [vin, setVin] = useState('')
  const [vinResult, setVinResult] = useState<VinResult | null>(null)
  const [vinStatus, setVinStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle')
  const [vinConfirmed, setVinConfirmed] = useState(false)
  const [vehicleYear, setVehicleYear] = useState('')
  const [vehicleMake, setVehicleMake] = useState('')
  const [vehicleModel, setVehicleModel] = useState('')
  const [vehicleColor, setVehicleColor] = useState('')
  const [purchaseDate, setPurchaseDate] = useState('')
  const [mileageAtPurchase, setMileageAtPurchase] = useState('')
  const [currentMileage, setCurrentMileage] = useState('')
  const [dealerName, setDealerName] = useState('')
  const [dealerAddress, setDealerAddress] = useState('')
  const [dealerCity, setDealerCity] = useState('')
  const [dealerState, setDealerState] = useState('MA')
  const [dealerZip, setDealerZip] = useState('')
  const [dealerPhone, setDealerPhone] = useState('')
  const [dealerEmail, setDealerEmail] = useState('')
  const [manufacturerName, setManufacturerName] = useState('')
  const [warrantyType, setWarrantyType] = useState('MANUFACTURERS_WARRANTY')

  const handleVinBlur = async () => {
    if (vin.length !== 17) return
    setVinStatus('loading')
    setVinConfirmed(false)
    try {
      const result = await lookupVin(vin)
      if (result && result.isValid) {
        setVinResult({ year: result.year ?? 2020, make: result.make ?? '', model: result.model ?? '', trim: result.trim ?? '' })
        setVehicleYear(String(result.year ?? ''))
        setVehicleMake(result.make ?? '')
        setVehicleModel(result.model ?? '')
        setManufacturerName(result.make ?? '')
        if (result.isDuplicate) {
          toast.warning(`A duplicate application exists for this VIN: ${result.duplicateCaseNumbers.join(', ')}`)
        }
        setVinStatus('valid')
      } else {
        setVinStatus('invalid')
        toast.error('This VIN could not be decoded. Please verify the number and try again.')
      }
    } catch {
      // Fallback to static decode for demo
      const fallback = { year: 2020, make: 'Unknown', model: 'Vehicle', trim: 'Standard' }
      setVinResult(fallback)
      setVehicleYear(String(fallback.year))
      setVehicleMake(fallback.make)
      setVehicleModel(fallback.model)
      setManufacturerName(fallback.make)
      setVinStatus('valid')
    }
  }

  const handleNext = async () => {
    setLoading(true)
    try {
      const res = await saveStep2(applicationId!, {
        vIN: vin,
        vinConfirmed,
        vehicleYear: parseInt(vehicleYear) || 2020,
        vehicleMake,
        vehicleModel,
        vehicleColor: vehicleColor || undefined,
        mileageAtPurchase: parseInt(mileageAtPurchase) || 0,
        currentMileage: parseInt(currentMileage) || 0,
        purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
        dealerName,
        dealerAddressLine1: dealerAddress,
        dealerCity,
        dealerState,
        dealerZip,
        dealerPhone: dealerPhone || undefined,
        dealerEmail: dealerEmail || undefined,
        manufacturerName,
        warrantyType,
      })
      if (!res.success) {
        toast.error(res.message || 'Failed to save vehicle info.')
        return
      }
      markStepComplete(2)
      navigate(`/apply/${applicationId}/step/3`)
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
          Vehicle Information
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)' }}>
          Enter your vehicle details. The VIN will be decoded automatically.
        </p>
      </div>

      {/* VIN — full width, compact */}
      <div style={{ background: 'rgba(2,101,163,0.03)', border: '1px solid rgba(2,101,163,0.15)', borderRadius: 8, padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px', alignItems: 'flex-start' }}>
          <div>
            <label className="vll-label" htmlFor="vin">
              Vehicle Identification Number (VIN)<span className="required">*</span>
            </label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                id="vin" type="text" value={vin}
                onChange={e => { setVin(e.target.value.toUpperCase()); setVinStatus('idle'); setVinResult(null); setVinConfirmed(false) }}
                onBlur={handleVinBlur}
                className="vll-input"
                maxLength={17}
                placeholder="17-character VIN"
                style={{ fontFamily: 'monospace', letterSpacing: 2 }}
              />
              {vinStatus === 'loading' && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--theme-color)', whiteSpace: 'nowrap' }}><i className="fa-solid fa-spinner fa-spin"></i></span>}
              {vinStatus === 'valid' && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--mass-primary-green)', fontWeight: 600, whiteSpace: 'nowrap' }}><i className="fa-solid fa-check-circle"></i></span>}
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ms-gray-dark)', marginTop: 4 }}>{vin.length}/17 characters</p>
          </div>
          {vinResult && (
            <div>
              <p style={{ fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--theme-color)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                <i className="fa-solid fa-car" style={{ marginRight: 5 }}></i>Decoded Vehicle
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '3px 12px', fontSize: 'var(--text-sm)', marginBottom: 10 }}>
                <span style={{ color: 'var(--ms-gray-dark)' }}>Year</span><strong>{vinResult.year}</strong>
                <span style={{ color: 'var(--ms-gray-dark)' }}>Make</span><strong>{vinResult.make}</strong>
                <span style={{ color: 'var(--ms-gray-dark)' }}>Model</span><strong>{vinResult.model}</strong>
                <span style={{ color: 'var(--ms-gray-dark)' }}>Trim</span><strong>{vinResult.trim}</strong>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                <input type="checkbox" checked={vinConfirmed} onChange={e => setVinConfirmed(e.target.checked)} style={{ accentColor: 'var(--theme-color)', width: 15, height: 15 }} />
                This information is correct
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Two-panel layout: vehicle details left, dealer info right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 28px', alignItems: 'start' }}>

        {/* ── LEFT PANEL: Vehicle Details ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--dark-color)', margin: '0 0 2px', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
            Vehicle Details
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            <div>
              <label className="vll-label">Year<span className="required">*</span></label>
              <input type="number" value={vehicleYear} onChange={e => setVehicleYear(e.target.value)} className="vll-input" placeholder="2021" />
            </div>
            <div>
              <label className="vll-label">Color</label>
              <input type="text" value={vehicleColor} onChange={e => setVehicleColor(e.target.value)} className="vll-input" placeholder="Silver" />
            </div>
          </div>

          <div>
            <label className="vll-label">Make<span className="required">*</span></label>
            <input type="text" value={vehicleMake} onChange={e => setVehicleMake(e.target.value)} className="vll-input" placeholder="Honda" />
          </div>

          <div>
            <label className="vll-label">Model<span className="required">*</span></label>
            <input type="text" value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} className="vll-input" placeholder="Civic" />
          </div>

          <div>
            <label className="vll-label">Manufacturer Name<span className="required">*</span></label>
            <input type="text" value={manufacturerName} onChange={e => setManufacturerName(e.target.value)} className="vll-input" placeholder="Honda" />
          </div>

          <div>
            <label className="vll-label" htmlFor="purchaseDate">Purchase / Lease Date<span className="required">*</span></label>
            <input id="purchaseDate" type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} className="vll-input" />
          </div>

          <div>
            <label className="vll-label">Warranty Type<span className="required">*</span></label>
            <select value={warrantyType} onChange={e => setWarrantyType(e.target.value)} className="vll-input">
              <option value="MANUFACTURERS_WARRANTY">Manufacturer's Warranty</option>
              <option value="IMPLIED_WARRANTY">Implied Warranty</option>
              <option value="EXTENDED_WARRANTY">Extended Warranty</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            <div>
              <label className="vll-label">Mileage at Purchase<span className="required">*</span></label>
              <input type="number" value={mileageAtPurchase} onChange={e => setMileageAtPurchase(e.target.value)} className="vll-input" placeholder="12500" />
            </div>
            <div>
              <label className="vll-label">Current Mileage<span className="required">*</span></label>
              <input type="number" value={currentMileage} onChange={e => setCurrentMileage(e.target.value)} className="vll-input" placeholder="28000" />
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: Dealer Info ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--dark-color)', margin: '0 0 2px', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
            Selling / Leasing Dealer
          </p>

          <div>
            <label className="vll-label">Dealer Name<span className="required">*</span></label>
            <input type="text" value={dealerName} onChange={e => setDealerName(e.target.value)} className="vll-input" placeholder="ABC Motors" />
          </div>

          <div>
            <label className="vll-label" htmlFor="dealerAddress">Street Address<span className="required">*</span></label>
            <AddressAutocomplete
              id="dealerAddress"
              value={dealerAddress}
              onChange={setDealerAddress}
              onPlaceSelected={place => {
                setDealerAddress(place.addressLine1)
                setDealerCity(place.city)
                setDealerState(place.state)
                setDealerZip(place.zipCode)
              }}
              placeholder="Start typing dealer address…"
            />
          </div>

          <div>
            <label className="vll-label">City<span className="required">*</span></label>
            <input type="text" value={dealerCity} onChange={e => setDealerCity(e.target.value)} className="vll-input" placeholder="Boston" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0 12px' }}>
            <div>
              <label className="vll-label">State</label>
              <input type="text" value={dealerState} onChange={e => setDealerState(e.target.value)} className="vll-input" maxLength={2} />
            </div>
            <div>
              <label className="vll-label">ZIP<span className="required">*</span></label>
              <input type="text" value={dealerZip} onChange={e => setDealerZip(e.target.value)} className="vll-input" placeholder="02101" />
            </div>
          </div>

          <div>
            <label className="vll-label">
              Dealer Phone
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 400, color: 'var(--ms-gray-dark)', marginLeft: 6 }}>optional</span>
            </label>
            <input type="tel" value={dealerPhone} onChange={e => setDealerPhone(e.target.value)} className="vll-input" placeholder="(617) 555-0100" />
          </div>

          <div>
            <label className="vll-label">
              Dealer Email
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 400, color: 'var(--ms-gray-dark)', marginLeft: 6 }}>optional</span>
            </label>
            <input type="email" value={dealerEmail} onChange={e => setDealerEmail(e.target.value)} className="vll-input" placeholder="service@dealership.com" />
          </div>
        </div>

      </div>

      <WizardNav onBack={() => navigate(`/apply/${applicationId}/step/1`)} onNext={handleNext} loading={loading} />
    </div>
  )
}
