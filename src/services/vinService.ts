import client from '@/api/axiosInstance'
import { API } from '@/constants/apiEndpoints'

export interface VinLookupResult {
  vin: string
  year: number | null
  make: string | null
  model: string | null
  trim: string | null
  isValid: boolean
  isDuplicate: boolean
  duplicateCaseNumbers: string[]
}

export const lookupVin = async (vin: string): Promise<VinLookupResult> => {
  const res = await client.get(API.VIN_LOOKUP(vin))
  return res.data.data
}
