import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWizard } from '@/context/WizardContext'
import WizardNav from '@/components/shared/WizardNav'

interface Defect { id: string; description: string; category: string; firstOccurrence: string; isOngoing: boolean }
interface Repair { id: string; repairDate: string; facilityName: string; defectsAddressed: string; repairSuccessful: boolean; daysOutOfService: string }

const DEFECT_CATEGORIES = ['SAFETY_DEFECT','MAJOR_DEFECT','MINOR_DEFECT','BRAKES','STEERING','ENGINE','ELECTRICAL','TRANSMISSION','OTHER']
const CATEGORY_LABELS: Record<string, string> = {
  SAFETY_DEFECT: 'Safety Defect', MAJOR_DEFECT: 'Major Defect', MINOR_DEFECT: 'Minor Defect',
  BRAKES: 'Brakes', STEERING: 'Steering', ENGINE: 'Engine', ELECTRICAL: 'Electrical',
  TRANSMISSION: 'Transmission', OTHER: 'Other',
}

export default function Step3DefectsRepairs() {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const { markStepComplete } = useWizard()
  const [defects, setDefects] = useState<Defect[]>([{ id: '1', description: '', category: 'ENGINE', firstOccurrence: '', isOngoing: true }])
  const [repairs, setRepairs] = useState<Repair[]>([{ id: '1', repairDate: '', facilityName: '', defectsAddressed: '', repairSuccessful: false, daysOutOfService: '' }])
  const [loading, setLoading] = useState(false)

  const addDefect = () => setDefects(d => [...d, { id: Date.now().toString(), description: '', category: 'ENGINE', firstOccurrence: '', isOngoing: true }])
  const removeDefect = (id: string) => setDefects(d => d.filter(x => x.id !== id))
  const updateDefect = (id: string, field: keyof Defect, value: string | boolean) =>
    setDefects(d => d.map(x => x.id === id ? { ...x, [field]: value } : x))

  const addRepair = () => setRepairs(r => [...r, { id: Date.now().toString(), repairDate: '', facilityName: '', defectsAddressed: '', repairSuccessful: false, daysOutOfService: '' }])
  const removeRepair = (id: string) => setRepairs(r => r.filter(x => x.id !== id))
  const updateRepair = (id: string, field: keyof Repair, value: string | boolean) =>
    setRepairs(r => r.map(x => x.id === id ? { ...x, [field]: value } : x))

  const handleNext = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    markStepComplete(3)
    setLoading(false)
    navigate(`/apply/${applicationId}/step/4`)
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 'var(--text-lg-med)', fontWeight: 700, color: 'var(--theme-color)', marginBottom: 6 }}>
          Defects & Repair History
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)' }}>
          Describe each defect and list all repair attempts made.
        </p>
      </div>

      {/* Defects */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 'var(--text-base-med)', fontWeight: 700, color: 'var(--dark-color)', margin: 0 }}>
            Defects / Nonconformities
          </h3>
          <button onClick={addDefect} className="btn-outline-theme" style={{ fontSize: 'var(--text-xs)', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="fa-solid fa-plus"></i> Add Defect
          </button>
        </div>
        {defects.map((d, i) => (
          <div key={d.id} className="vll-card" style={{ padding: 20, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--theme-color)' }}>Defect #{i + 1}</span>
              {defects.length > 1 && (
                <button onClick={() => removeDefect(d.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="vll-label">Description<span className="required">*</span></label>
                <textarea value={d.description} onChange={e => updateDefect(d.id, 'description', e.target.value)} className="vll-input" rows={3} placeholder="Describe the defect in detail…" style={{ resize: 'vertical' }} />
              </div>
              <div>
                <label className="vll-label">Category<span className="required">*</span></label>
                <select value={d.category} onChange={e => updateDefect(d.id, 'category', e.target.value)} className="vll-input">
                  {DEFECT_CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                </select>
              </div>
              <div>
                <label className="vll-label">First Occurrence Date<span className="required">*</span></label>
                <input type="date" value={d.firstOccurrence} onChange={e => updateDefect(d.id, 'firstOccurrence', e.target.value)} className="vll-input" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                  <input type="checkbox" checked={d.isOngoing} onChange={e => updateDefect(d.id, 'isOngoing', e.target.checked)} style={{ accentColor: 'var(--theme-color)', width: 16, height: 16 }} />
                  Defect is still present / ongoing
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Repairs */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 'var(--text-base-med)', fontWeight: 700, color: 'var(--dark-color)', margin: 0 }}>
            Repair Attempts
          </h3>
          <button onClick={addRepair} className="btn-outline-theme" style={{ fontSize: 'var(--text-xs)', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="fa-solid fa-plus"></i> Add Repair
          </button>
        </div>
        {repairs.map((r, i) => (
          <div key={r.id} className="vll-card" style={{ padding: 20, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--theme-color)' }}>Repair Attempt #{i + 1}</span>
              {repairs.length > 1 && (
                <button onClick={() => removeRepair(r.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
              <div>
                <label className="vll-label">Repair Date<span className="required">*</span></label>
                <input type="date" value={r.repairDate} onChange={e => updateRepair(r.id, 'repairDate', e.target.value)} className="vll-input" />
              </div>
              <div>
                <label className="vll-label">Repair Facility<span className="required">*</span></label>
                <input type="text" value={r.facilityName} onChange={e => updateRepair(r.id, 'facilityName', e.target.value)} className="vll-input" placeholder="ABC Motors Service" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="vll-label">What was done / attempted<span className="required">*</span></label>
                <textarea value={r.defectsAddressed} onChange={e => updateRepair(r.id, 'defectsAddressed', e.target.value)} className="vll-input" rows={2} placeholder="Describe what the repair facility did…" style={{ resize: 'vertical' }} />
              </div>
              <div>
                <label className="vll-label">Days Out of Service</label>
                <input type="number" value={r.daysOutOfService} onChange={e => updateRepair(r.id, 'daysOutOfService', e.target.value)} className="vll-input" placeholder="3" />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                  <input type="checkbox" checked={r.repairSuccessful} onChange={e => updateRepair(r.id, 'repairSuccessful', e.target.checked)} style={{ accentColor: 'var(--mass-primary-green)', width: 16, height: 16 }} />
                  Repair was successful
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <WizardNav onBack={() => navigate(`/apply/${applicationId}/step/2`)} onNext={handleNext} loading={loading} />
    </div>
  )
}
