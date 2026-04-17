import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-[var(--color-ma-blue)] mb-4">404</h1>
      <p className="text-[var(--color-ma-gray-600)] mb-6">Page not found.</p>
      <Link to="/" className="text-[var(--color-ma-blue)] hover:underline font-semibold">
        Return to Home
      </Link>
    </div>
  )
}
