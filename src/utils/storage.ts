import { CASE_NUMBER_KEY, TOKEN_STORAGE_KEY } from '@/constants/appConstants'

export const saveSession = (caseNumber: string, token: string) => {
  localStorage.setItem(CASE_NUMBER_KEY, caseNumber)
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export const getSession = () => ({
  caseNumber: localStorage.getItem(CASE_NUMBER_KEY),
  token: localStorage.getItem(TOKEN_STORAGE_KEY),
})

export const clearSession = () => {
  localStorage.removeItem(CASE_NUMBER_KEY)
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}
