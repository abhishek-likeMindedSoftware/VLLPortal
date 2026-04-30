import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWizard } from '@/context/WizardContext'
import { APPLICATION_TYPE_LABELS } from '@/constants/appConstants'
import WizardNav from '@/components/shared/WizardNav'
import { submitApplication } from '@/services/applicationService'
import { sendVerificationCode, confirmVerificationCode } from '@/services/verificationService'
import { toast } from 'react-toastify'

export default function Step6ReviewSubmit() {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const { state, markStepComplete } = useWizard()
  const [verificationCode, setVerificationCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [codeVerified, setCodeVerified] = useState(false)
  const [certAccepted, setCertAccepted] = useState(false)
  const [signatureName, setSignatureName] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [verifyingCode, setVerifyingCode] = useState(false)

  const consumerEmail = state.step1?.emailAddress ?? ''

  const handleSendCode = async () => {
    if (!consumerEmail) {
      toast.error('No email address found. Please go back to Step 1 and enter your email.')
      return
    }
    setSendingCode(true)
    try {
      const res = await sendVerificationCode(consumerEmail)
      if (res.success) {
        setCodeSent(true)
        toast.success(`Verification code sent to ${consumerEmail}`)
      } else {
        toast.error(res.message || 'Failed to send verification code.')
      }
    } catch {
      toast.error('Failed to send verification code. Please try again.')
    } finally {
      setSendingCode(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) return
    setVerifyingCode(true)
    try {
      const res = await confirmVerificationCode(consumerEmail, verificationCode.trim())
      if (res.success && res.data?.verified) {
        setCodeVerified(true)
        toast.success('Email verified successfully.')
      } else {
        toast.error(res.message || 'Invalid or expired code. Please try again.')
      }
    } catch {
      toast.error('Verification failed. Please try again.')
    } finally {
      setVerifyingCode(false)
    }
  }

  const handleSubmit = async () => {
    if (!codeVerified || !certAccepted || !signatureName.trim()) return
    setLoading(true)
    try {
      const res = await submitApplication(applicationId!, {
        emailVerificationCode: verificationCode,
        certificationAccepted: certAccepted,
        signatureFullName: signatureName,
      })

      if (!res.success) {
        toast.error(res.message || 'Submission failed. Please try again.')
        return
      }

      markStepComplete(6)
      setSubmitted(true)
    } catch {
      toast.error('Submission failed. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(56,133,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <i className="fa-solid fa-check" style={{ fontSize: 32, color: 'var(--mass-primary-green)' }}></i>
        </div>
        <h2 style={{ fontSize: 'var(--text-xl-med)', fontWeight: 800, color: 'var(--mass-primary-green)', marginBottom: 12 }}>
          Application Submitted!
        </h2>
        <p style={{ fontSize: 'var(--text-base-med)', color: 'var(--ms-gray-dark)', marginBottom: 8 }}>
          Your case number is <strong style={{ color: 'var(--theme-color)' }}>{state.caseNumber}</strong>
        </p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)', maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.7 }}>
          A confirmation email has been sent with a secure link to track your application status.
          OCABR staff will review your application and contact you within 5–7 business days.
        </p>
        <button onClick={() => navigate('/status')} className="btn-theme" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <i className="fa-solid fa-magnifying-glass"></i> Track Application Status
        </button>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 'var(--text-lg-med)', fontWeight: 700, color: 'var(--theme-color)', marginBottom: 6 }}>
          Review & Submit
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)' }}>
          Review your application before submitting. All information will be sent to OCABR.
        </p>
      </div>

      {/* Two-panel layout: summary + verification left, certification right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 28px', alignItems: 'start' }}>

        {/* ── LEFT: Summary + Email Verification ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--dark-color)', margin: '0 0 2px', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
            Application Summary
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 16px', fontSize: 'var(--text-sm)' }}>
            <span style={{ color: 'var(--ms-gray-dark)' }}>Case Number</span>
            <strong style={{ color: 'var(--theme-color)' }}>{state.caseNumber}</strong>
            <span style={{ color: 'var(--ms-gray-dark)' }}>Application Type</span>
            <strong>{APPLICATION_TYPE_LABELS[state.applicationType ?? 'NEW_CAR']}</strong>
            <span style={{ color: 'var(--ms-gray-dark)' }}>Steps Completed</span>
            <div>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: state.completedSteps.includes(s) ? 'var(--mass-primary-green)' : '#e5e7eb', color: state.completedSteps.includes(s) ? '#fff' : '#9ca3af', fontSize: 10, fontWeight: 700, marginRight: 3 }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Email Verification */}
          <div style={{ marginTop: 8 }}>
            <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--dark-color)', margin: '0 0 10px', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
              <i className="fa-solid fa-envelope" style={{ marginRight: 6, color: 'var(--theme-color)' }}></i>
              Email Verification
            </p>
            {!codeVerified ? (
              <>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)', marginBottom: 12 }}>
                  We'll send a one-time code to <strong>{consumerEmail || 'your email'}</strong>.
                </p>
                {!codeSent ? (
                  <button onClick={handleSendCode} disabled={sendingCode} className="btn-theme" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)' }}>
                    {sendingCode ? <><i className="fa-solid fa-spinner fa-spin"></i> Sending…</> : <><i className="fa-solid fa-paper-plane"></i> Send Code</>}
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <label className="vll-label" htmlFor="code">6-digit code</label>
                      <input id="code" type="text" value={verificationCode} onChange={e => setVerificationCode(e.target.value)} className="vll-input" placeholder="123456" maxLength={8} style={{ fontFamily: 'monospace', letterSpacing: 4, fontSize: 18 }} />
                    </div>
                    <button onClick={handleVerifyCode} disabled={verifyingCode || !verificationCode.trim()} className="btn-theme" style={{ padding: '10px 16px', flexShrink: 0 }}>
                      {verifyingCode ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Verify'}
                    </button>
                  </div>
                )}
                {codeSent && (
                  <button onClick={handleSendCode} disabled={sendingCode} style={{ marginTop: 8, background: 'none', border: 'none', color: 'var(--theme-color)', fontSize: 'var(--text-sm)', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                    Resend code
                  </button>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--mass-primary-green)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                <i className="fa-solid fa-check-circle" style={{ fontSize: 18 }}></i>
                Email verified
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Certification + Signature ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--dark-color)', margin: '0 0 2px', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
            <i className="fa-solid fa-pen-to-square" style={{ marginRight: 6, color: 'var(--theme-color)' }}></i>
            Certification & Signature
          </p>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
            <input type="checkbox" checked={certAccepted} onChange={e => setCertAccepted(e.target.checked)} style={{ marginTop: 3, accentColor: 'var(--theme-color)', width: 16, height: 16, flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, color: 'var(--dark-color)' }}>
              I certify that the information provided in this application is accurate and complete to the best of my knowledge.
              I understand that providing false information may result in dismissal of my application.
            </span>
          </label>

          <div>
            <label className="vll-label" htmlFor="signature">
              Electronic Signature — Type your full legal name<span className="required">*</span>
            </label>
            <input
              id="signature" type="text" value={signatureName}
              onChange={e => setSignatureName(e.target.value)}
              className="vll-input"
              placeholder="Jane M. Smith"
              style={{ fontStyle: 'italic', fontSize: 18 }}
            />
          </div>

          {(!codeVerified || !certAccepted || !signatureName.trim()) && (
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 6, padding: '10px 14px', fontSize: 'var(--text-xs)', color: '#92400e' }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: 6 }}></i>
              To submit: verify your email, accept the certification, and sign your name.
            </div>
          )}
        </div>

      </div>

      <WizardNav
        onBack={() => navigate(`/apply/${applicationId}/step/5`)}
        onNext={handleSubmit}
        nextLabel="Submit Application"
        loading={loading}
        disableNext={!codeVerified || !certAccepted || !signatureName.trim()}
      />
    </div>
  )
}
