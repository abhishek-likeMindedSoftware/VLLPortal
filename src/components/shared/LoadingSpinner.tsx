interface Props {
  label?: string
}

export default function LoadingSpinner({ label = 'Loading…' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16" role="status" aria-live="polite">
      <div
        className="w-10 h-10 border-4 border-[var(--color-ma-blue)] border-t-transparent rounded-full animate-spin"
        aria-hidden="true"
      />
      <span className="mt-3 text-sm text-[var(--color-ma-gray-600)]">{label}</span>
    </div>
  )
}
