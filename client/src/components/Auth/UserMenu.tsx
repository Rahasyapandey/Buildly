import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './UserMenu.css'

interface UserMenuProps {
  variant?: 'compact' | 'full'
}

export default function UserMenu({ variant = 'full' }: UserMenuProps) {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen])

  if (!isAuthenticated || !user) {
    return (
      <button
        type="button"
        className="user-signin-btn"
        onClick={openAuthModal}
        title="Sign in with Google"
      >
        <svg className="user-signin-g-icon" viewBox="0 0 24 24" width="16" height="16">
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
        <span>{variant === 'compact' ? 'Sign In' : 'Sign in with Google'}</span>
      </button>
    )
  }

  const initial = (user.name || user.email || 'U').charAt(0).toUpperCase()

  return (
    <div className="user-menu-wrap" ref={menuRef}>
      <button
        type="button"
        className="user-profile-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="User profile menu"
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="user-avatar-img" />
        ) : (
          <div className="user-avatar-initial">{initial}</div>
        )}
        {variant !== 'compact' && (
          <span className="user-name-label">{user.name.split(' ')[0]}</span>
        )}
        <span className="user-chevron">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="user-dropdown-card">
          <div className="user-dropdown-header">
            <div className="user-dropdown-info">
              <span className="user-dropdown-name">{user.name}</span>
              <span className="user-dropdown-email">{user.email}</span>
            </div>
            <span className="user-google-badge" title="Authenticated with Google OAuth 2.0">
              <span className="g-dot" /> Google
            </span>
          </div>

          <div className="user-dropdown-divider" />

          <nav className="user-dropdown-nav">
            <Link
              to="/overview"
              className="user-dropdown-item"
              onClick={() => setIsOpen(false)}
            >
              <span>📂</span>
              <span>Workspace Studio</span>
            </Link>
            <Link
              to="/board"
              className="user-dropdown-item"
              onClick={() => setIsOpen(false)}
            >
              <span>✏️</span>
              <span>Whiteboard Canvas</span>
            </Link>
            <Link
              to="/play"
              className="user-dropdown-item"
              onClick={() => setIsOpen(false)}
            >
              <span>🎮</span>
              <span>Play Mode Rooms</span>
            </Link>
          </nav>

          <div className="user-dropdown-divider" />

          <button
            type="button"
            className="user-dropdown-signout"
            onClick={() => {
              setIsOpen(false)
              logout()
            }}
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  )
}
