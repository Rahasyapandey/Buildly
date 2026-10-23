import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import GoogleSignInButton from './GoogleSignInButton'
import './AuthModal.css'

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, loginAsDemo, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAuthModalOpen, closeAuthModal])

  if (!isAuthModalOpen) return null

  const handleSuccess = () => {
    closeAuthModal()
    // If the user signed in from the landing page, smoothly transition to the studio overview
    if (location.pathname === '/' || location.pathname === '') {
      navigate('/overview')
    }
  }

  const handleDemoSignIn = async () => {
    try {
      await loginAsDemo('dev.lead@buildly.dev', 'Alex Developer')
      handleSuccess()
    } catch (e) {
      console.error('Demo sign in failed:', e)
    }
  }

  return (
    <div className="auth-modal-backdrop" onClick={closeAuthModal}>
      <div
        className="auth-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="auth-modal-close"
          onClick={closeAuthModal}
          aria-label="Close authentication modal"
        >
          ✕
        </button>

        <div className="auth-modal-header">
          <div className="auth-modal-logo-wrap">
            <img src="/logo.png" alt="Buildly Logo" className="auth-modal-logo" />
          </div>
          <h2 className="auth-modal-title">
            Sign in to Buildly<span className="auth-modal-dot">.</span>
          </h2>
          <p className="auth-modal-subtitle">
            Synchronize system architecture diagrams to the cloud, invite teammates to live WebRTC boards, and track party mode leaderboard rankings.
          </p>
        </div>

        <div className="auth-modal-body">
          <GoogleSignInButton onSuccess={handleSuccess} text="Continue with Google" />

          <div className="auth-modal-divider">
            <span>or instant developer access</span>
          </div>

          <button
            type="button"
            className="auth-demo-quick-btn"
            disabled={isLoading}
            onClick={handleDemoSignIn}
          >
            <span className="auth-demo-icon">⚡</span>
            <span>Instant Demo Sign-In (Alex Developer)</span>
          </button>
        </div>

        <div className="auth-modal-footer">
          <p className="auth-terms">
            By signing in, you agree to Buildly's Terms of Service and Privacy Policy. Secure authentication provided via Google OAuth 2.0.
          </p>
        </div>
      </div>
    </div>
  )
}
