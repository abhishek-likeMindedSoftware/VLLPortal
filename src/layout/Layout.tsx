import type { ReactNode } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface Props { children: ReactNode }

export default function Layout({ children }: Props) {
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div id="page-content" style={{ flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '40px 20px' }}>
        {children}
      </div>
      <Footer />
    </div>
  )
}
