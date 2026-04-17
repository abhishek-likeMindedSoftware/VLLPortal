import axios from 'axios'
import { APPLICATION_ID_KEY, TOKEN_STORAGE_KEY } from '@/constants/appConstants'

// In dev: VITE_API_URL is empty → Vite proxy handles /api/* → https://localhost:7001
// In prod: VITE_API_URL = 'https://api.yourdomain.com'
const BASE_URL = import.meta.env.VITE_API_URL ?? ''

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Attach consumer access token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 — clear session and let the page handle redirect
client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      localStorage.removeItem(APPLICATION_ID_KEY)
    }
    return Promise.reject(error)
  }
)

export default client
