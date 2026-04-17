import client from '@/api/axiosInstance'
import { API } from '@/constants/apiEndpoints'

export const createApplication = async (applicationType: string) => {
  const res = await client.post(API.APPLICATIONS, {
    applicationType,
    eligibilityAcknowledged: true,
  })
  return res.data
}

export const saveStep = async (applicationId: string, step: number, data: unknown) => {
  const res = await client.put(API.APPLICATION_STEP(applicationId, step), data)
  return res.data
}

export const submitApplication = async (applicationId: string, data: {
  certificationAccepted: boolean
  signatureFullName: string
}) => {
  const res = await client.post(API.APPLICATION_SUBMIT(applicationId), data)
  return res.data
}

export const getPortalStatus = async (applicationId: string) => {
  const res = await client.get(API.PORTAL_STATUS, { params: { applicationId } })
  return res.data
}
