import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWizard } from '@/context/WizardContext'
import WizardNav from '@/components/shared/WizardNav'
import { uploadDocument, deleteDocument, getApplicationDocumentPreviewUrl } from '@/services/applicationService'
import { toast } from 'react-toastify'

interface UploadedDoc {
  id: string        // documentId from API
  name: string
  type: string
  size: string
  status: 'uploading' | 'done' | 'error'
}

const REQUIRED_DOCS: Record<string, string[]> = {
  NEW_CAR: ['Purchase Contract', 'RMV-1 Registration', 'Repair Records', 'Warranty Document'],
  USED_CAR: ['Purchase Contract', 'RMV-1 Registration', 'Repair Records'],
  LEASED: ['Lease Agreement', 'RMV-1 Registration', 'Repair Records', 'Warranty Document'],
}

const DOC_TYPES = [
  { value: 'PURCHASE_CONTRACT', label: 'Purchase Contract' },
  { value: 'LEASE_AGREEMENT', label: 'Lease Agreement' },
  { value: 'RMV1_REGISTRATION', label: 'RMV-1 Registration' },
  { value: 'REPAIR_RECORDS', label: 'Repair Records' },
  { value: 'WARRANTY_DOCUMENT', label: 'Warranty Document' },
  { value: 'EXPENSE_RECEIPT', label: 'Expense Receipt' },
  { value: 'OTHER', label: 'Other' },
]

