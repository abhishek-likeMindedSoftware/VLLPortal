import { APPLICATION_ID_KEY, TOKEN_STORAGE_KEY } from '@/constants/appConstants'

export const saveSession = (applicationId: string, token: string) => {
  localStorage.setItem(APPLICATION_ID_KEY, applicationId)
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export const getSession = () => ({
  applicationId: localStorage.getItem(APPLICATION_ID_KEY),
  token: localStorage.getItem(TOKEN_STORAGE_KEY),
})

export const clearSession = () => {
  localStorage.removeItem(APPLICATION_ID_KEY)
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}
