import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 'var(--space-4)',
        textAlign: 'center',
        padding: 'var(--space-8)',
      }}
    >
      <span style={{ fontSize: '64px' }}>404</span>
      <h1 style={{ color: 'var(--color-heading)', fontSize: '24px', fontWeight: 600 }}>
        Page not found
      </h1>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '320px' }}>
        That route doesn't exist yet. Head back to the landing page.
      </p>
      <Link to="/" className="btn btn--primary" style={{ marginTop: 'var(--space-2)' }}>
        ← Back to Buildly
      </Link>
    </main>
  )
}
