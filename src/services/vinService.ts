import client from '@/api/axiosInstance'
import { API } from '@/constants/apiEndpoints'

// Matches manager's VinLookupResponseDto
export interface VinLookupResult {
  isValid: boolean
  year: number | null
  make: string | null
  model: string | null
  trim: string | null
  isDuplicate: boolean
  duplicateCaseNumbers: string[]
  errorMessage?: string | null
}

// GET /api/vin/lookup/{vin}
// Manager returns CommonResponseDto<VinLookupResponseDto>
// API has PropertyNameCaseInsensitive=true so PascalCase → camelCase works
export const lookupVin = async (vin: string): Promise<VinLookupResult> => {
  const res = await client.get(API.VIN_LOOKUP(vin))
  // res.data = CommonResponseDto<VinLookupResponseDto>
  // res.data.data = VinLookupResponseDto
  return res.data.data
}