export default function Step5Documents() {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const { markStepComplete, state } = useWizard()
  const [docs, setDocs] = useState<UploadedDoc[]>([])
  const [selectedType, setSelectedType] = useState('PURCHASE_CONTRACT')
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [previewingDocId, setPreviewingDocId] = useState<string | null>(null)

  const appType = state.applicationType ?? 'NEW_CAR'
  const requiredDocs = REQUIRED_DOCS[appType] ?? REQUIRED_DOCS.NEW_CAR

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    for (const file of fileArray) {
      // Validate size (25 MB max per spec §2.6)
      if (file.size > 25 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the 25 MB limit.`)
        continue
      }
      // Validate mime type
      const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff']
      if (!allowed.includes(file.type)) {
        toast.error(`${file.name}: only PDF, JPEG, PNG, and TIFF files are accepted.`)
        continue
      }

      const tempId = `temp_${Date.now()}_${Math.random()}`
      const newDoc: UploadedDoc = {
        id: tempId,
        name: file.name,
        type: selectedType,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        status: 'uploading',
      }
      setDocs(d => [...d, newDoc])

      try {
        const res = await uploadDocument(applicationId!, file, selectedType)
        if (res.success) {
          setDocs(d => d.map(x =>
            x.id === tempId
              ? { ...x, id: res.data.documentId, status: 'done' }
              : x
          ))
        } else {
          setDocs(d => d.map(x => x.id === tempId ? { ...x, status: 'error' } : x))
          toast.error(res.message || `Failed to upload ${file.name}.`)
        }
      } catch {
        setDocs(d => d.map(x => x.id === tempId ? { ...x, status: 'error' } : x))
        toast.error(`Upload failed for ${file.name}. Please try again.`)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeDoc = async (doc: UploadedDoc) => {
    // Only call delete API if the upload succeeded (has a real GUID id)
    if (doc.status === 'done' && !doc.id.startsWith('temp_')) {
      try {
        await deleteDocument(applicationId!, doc.id)
      } catch {
        // Non-fatal — remove from UI anyway
      }
    }
    setDocs(d => d.filter(x => x.id !== doc.id))
  }

  const handlePreviewDocument = async (documentId: string) => {
    if (!applicationId) return
    setPreviewingDocId(documentId)
    try {
      const url = await getApplicationDocumentPreviewUrl(applicationId, documentId)
      if (url) {
        window.open(url, '_blank')
      } else {
        toast.error('Failed to generate preview link.')
      }
    } catch {
      toast.error('Failed to open document preview.')
    } finally {
      setPreviewingDocId(null)
    }
  }

  const handleNext = async () => {
    // Check all uploads are done (no in-progress)
    if (docs.some(d => d.status === 'uploading')) {
      toast.warning('Please wait for all uploads to complete.')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 200))
    markStepComplete(5)
    setLoading(false)
    navigate(`/apply/${applicationId}/step/6`)
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 'var(--text-lg-med)', fontWeight: 700, color: 'var(--theme-color)', marginBottom: 6 }}>
          Upload Documents
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)' }}>
          Accepted formats: PDF, JPEG, PNG, TIFF. Maximum 25 MB per file.
        </p>
      </div>

      {/* Two-panel layout: checklist left, upload right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 28px', alignItems: 'start' }}>

        {/* ── LEFT: Required docs checklist ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--dark-color)', margin: '0 0 2px', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
            Required for {appType.replace('_', ' ')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {requiredDocs.map(doc => {
              const uploaded = docs.some(
                d => DOC_TYPES.find(t => t.value === d.type)?.label === doc && d.status === 'done'
              )
              return (
                <div key={doc} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--text-sm)', padding: '8px 12px', borderRadius: 6, background: uploaded ? 'rgba(56,133,87,0.06)' : '#fafafa', border: `1px solid ${uploaded ? 'rgba(56,133,87,0.2)' : '#e5e7eb'}` }}>
                  <i className={`fa-solid ${uploaded ? 'fa-check-circle' : 'fa-circle'}`} style={{ color: uploaded ? 'var(--mass-primary-green)' : '#d1d5db', fontSize: 16, flexShrink: 0 }} />
                  <span style={{ fontWeight: uploaded ? 600 : 400, color: uploaded ? 'var(--dark-color)' : 'var(--ms-gray-dark)' }}>{doc}</span>
                  {uploaded && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--mass-primary-green)', fontWeight: 600, marginLeft: 'auto' }}>✓</span>}
                </div>
              )
            })}
          </div>

          {/* Uploaded files list */}
          {docs.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--dark-color)', marginBottom: 10 }}>
                Uploaded ({docs.filter(d => d.status === 'done').length})
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {docs.map(doc => (
                  <div key={doc.id} className="vll-card" style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <i className="fa-solid fa-file-pdf" style={{ color: '#dc3545', fontSize: 16, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: 'var(--text-xs)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</p>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ms-gray-dark)', margin: 0 }}>{DOC_TYPES.find(t => t.value === doc.type)?.label} · {doc.size}</p>
                    </div>
                    {doc.status === 'uploading' && <i className="fa-solid fa-spinner fa-spin" style={{ color: 'var(--theme-color)', fontSize: 13 }} />}
                    {doc.status === 'done' && (
                      <>
                        <button
                          onClick={() => handlePreviewDocument(doc.id)}
                          disabled={previewingDocId === doc.id}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--theme-color)',
                            cursor: previewingDocId === doc.id ? 'wait' : 'pointer',
                            padding: 4,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 'var(--text-xs)',
                            fontWeight: 600
                          }}
                          title="Preview document"
                        >
                          {previewingDocId === doc.id ? (
                            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 13 }} />
                          ) : (
                            <i className="fa-solid fa-eye" style={{ fontSize: 13 }} />
                          )}
                        </button>
                        <i className="fa-solid fa-check-circle" style={{ color: 'var(--mass-primary-green)', fontSize: 14 }} />
                      </>
                    )}
                    {doc.status === 'error' && <i className="fa-solid fa-circle-exclamation" style={{ color: '#dc3545', fontSize: 14 }} />}
                    <button onClick={() => removeDoc(doc)} disabled={doc.status === 'uploading'} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 2 }} aria-label="Remove">
                      <i className="fa-solid fa-xmark" style={{ fontSize: 13 }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Upload area ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--dark-color)', margin: '0 0 2px', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
            Upload a Document
          </p>

          <div>
            <label className="vll-label">Document Type</label>
            <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="vll-input">
              {DOC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragOver ? 'var(--theme-color)' : '#d1d5db'}`,
              borderRadius: 10, padding: '28px 20px', textAlign: 'center',
              background: dragOver ? 'rgba(2,101,163,0.04)' : '#fafafa',
              transition: 'all 0.15s', cursor: 'pointer',
            }}
          >
            <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: 28, color: 'var(--theme-color)', marginBottom: 10, display: 'block' }} />
            <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--dark-color)', margin: '0 0 4px' }}>Drag & drop files here</p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ms-gray-dark)', margin: '0 0 14px' }}>or</p>
            <label className="btn-theme" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)' }}>
              <i className="fa-solid fa-folder-open" /> Browse Files
              <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.tiff" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

      </div>

      <WizardNav
        onBack={() => navigate(`/apply/${applicationId}/step/4`)}
        onNext={handleNext}
        loading={loading}
      />
    </div>
  )
}
