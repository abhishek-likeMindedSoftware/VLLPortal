import client from '@/api/axiosInstance'
import { API } from '@/constants/apiEndpoints'

export const sendVerificationCode = async (email: string) => {
  const res = await client.post(API.VERIFICATION_SEND, { email })
  return res.data
}

export const confirmVerificationCode = async (email: string, code: string) => {
  const res = await client.post(API.VERIFICATION_CONFIRM, { email, code })
  return res.data
}
