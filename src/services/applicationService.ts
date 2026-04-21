import client from '@/api/axiosInstance'
import { API } from '@/constants/apiEndpoints'
import type { Step1Data, Step2Data, Step3Data, Step4Data } from '@/context/WizardContext'

// ── Create application (SelectType) ──────────────────────────────────────────
// Spec: POST /api/applications — creates record, returns applicationId + token
export const createApplication = async (applicationType: string) => {
  const res = await client.post(API.APPLICATIONS, {
    applicationType,
    eligibilityAcknowledged: true,
  })
  return res.data
}

// ── Step 1 — Consumer Info ────────────────────────────────────────────────────
// Spec: PUT /api/applications/{id}/step/1
export const saveStep1 = async (applicationId: string, data: Step1Data) => {
  const res = await client.put(API.APPLICATION_STEP(applicationId, 1), data)
  return res.data
}

// ── Step 2 — Vehicle Info ─────────────────────────────────────────────────────
// Spec: PUT /api/applications/{id}/step/2
export const saveStep2 = async (applicationId: string, data: Step2Data) => {
  const res = await client.put(API.APPLICATION_STEP(applicationId, 2), data)
  return res.data
}

// ── Step 3 — Defects & Repairs ────────────────────────────────────────────────
// Spec: PUT /api/applications/{id}/step/3
export const saveStep3 = async (applicationId: string, data: Step3Data) => {
  const res = await client.put(API.APPLICATION_STEP(applicationId, 3), data)
  return res.data
}

// ── Step 4 — Narrative ────────────────────────────────────────────────────────
// Spec: PUT /api/applications/{id}/step/4
export const saveStep4 = async (applicationId: string, data: Step4Data) => {
  const res = await client.put(API.APPLICATION_STEP(applicationId, 4), data)
  return res.data
}

// ── Step 6 — Final submission ─────────────────────────────────────────────────
// Spec: POST /api/applications/{id}/submit
export const submitApplication = async (applicationId: string, data: {
  emailVerificationCode: string
  certificationAccepted: boolean
  signatureFullName: string
}) => {
  const res = await client.post(API.APPLICATION_SUBMIT(applicationId), data)
  return res.data
}

// ── Portal status ─────────────────────────────────────────────────────────────
export const getPortalStatus = async (applicationId: string, token?: string) => {
  const params: Record<string, string> = { applicationId }
  if (token) params.token = token
  const res = await client.get(API.PORTAL_STATUS, { params })
  return res.data
}
