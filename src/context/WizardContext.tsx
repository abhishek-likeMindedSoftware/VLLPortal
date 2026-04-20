import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type ApplicationType = 'NEW_CAR' | 'USED_CAR' | 'LEASED'

// ── Step data shapes (mirror the API DTOs) ────────────────────────────────────

export interface Step1Data {
  firstName: string; middleName?: string; lastName: string
  emailAddress: string; phoneNumber: string; phoneType: string
  addressLine1: string; addressLine2?: string
  city: string; state: string; zipCode: string
  placeId?: string; preferredContactMethod: string
}

export interface Step2Data {
  vIN: string; vinConfirmed: boolean
  vehicleYear: number; vehicleMake: string; vehicleModel: string
  vehicleColor?: string; licensePlate?: string; licensePlateState?: string
  purchaseDate: string; purchasePrice?: number
  mileageAtPurchase: number; currentMileage: number
  dealerName: string; dealerAddressLine1: string; dealerAddressLine2?: string
  dealerCity: string; dealerState: string; dealerZip: string
  dealerPhone?: string; dealerEmail?: string; dealerPlaceId?: string
  manufacturerName: string; warrantyType: string
  warrantyStartDate?: string; warrantyExpiryDate?: string
}

export interface DefectItem {
  defectDescription: string; defectCategory: string
  firstOccurrenceDate: string; isOngoing: boolean; sortOrder: number
}

export interface RepairItem {
  repairDate: string; repairFacilityName: string
  defectsAddressed: string; repairSuccessful: boolean
  daysOutOfService?: number; sortOrder: number
}

export interface Step3Data {
  defects: DefectItem[]
  repairAttempts: RepairItem[]
  expenses: Array<{ expenseType: string; amount: number; expenseDate?: string; description?: string }>
}

export interface Step4Data {
  narrativeStatement: string
  priorContactWithDealer: boolean; priorContactWithMfr: boolean
  priorContactNotes?: string; desiredResolution: string
}

// ── Wizard state ──────────────────────────────────────────────────────────────

interface WizardState {
  applicationId: string | null
  caseNumber: string | null
  applicationType: ApplicationType | null
  completedSteps: number[]
  emailVerified: boolean
  // All form data stored locally — submitted once at Step 6
  step1: Step1Data | null
  step2: Step2Data | null
  step3: Step3Data | null
  step4: Step4Data | null
}

interface WizardContextValue {
  state: WizardState
  setApplicationId: (id: string) => void
  setCaseNumber: (cn: string) => void
  setApplicationType: (type: ApplicationType) => void
  markStepComplete: (step: number) => void
  setEmailVerified: (v: boolean) => void
  saveStep1: (data: Step1Data) => void
  saveStep2: (data: Step2Data) => void
  saveStep3: (data: Step3Data) => void
  saveStep4: (data: Step4Data) => void
  reset: () => void
}

const defaultState: WizardState = {
  applicationId: null,
  caseNumber: null,
  applicationType: null,
  completedSteps: [],
  emailVerified: false,
  step1: null,
  step2: null,
  step3: null,
  step4: null,
}

const WizardContext = createContext<WizardContextValue | null>(null)

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<WizardState>(defaultState)

  const setApplicationId = (id: string) => setState(s => ({ ...s, applicationId: id }))
  const setCaseNumber = (cn: string) => setState(s => ({ ...s, caseNumber: cn }))
  const setApplicationType = (type: ApplicationType) => setState(s => ({ ...s, applicationType: type }))
  const markStepComplete = (step: number) =>
    setState(s => ({ ...s, completedSteps: [...new Set([...s.completedSteps, step])] }))
  const setEmailVerified = (v: boolean) => setState(s => ({ ...s, emailVerified: v }))
  const saveStep1 = (data: Step1Data) => setState(s => ({ ...s, step1: data }))
  const saveStep2 = (data: Step2Data) => setState(s => ({ ...s, step2: data }))
  const saveStep3 = (data: Step3Data) => setState(s => ({ ...s, step3: data }))
  const saveStep4 = (data: Step4Data) => setState(s => ({ ...s, step4: data }))
  const reset = () => setState(defaultState)

  return (
    <WizardContext.Provider value={{
      state, setApplicationId, setCaseNumber, setApplicationType,
      markStepComplete, setEmailVerified,
      saveStep1, saveStep2, saveStep3, saveStep4, reset
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
