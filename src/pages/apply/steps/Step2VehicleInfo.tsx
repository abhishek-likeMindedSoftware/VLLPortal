import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWizard } from '@/context/WizardContext'
import WizardNav from '@/components/shared/WizardNav'

interface VinResult { year: number; make: string; model: string; trim: string }

// Simulated VIN decode — no external API needed for demo
const MOCK_VINS: Record<string, VinResult> = {
  '1HGBH41JXMN109186': { year: 2021, make: 'Honda', model: 'Civic', trim: 'EX' },
  '2T1BURHE0JC043821': { year: 2018, make: 'Toyota', model: 'Corolla', trim: 'LE' },
  '1FTFW1ET5DFC10312': { year: 2013, make: 'Ford', model: 'F-150', trim: 'XLT' },
}

export default function Step2VehicleInfo() {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const { markStepComplete } = useWizard()

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
  const [manufacturerName, setManufacturerName] = useState('')
  const [warrantyType, setWarrantyType] = useState('MANUFACTURERS_WARRANTY')
  const [loading, setLoading] = useState(false)

  const handleVinBlur = async () => {
    if (vin.length !== 17) return
    setVinStatus('loading')
    setVinConfirmed(false)
    await new Promise(r => setTimeout(r, 800))
    const result = MOCK_VINS[vin.toUpperCase()] ?? {
      year: 2020, make: 'Unknown', model: 'Vehicle', trim: 'Standard'
    }
    setVinResult(result)
    setVehicleYear(String(result.year))
    setVehicleMake(result.make)
    setVehicleModel(result.model)
    setManufacturerName(result.make)
    setVinStatus('valid')
  }

  const handleNext = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    markStepComplete(2)
    setLoading(false)
    navigate(`/apply/${applicationId}/step/3`)
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 'var(--text-lg-med)', fontWeight: 700, color: 'var(--theme-color)', marginBottom: 6 }}>
          Vehicle Information
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)' }}>
          Enter your vehicle details. The VIN will be decoded automatically.
        </p>
      </div>

      {/* VIN */}
      <div className="vll-card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 'var(--text-base-med)', fontWeight: 700, color: 'var(--dark-color)', marginBottom: 16 }}>
          Vehicle Identification Number (VIN)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'flex-end', maxWidth: 480 }}>
          <div>
            <label className="vll-label" htmlFor="vin">VIN<span className="required">*</span></label>
            <input
              id="vin" type="text" value={vin}
              onChange={e => { setVin(e.target.value.toUpperCase()); setVinStatus('idle'); setVinResult(null); setVinConfirmed(false) }}
              onBlur={handleVinBlur}
              className="vll-input"
              maxLength={17}
              placeholder="17-character VIN"
              style={{ fontFamily: 'monospace', letterSpacing: 2 }}
            />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ms-gray-dark)', marginTop: 4 }}>
              {vin.length}/17 characters
            </p>
          </div>
          <div style={{ paddingBottom: 28 }}>
            {vinStatus === 'loading' && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--theme-color)' }}><i className="fa-solid fa-spinner fa-spin"></i> Decoding…</span>}
            {vinStatus === 'valid' && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--mass-primary-green)', fontWeight: 600 }}><i className="fa-solid fa-check-circle"></i> Decoded</span>}
          </div>
        </div>

        {vinResult && (
          <div style={{ background: 'rgba(2,101,163,0.05)', border: '1px solid rgba(2,101,163,0.2)', borderRadius: 8, padding: '14px 18px', marginTop: 8, maxWidth: 480 }}>
            <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--theme-color)', marginBottom: 8 }}>
              <i className="fa-solid fa-car" style={{ marginRight: 6 }}></i>Decoded Vehicle
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', fontSize: 'var(--text-sm)' }}>
              <span style={{ color: 'var(--ms-gray-dark)' }}>Year:</span><strong>{vinResult.year}</strong>
              <span style={{ color: 'var(--ms-gray-dark)' }}>Make:</span><strong>{vinResult.make}</strong>
              <span style={{ color: 'var(--ms-gray-dark)' }}>Model:</span><strong>{vinResult.model}</strong>
              <span style={{ color: 'var(--ms-gray-dark)' }}>Trim:</span><strong>{vinResult.trim}</strong>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
              <input type="checkbox" checked={vinConfirmed} onChange={e => setVinConfirmed(e.target.checked)} style={{ accentColor: 'var(--theme-color)', width: 16, height: 16 }} />
              This vehicle information is correct
            </label>
          </div>
        )}
      </div>

      {/* Vehicle details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', marginBottom: 24 }}>
        {[
          { label: 'Year', value: vehicleYear, set: setVehicleYear, type: 'number', placeholder: '2021' },
          { label: 'Make', value: vehicleMake, set: setVehicleMake, placeholder: 'Honda' },
          { label: 'Model', value: vehicleModel, set: setVehicleModel, placeholder: 'Civic' },
          { label: 'Color', value: vehicleColor, set: setVehicleColor, placeholder: 'Silver' },
        ].map(({ label, value, set, type, placeholder }) => (
          <div key={label}>
            <label className="vll-label">{label}{label !== 'Color' && <span className="required">*</span>}</label>
            <input type={type ?? 'text'} value={value} onChange={e => set(e.target.value)} className="vll-input" placeholder={placeholder} />
          </div>
        ))}
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
        <div>
          <label className="vll-label">Mileage at Purchase<span className="required">*</span></label>
          <input type="number" value={mileageAtPurchase} onChange={e => setMileageAtPurchase(e.target.value)} className="vll-input" placeholder="12500" />
        </div>
        <div>
          <label className="vll-label">Current Mileage<span className="required">*</span></label>
          <input type="number" value={currentMileage} onChange={e => setCurrentMileage(e.target.value)} className="vll-input" placeholder="28000" />
        </div>
      </div>

      {/* Dealer */}
      <div className="vll-card" style={{ padding: 24, marginBottom: 8 }}>
        <h3 style={{ fontSize: 'var(--text-base-med)', fontWeight: 700, color: 'var(--dark-color)', marginBottom: 16 }}>
          Selling / Leasing Dealer
        </h3>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ms-gray-dark)', marginBottom: 16 }}>
          <i className="fa-solid fa-location-dot" style={{ marginRight: 4, color: 'var(--theme-color)' }}></i>
          In a live environment, dealer address uses Google Places autocomplete.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label className="vll-label">Dealer Name<span className="required">*</span></label>
            <input type="text" value={dealerName} onChange={e => setDealerName(e.target.value)} className="vll-input" placeholder="ABC Motors" />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label className="vll-label">Street Address<span className="required">*</span></label>
            <input type="text" value={dealerAddress} onChange={e => setDealerAddress(e.target.value)} className="vll-input" placeholder="123 Main St" />
          </div>
          <div>
            <label className="vll-label">City<span className="required">*</span></label>
            <input type="text" value={dealerCity} onChange={e => setDealerCity(e.target.value)} className="vll-input" placeholder="Boston" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12 }}>
            <div>
              <label className="vll-label">State</label>
              <input type="text" value={dealerState} onChange={e => setDealerState(e.target.value)} className="vll-input" maxLength={2} />
            </div>
            <div>
              <label className="vll-label">ZIP<span className="required">*</span></label>
              <input type="text" value={dealerZip} onChange={e => setDealerZip(e.target.value)} className="vll-input" placeholder="02101" />
            </div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label className="vll-label">Manufacturer Name<span className="required">*</span></label>
            <input type="text" value={manufacturerName} onChange={e => setManufacturerName(e.target.value)} className="vll-input" placeholder="Honda" />
          </div>
        </div>
      </div>

      <WizardNav onBack={() => navigate(`/apply/${applicationId}/step/1`)} onNext={handleNext} loading={loading} />
    </div>
  )
}
