const BASE = '/api'

export const API = {
  APPLICATION_TYPES: `${BASE}/application-types`,
  APPLICATIONS: `${BASE}/applications`,
  APPLICATION_STEP: (id: string, step: number) => `${BASE}/applications/${id}/step/${step}`,
  APPLICATION_SUBMIT: (id: string) => `${BASE}/applications/${id}/submit`,
  APPLICATION_SUBMIT_FULL: (id: string) => `${BASE}/applications/${id}/submit-full`,
  APPLICATION_DOCUMENTS: (id: string) => `${BASE}/applications/${id}/documents`,
  APPLICATION_DOCUMENT: (id: string, docId: string) => `${BASE}/applications/${id}/documents/${docId}`,
  APPLICATION_DOCUMENT_PREVIEW: (id: string, docId: string) => `${BASE}/applications/${id}/documents/${docId}/preview-url`,
  VERIFICATION_SEND: `${BASE}/verification/send-code`,
  VERIFICATION_CONFIRM: `${BASE}/verification/confirm-code`,
  VIN_LOOKUP: (vin: string) => `${BASE}/vin/lookup/${vin}`,
  PORTAL_STATUS: `${BASE}/portal/status`,
  PORTAL_DOCUMENTS: `${BASE}/portal/documents`,
  PORTAL_DOCUMENT_PREVIEW: (docId: string) => `${BASE}/portal/documents/${docId}/preview-url`,
} as const
