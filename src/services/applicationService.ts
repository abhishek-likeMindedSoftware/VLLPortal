import client from '@/api/axiosInstance'
import { API } from '@/constants/apiEndpoints'

// ── Create application ────────────────────────────────────────────────────────
export const createApplication = async (applicationType: string) => {
  const res = await client.post(API.APPLICATIONS, {
    applicationType,
    eligibilityAcknowledged: true,
  })
  return res.data
}

// ── Step 1 — Consumer Info ────────────────────────────────────────────────────
export const saveStep1 = async (applicationId: string, data: {
  firstName: string; middleName?: string; lastName: string
  emailAddress: string; phoneNumber: string; phoneType: string
  addressLine1: string; addressLine2?: string
  city: string; state: string; zipCode: string
  placeId?: string; preferredContactMethod: string
}) => {
  const res = await client.put(API.APPLICATION_STEP(applicationId, 1), data)
  return res.data
}

// ── Step 2 — Vehicle Info ─────────────────────────────────────────────────────
export const saveStep2 = async (applicationId: string, data: {
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
}) => {
  const res = await client.put(API.APPLICATION_STEP(applicationId, 2), data)
  return res.data
}

// ── Step 3 — Defects & Repairs ────────────────────────────────────────────────
export const saveStep3 = async (applicationId: string, data: {
  defects: Array<{
    defectDescription: string; defectCategory: string
    firstOccurrenceDate: string; isOngoing: boolean; sortOrder: number
  }>
  repairAttempts: Array<{
    repairDate: string; repairFacilityName: string
    defectsAddressed: string; repairSuccessful: boolean
    daysOutOfService?: number; sortOrder: number
  }>
  expenses: Array<{
    expenseType: string; amount: number
    expenseDate?: string; description?: string
  }>
}) => {
  const res = await client.put(API.APPLICATION_STEP(applicationId, 3), data)
  return res.data
}

// ── Step 4 — Narrative ────────────────────────────────────────────────────────
export const saveStep4 = async (applicationId: string, data: {
  narrativeStatement: string
  priorContactWithDealer: boolean; priorContactWithMfr: boolean
  priorContactNotes?: string; desiredResolution: string
}) => {
  const res = await client.put(API.APPLICATION_STEP(applicationId, 4), data)
  return res.data
}

// ── Submit ────────────────────────────────────────────────────────────────────
export const submitApplication = async (applicationId: string, data: {
  emailVerificationCode: string
  certificationAccepted: boolean
  signatureFullName: string
}) => {
  const res = await client.post(API.APPLICATION_SUBMIT(applicationId), data)
  return res.data
}

// ── Portal status ─────────────────────────────────────────────────────────────
export const getPortalStatus = async (applicationId: string) => {
  const res = await client.get(API.PORTAL_STATUS, { params: { applicationId } })
  return res.data
}
