import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function checkHasOAuthParams(): boolean {
  if (typeof window === 'undefined') return false
  const hash = window.location.hash
  const search = window.location.search
  return (
    (!!hash && (hash.includes('id_token=') || hash.includes('access_token='))) ||
    (!!search && search.includes('code='))
  )
}

export default function OAuthCallbackHandler() {
  const navigate = useNavigate()
  const { loginWithGoogle, loginWithGoogleCode } = useAuth()
  const [isProcessing, setIsProcessing] = useState(checkHasOAuthParams)

  useEffect(() => {
    // 1. Check for token in URL hash (#id_token=... or #access_token=...)
    const hash = window.location.hash
    if (hash && (hash.includes('id_token=') || hash.includes('access_token='))) {
      const params = new URLSearchParams(hash.replace(/^#/, ''))
      const idToken = params.get('id_token')
      const accessToken = params.get('access_token')
      const token = idToken || accessToken

      if (token) {
        // If inside a popup window, transmit to parent window and close
        if (window.opener && window.opener !== window) {
          try {
            window.opener.postMessage(
              { type: 'BUILDLY_GOOGLE_AUTH', token },
              window.location.origin,
            )
            window.close()
            return
          } catch (e) {
            console.warn('Could not postMessage to opener:', e)
          }
        }

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname)

        loginWithGoogle(token)
          .then(() => {
            navigate('/overview', { replace: true })
          })
          .catch((err) => {
            console.error('Failed to log in with Google OAuth token:', err)
          })
          .finally(() => {
            setIsProcessing(false)
          })
      }
    }

    // 2. Check for authorization code in search query (?code=...)
    const search = window.location.search
    if (search && search.includes('code=')) {
      const params = new URLSearchParams(search)
      const code = params.get('code')

      if (code) {
        window.history.replaceState({}, document.title, window.location.pathname)

        loginWithGoogleCode(code, window.location.origin)
          .then(() => {
            navigate('/overview', { replace: true })
          })
          .catch((err) => {
            console.error('Failed to exchange Google OAuth code:', err)
          })
          .finally(() => {
            setIsProcessing(false)
          })
      }
    }
  }, [loginWithGoogle, loginWithGoogleCode, navigate])

  if (isProcessing) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            color: '#0f172a',
            padding: '32px 36px',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            maxWidth: '360px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              border: '3.5px solid #e2e8f0',
              borderTopColor: '#2563eb',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
            Signing in with Google...
          </h3>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#64748b' }}>
            Authenticating your account and opening your Buildly workspace.
          </p>
        </div>
      </div>
    )
  }

  return null
}
