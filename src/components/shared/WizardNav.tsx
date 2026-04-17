interface Props {
  onBack?: () => void
  onNext: () => void
  nextLabel?: string
  loading?: boolean
  backLabel?: string
  disableNext?: boolean
}

export default function WizardNav({ onBack, onNext, nextLabel = 'Continue', loading, backLabel = 'Back', disableNext }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 36, paddingTop: 24, borderTop: '1px solid #e5e7eb' }}>
      <div>
        {onBack && (
          <button onClick={onBack} className="btn-outline-theme" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <i className="fa-solid fa-arrow-left"></i> {backLabel}
          </button>
        )}
      </div>
      <button
        onClick={onNext}
        disabled={disableNext || loading}
        className="btn-theme"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 28px' }}
        aria-busy={loading}
      >
        {loading
          ? <><i className="fa-solid fa-spinner fa-spin"></i> Saving…</>
          : <>{nextLabel} <i className="fa-solid fa-arrow-right"></i></>
        }
      </button>
    </div>
  )
}
