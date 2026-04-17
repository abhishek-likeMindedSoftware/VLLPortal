import { Suspense } from 'react'
import type { LazyExoticComponent, ComponentType } from 'react'
import { useParams } from 'react-router-dom'
import { WIZARD_STEP_LABELS } from '@/constants/appConstants'
import { useWizard } from '@/context/WizardContext'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import lazyWithRetry from '@/utils/lazyWithRetry'
import { APPLICATION_TYPE_LABELS } from '@/constants/appConstants'

const STEP_COMPONENTS: Record<number, LazyExoticComponent<ComponentType>> = {
  1: lazyWithRetry(() => import('./steps/Step1ConsumerInfo')),
  2: lazyWithRetry(() => import('./steps/Step2VehicleInfo')),
  3: lazyWithRetry(() => import('./steps/Step3DefectsRepairs')),
  4: lazyWithRetry(() => import('./steps/Step4Narrative')),
  5: lazyWithRetry(() => import('./steps/Step5Documents')),
  6: lazyWithRetry(() => import('./steps/Step6ReviewSubmit')),
}

export default function WizardShell() {
  const { step } = useParams<{ step: string }>()
  const { state } = useWizard()
  const currentStep = parseInt(step ?? '1', 10)
  const StepComponent = STEP_COMPONENTS[currentStep]

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Application type + case number */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 8 }}>
        {state.applicationType && (
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--theme-color)', background: 'rgba(2,101,163,0.08)', padding: '4px 12px', borderRadius: 20 }}>
            <i className="fa-solid fa-car" style={{ marginRight: 6 }}></i>
            {APPLICATION_TYPE_LABELS[state.applicationType]}
          </span>
        )}
        {state.caseNumber && (
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)', fontWeight: 500 }}>
            Case: <strong style={{ color: 'var(--dark-color)' }}>{state.caseNumber}</strong>
          </span>
        )}
      </div>

      {/* Progress steps */}
      <nav aria-label="Application progress" style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
          {Object.entries(WIZARD_STEP_LABELS).map(([s, label]) => {
            const stepNum = parseInt(s)
            const isComplete = state.completedSteps.includes(stepNum)
            const isCurrent = stepNum === currentStep
            return (
              <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {stepNum < 6 && (
                  <div style={{ position: 'absolute', top: 15, left: '50%', width: '100%', height: 2, background: isComplete ? 'var(--mass-primary-green)' : '#e5e7eb', zIndex: 0 }} />
                )}
                <div
                  className={`wizard-step-dot ${isComplete ? 'complete' : isCurrent ? 'current' : 'pending'}`}
                  aria-current={isCurrent ? 'step' : undefined}
                  style={{ zIndex: 1, position: 'relative' }}
                >
                  {isComplete ? <i className="fa-solid fa-check" style={{ fontSize: 12 }}></i> : stepNum}
                </div>
                <span style={{ fontSize: 10, fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--theme-color)' : isComplete ? 'var(--dark-color)' : '#9ca3af', textAlign: 'center', marginTop: 6, lineHeight: 1.3, display: 'none' }} className="step-label-desktop">
                  {label}
                </span>
              </div>
            )
          })}
        </div>
        {/* Current step label */}
        <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--theme-color)', marginTop: 12 }}>
          Step {currentStep} of 6 — {WIZARD_STEP_LABELS[currentStep]}
        </p>
      </nav>

      {/* Step content */}
      <div className="vll-card" style={{ padding: '32px 36px' }}>
        <Suspense fallback={<LoadingSpinner />}>
          {StepComponent ? <StepComponent /> : <p>Step not found.</p>}
        </Suspense>
      </div>
    </div>
  )
}
