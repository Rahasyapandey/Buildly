import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import './AuthModal.css'

interface GoogleSignInButtonProps {
  onSuccess?: () => void
  onError?: (err: Error) => void
  text?: string
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (res: { credential: string }) => void
            auto_select?: boolean
          }) => void
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: 'outline' | 'filled_blue' | 'filled_black'
              size?: 'large' | 'medium' | 'small'
              text?: 'signin_with' | 'signup_with' | 'continue_with'
              shape?: 'rectangular' | 'pill' | 'circle'
              width?: number
            },
          ) => void
          prompt: () => void
        }
      }
    }
  }
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
  text = 'Continue with Google',
}: GoogleSignInButtonProps) {
  const { loginWithGoogle, loginAsDemo } = useAuth()
  const googleBtnContainerRef = useRef<HTMLDivElement>(null)
  const [showDemoChooser, setShowDemoChooser] = useState(false)
  const [customEmail, setCustomEmail] = useState('')
  const [customName, setCustomName] = useState('')

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    // If real Google Client ID is configured, load Google Identity Services SDK
    if (!googleClientId) return

    const loadGsiScript = () => {
      if (window.google?.accounts?.id) {
        initGoogleButton()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = initGoogleButton
      document.body.appendChild(script)
    }

    const initGoogleButton = () => {
      if (!window.google?.accounts?.id || !googleBtnContainerRef.current) return

      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            try {
              await loginWithGoogle(response.credential)
              onSuccess?.()
            } catch (err) {
              onError?.(err as Error)
            }
          },
        })

        window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          width: 280,
        })
      } catch (e) {
        console.warn('Google GSI button initialization error:', e)
      }
    }

    loadGsiScript()
  }, [googleClientId, loginWithGoogle, onSuccess, onError])

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customEmail) return
    const name = customName || customEmail.split('@')[0]
    await loginAsDemo(customEmail, name)
    onSuccess?.()
  }

  const handleSelectQuickProfile = async (email: string, name: string) => {
    await loginAsDemo(email, name)
    onSuccess?.()
  }

  return (
    <div className="google-auth-wrapper">
      {/* If Google Client ID is set and rendered, show the official SDK button */}
      {googleClientId && <div ref={googleBtnContainerRef} className="google-sdk-btn-slot" />}

      {/* Primary Google Button (always active & accessible) */}
      <button
        type="button"
        className="google-signin-btn"
        onClick={() => {
          if (googleClientId && window.google?.accounts?.id) {
            window.google.accounts.id.prompt()
          } else {
            setShowDemoChooser((prev) => !prev)
          }
        }}
      >
        {/* Official Google 4-Color 'G' SVG Logo */}
        <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span className="google-btn-text">{text}</span>
      </button>

      {/* Developer / Demo Profile Chooser (visible when testing without GCP credentials) */}
      {showDemoChooser && !googleClientId && (
        <div className="google-demo-chooser">
          <div className="google-demo-title">
            <span>✨ One-Click Google Testing</span>
            <span className="google-demo-badge">DEV</span>
          </div>
          <p className="google-demo-desc">
            Select a verified profile to test authenticated cloud board sync &amp; multi-user presence:
          </p>

          <div className="google-demo-profiles">
            <button
              type="button"
              className="google-demo-profile-btn"
              onClick={() => handleSelectQuickProfile('sarah.connor@gmail.com', 'Sarah Connor')}
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop"
                alt="Sarah"
                className="g-avatar-thumb"
              />
              <div className="g-profile-meta">
                <span className="g-profile-name">Sarah Connor</span>
                <span className="g-profile-email">sarah.connor@gmail.com</span>
              </div>
              <span className="g-profile-arrow">→</span>
            </button>

            <button
              type="button"
              className="google-demo-profile-btn"
              onClick={() => handleSelectQuickProfile('alex.rivera@gmail.com', 'Alex Rivera')}
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop"
                alt="Alex"
                className="g-avatar-thumb"
              />
              <div className="g-profile-meta">
                <span className="g-profile-name">Alex Rivera</span>
                <span className="g-profile-email">alex.rivera@gmail.com</span>
              </div>
              <span className="g-profile-arrow">→</span>
            </button>
          </div>

          <form onSubmit={handleCustomSubmit} className="google-custom-form">
            <input
              type="email"
              placeholder="Or enter your Google email..."
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              className="google-custom-input"
              required
            />
            <input
              type="text"
              placeholder="Your full name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="google-custom-input"
            />
            <button type="submit" className="google-custom-submit-btn">
              Sign In as this User →
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
