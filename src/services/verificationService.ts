import client from '@/api/axiosInstance'
import { API } from '@/constants/apiEndpoints'

// Manager's API expects EmailAddress (not email)
export const sendVerificationCode = async (emailAddress: string) => {
  const res = await client.post(API.VERIFICATION_SEND, { emailAddress })
  return res.data
}

export const confirmVerificationCode = async (emailAddress: string, code: string) => {
  const res = await client.post(API.VERIFICATION_CONFIRM, { emailAddress, code })
  return res.data
}
