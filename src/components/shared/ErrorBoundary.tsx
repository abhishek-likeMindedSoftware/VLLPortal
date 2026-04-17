import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center" role="alert">
          <h2 className="text-xl font-semibold text-[var(--color-ma-red)] mb-2">
            Something went wrong
          </h2>
          <p className="text-[var(--color-ma-gray-600)]">{this.state.message}</p>
          <button
            className="mt-4 px-4 py-2 bg-[var(--color-ma-blue)] text-white rounded"
            onClick={() => this.setState({ hasError: false, message: '' })}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
