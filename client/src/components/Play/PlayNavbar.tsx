import { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import './PlayNavbar.css'

interface PlayNavbarProps {
  roomCode: string
  activeTab: 'game' | 'leaderboard'
  onTabChange: (tab: 'game' | 'leaderboard') => void
  onLeaveRoom: () => void
  isConnected: boolean
  isVoiceActive: boolean
}

export default function PlayNavbar({
  roomCode,
  activeTab,
  onTabChange,
  onLeaveRoom,
  isConnected,
  isVoiceActive,
}: PlayNavbarProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    const url = `${window.location.origin}/play?room=${roomCode}`
    navigator.clipboard?.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="play-navbar">
      <div className="play-navbar__left">
        <Link to="/overview" className="play-navbar__brand" title="Back to Buildly Workspace">
          <img src="/logo.png" alt="Buildly" className="play-navbar__logo" />
          <span className="play-navbar__title">
            Buildly<span className="play-navbar__tag">PLAY</span>
          </span>
        </Link>

        {/* Room Code Badge */}
        <div className="play-room-badge" onClick={handleCopyLink} title="Click to copy invite link">
          <span className="play-room-badge__label">ROOM</span>
          <span className="play-room-badge__code">{roomCode}</span>
          <span className="play-room-badge__copy">{copied ? '✓ Copied!' : '📋'}</span>
        </div>

        {/* Connection status */}
        <div className="play-conn-status">
          <span className={`play-conn-dot ${isConnected ? 'play-conn-dot--online' : ''}`} />
          <span className="play-conn-text">
            {isConnected ? 'Multiplayer Active' : 'Connecting...'}
          </span>
          {isVoiceActive && (
            <span className="play-voice-pill" title="Integrated WebRTC Voice Active">
              🎙️ Voice ON
            </span>
          )}
        </div>
      </div>

      <div className="play-navbar__center">
        {/* Navigation Tabs */}
        <div className="play-tabs">
          <button
            className={`play-tab ${activeTab === 'game' ? 'play-tab--active' : ''}`}
            onClick={() => onTabChange('game')}
          >
            <span>🎮</span>
            <span>Game Room</span>
          </button>
          <button
            className={`play-tab ${activeTab === 'leaderboard' ? 'play-tab--active' : ''}`}
            onClick={() => onTabChange('leaderboard')}
          >
            <span>🏆</span>
            <span>Leaderboard & Stats</span>
          </button>
        </div>
      </div>

      <div className="play-navbar__right">
        <Link
          to="/showcase"
          className="play-showcase-btn"
          title="Open Generative UI Suite"
        >
          <span>✨</span>
          <span>Showcase</span>
        </Link>

        <ThemeToggle variant="icon" />

        <button
          className="play-leave-btn"
          onClick={onLeaveRoom}
          title="Exit game room back to workspace overview"
        >
          <span>✕</span>
          <span>Exit</span>
        </button>
      </div>
    </header>
  )
}
