import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/layout/Layout'
import lazyWithRetry from '@/utils/lazyWithRetry'
import { WizardProvider } from '@/context/WizardContext'
import { Suspense } from 'react'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

const Home       = lazyWithRetry(() => import('@/pages/Home'))
const SelectType = lazyWithRetry(() => import('@/pages/apply/SelectType'))
const WizardShell = lazyWithRetry(() => import('@/pages/apply/WizardShell'))
const Status     = lazyWithRetry(() => import('@/pages/Status'))
const NotFound   = lazyWithRetry(() => import('@/pages/NotFound'))

const wrap = (element: React.ReactNode) => (
  <Layout>
    <Suspense fallback={<LoadingSpinner />}>
      {element}
    </Suspense>
  </Layout>
)

// WizardProvider wraps both SelectType and WizardShell so context is shared
const wrapWizard = (element: React.ReactNode) => (
  <Layout>
    <WizardProvider>
      <Suspense fallback={<LoadingSpinner />}>
        {element}
      </Suspense>
    </WizardProvider>
  </Layout>
)

export const router = createBrowserRouter([
  { path: '/',       element: wrap(<Home />) },
  { path: '/apply',  element: wrapWizard(<SelectType />) },
  { path: '/apply/:applicationId/step/:step', element: wrapWizard(<WizardShell />) },
  { path: '/status', element: wrap(<Status />) },
  { path: '*',       element: wrap(<NotFound />) },
])
