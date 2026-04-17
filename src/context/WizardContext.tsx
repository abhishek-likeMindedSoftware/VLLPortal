import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type ApplicationType = 'NEW_CAR' | 'USED_CAR' | 'LEASED'

interface WizardState {
  applicationId: string | null
  caseNumber: string | null
  applicationType: ApplicationType | null
  currentStep: number
  completedSteps: number[]
  emailVerified: boolean
}

interface WizardContextValue {
  state: WizardState
  setApplicationId: (id: string) => void
  setCaseNumber: (cn: string) => void
  setApplicationType: (type: ApplicationType) => void
  setCurrentStep: (step: number) => void
  markStepComplete: (step: number) => void
  setEmailVerified: (v: boolean) => void
  reset: () => void
}

const defaultState: WizardState = {
  applicationId: null,
  caseNumber: null,
  applicationType: null,
  currentStep: 1,
  completedSteps: [],
  emailVerified: false,
}

const WizardContext = createContext<WizardContextValue | null>(null)

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<WizardState>(defaultState)

  const setApplicationId = (id: string) => setState(s => ({ ...s, applicationId: id }))
  const setCaseNumber = (cn: string) => setState(s => ({ ...s, caseNumber: cn }))
  const setApplicationType = (type: ApplicationType) => setState(s => ({ ...s, applicationType: type }))
  const setCurrentStep = (step: number) => setState(s => ({ ...s, currentStep: step }))
  const markStepComplete = (step: number) =>
    setState(s => ({ ...s, completedSteps: [...new Set([...s.completedSteps, step])] }))
  const setEmailVerified = (v: boolean) => setState(s => ({ ...s, emailVerified: v }))
  const reset = () => setState(defaultState)

  return (
    <WizardContext.Provider value={{
      state, setApplicationId, setCaseNumber, setApplicationType,
      setCurrentStep, markStepComplete, setEmailVerified, reset
    }}>
      {children}
    </WizardContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useWizard = (): WizardContextValue => {
  const ctx = useContext(WizardContext)
  if (!ctx) throw new Error('useWizard must be used within WizardProvider')
  return ctx
}
