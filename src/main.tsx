import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Handle chunk load errors globally
globalThis.addEventListener('error', (event) => {
  if (
    event.message?.includes('Failed to fetch dynamically imported module') ||
    event.message?.includes('Loading chunk')
  ) {
    event.preventDefault()
    setTimeout(() => globalThis.location.reload(), 100)
  }
})

globalThis.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('Failed to fetch dynamically imported module')) {
    event.preventDefault()
    setTimeout(() => globalThis.location.reload(), 100)
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
