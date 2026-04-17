export default function Footer() {
  return (
    <footer style={{ background: '#f5f7f8', borderTop: '1px solid #e6e9eb', padding: '24px 0', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)', margin: 0 }}>
          © {new Date().getFullYear()} Commonwealth of Massachusetts — Office of Consumer Affairs and Business Regulation
        </p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ms-gray-dark)', margin: '4px 0 0' }}>
          For assistance: <a href="tel:+16177273480" style={{ color: 'var(--theme-color)' }}>(617) 727-3480</a>
        </p>
      </div>
    </footer>
  )
}
