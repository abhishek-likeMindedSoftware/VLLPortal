import { lazy } from 'react'
import type { ComponentType } from 'react'

const lazyWithRetry = <T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>
) =>
  lazy(() =>
    factory().catch(() => {
      window.location.reload()
      return factory()
    })
  )

export default lazyWithRetry
