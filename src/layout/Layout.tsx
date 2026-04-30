import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface Props { children: ReactNode }

export default function Layout({ children }: Props) {
  const { pathname } = useLocation()

  useEffect(() => {
    // .main-content has overflow-y: auto, so it's the real scroll container
    const el = document.querySelector<HTMLElement>('.main-content')
    if (el) {
      el.scrollTop = 0
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname])

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div id="page-content" style={{ flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '24px 40px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {children}
      </div>
      <Footer />
    </div>
  )
}
