import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Suspense, useEffect } from 'react'
import { router } from './routes/routes'
import ErrorBoundary from './components/shared/ErrorBoundary'
import OfficialBanner from './components/layout/OfficialBanner'
import LoadingSpinner from './components/shared/LoadingSpinner'

function App() {
  // ── Skip to main content ──────────────────────────────────────────────
  const handleSkipToMain = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const main = document.getElementById('main-content')
    if (!main) return
    main.setAttribute('tabindex', '-1')
    main.focus()
    main.scrollIntoView({ block: 'start' })
    if (globalThis.location.hash) {
      globalThis.history.replaceState(null, '', `${globalThis.location.pathname}${globalThis.location.search}`)
    }
  }

  // ── Disable browser scroll restoration ───────────────────────────────
  useEffect(() => {
    if ('scrollRestoration' in globalThis.history) {
      globalThis.history.scrollRestoration = 'manual'
    }
  }, [])

  // ── Track official banner bar height → CSS var (exact FILIR pattern) ─
  useEffect(() => {
    const bannerEl = document.querySelector('.official-banner') as HTMLElement | null
    const barEl    = document.querySelector('.official-banner__bar') as HTMLElement | null
    if (!bannerEl || !barEl) return

    const updateBarHeight = (): void => {
      const barHeight = Math.ceil(barEl.getBoundingClientRect().height)
      document.documentElement.style.setProperty('--official-banner-bar-height', `${barHeight}px`)
    }

    const updateFullHeight = (): void => {
      const fullHeight = Math.ceil(bannerEl.getBoundingClientRect().height)
      document.documentElement.style.setProperty('--official-banner-height', `${fullHeight}px`)
    }

    updateBarHeight()
    updateFullHeight()

    const ro = new ResizeObserver(() => {
      updateBarHeight()
      updateFullHeight()
    })
    ro.observe(barEl)
    ro.observe(bannerEl)

    globalThis.addEventListener('resize', updateBarHeight)
    return () => {
      ro.disconnect()
      globalThis.removeEventListener('resize', updateBarHeight)
    }
  }, [])

  return (
    <ErrorBoundary>
      <div className="app-container">
        {/* Fixed green official banner — visible on ALL pages */}
        <OfficialBanner onSkipToMain={handleSkipToMain} />

        <main id="main-content" className="main-content" tabIndex={-1}>
          <Suspense fallback={<LoadingSpinner />}>
            <RouterProvider router={router} />
          </Suspense>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          aria-label="Notifications"
          style={{ marginTop: 'var(--official-banner-bar-height, 0px)' }}
        />
      </div>
    </ErrorBoundary>
  )
}

export default App
