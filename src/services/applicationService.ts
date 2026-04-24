import client from '@/api/axiosInstance'
import { API } from '@/constants/apiEndpoints'
import type { Step1Data, Step2Data, Step3Data, Step4Data } from '@/context/WizardContext'

// ── Create application (SelectType) ──────────────────────────────────────────
export const createApplication = async (applicationType: string) => {
  const res = await client.post(API.APPLICATIONS, {
    applicationType,
    eligibilityAcknowledged: true,
  })
  return res.data
}

// ── Step 1 — Consumer Info ────────────────────────────────────────────────────
export const saveStep1 = async (applicationId: string, data: Step1Data) => {
  const res = await client.put(API.APPLICATION_STEP(applicationId, 1), data)
  return res.data
}

// ── Step 2 — Vehicle Info ─────────────────────────────────────────────────────
export const saveStep2 = async (applicationId: string, data: Step2Data) => {
  const res = await client.put(API.APPLICATION_STEP(applicationId, 2), data)
  return res.data
}

// ── Step 3 — Defects & Repairs ────────────────────────────────────────────────
export const saveStep3 = async (applicationId: string, data: Step3Data) => {
  const res = await client.put(API.APPLICATION_STEP(applicationId, 3), data)
  return res.data
}

// ── Step 4 — Narrative ────────────────────────────────────────────────────────
export const saveStep4 = async (applicationId: string, data: Step4Data) => {
  const res = await client.put(API.APPLICATION_STEP(applicationId, 4), data)
  return res.data
}

// ── Step 5 — Document upload ──────────────────────────────────────────────────
// Spec: POST /api/applications/{id}/documents
export const uploadDocument = async (
  applicationId: string,
  file: File,
  documentType: string
) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('documentType', documentType)
  const res = await client.post(API.APPLICATION_DOCUMENTS(applicationId), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

// ── Step 5 — Delete pending document ─────────────────────────────────────────
export const deleteDocument = async (applicationId: string, documentId: string) => {
  const res = await client.delete(API.APPLICATION_DOCUMENT(applicationId, documentId))
  return res.data
}

// ── Step 6 — Final submission ─────────────────────────────────────────────────
export const submitApplication = async (applicationId: string, data: {
  emailVerificationCode: string
  certificationAccepted: boolean
  signatureFullName: string
}) => {
  const res = await client.post(API.APPLICATION_SUBMIT(applicationId), data)
  return res.data
}

// ── Portal status ─────────────────────────────────────────────────────────────
export const getPortalStatus = async (caseNumber: string, token?: string) => {
  const params: Record<string, string> = { caseNumber }
  if (token) params.token = token
  const res = await client.get(API.PORTAL_STATUS, { params })
  return res.data
}

// ── Portal documents ──────────────────────────────────────────────────────────
export const getPortalDocuments = async (caseNumber: string, token?: string) => {
  const params: Record<string, string> = { caseNumber }
  if (token) params.token = token
  const res = await client.get(API.PORTAL_DOCUMENTS, { params })
  return res.data
}

// ── Portal post-submission document upload ────────────────────────────────────
// Spec: POST /api/portal/documents
export const uploadPortalDocument = async (
  caseNumber: string,
  token: string,
  file: File,
  documentType: string
) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('documentType', documentType)
  const res = await client.post(API.PORTAL_DOCUMENTS, formData, {
    params: { caseNumber, token },
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}
