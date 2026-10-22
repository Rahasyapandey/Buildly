import { useState } from 'react'
import type { Player, RoomSettings } from '../../types/play'
import './PlayLobby.css'

interface PlayLobbyProps {
  roomCode: string
  players: Player[]
  currentUser: Player
  settings: RoomSettings
  onUpdateSettings: (settings: RoomSettings) => void
  onStartGame: () => void
  onAddBot: () => void
  onRemovePlayer: (id: string) => void
}

export default function PlayLobby({
  roomCode,
  players,
  currentUser,
  settings,
  onUpdateSettings,
  onStartGame,
  onAddBot,
  onRemovePlayer,
}: PlayLobbyProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const url = `${window.location.origin}/play?room=${roomCode}`
    navigator.clipboard?.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isHost = currentUser.isHost

  return (
    <div className="play-lobby-layout">
      {/* Left: Players Grid & Invite card */}
      <div className="play-lobby-players-column">
        {/* Invite Banner */}
        <div className="play-lobby-invite-card">
          <div className="play-lobby-invite-info">
            <span className="play-lobby-tag">MULTIPLAYER ROOM</span>
            <h2 className="play-lobby-room-code">{roomCode}</h2>
            <p className="play-lobby-invite-sub">
              Share this room code with teammates or invite them to draw and guess together!
            </p>
          </div>
          <button className="play-lobby-copy-btn" onClick={handleCopy}>
            <span>{copied ? '✓ Copied' : '🔗 Copy Invite Link'}</span>
          </button>
        </div>

        {/* Players in Room */}
        <div className="play-lobby-players-container">
          <div className="play-lobby-section-title">
            <span>PLAYERS IN ROOM ({players.length} / {settings.maxPlayers})</span>
            {isHost && players.length < settings.maxPlayers && (
              <button className="play-lobby-add-bot-btn" onClick={onAddBot}>
                + Add AI Teammate
              </button>
            )}
          </div>

          <div className="play-lobby-player-grid">
            {players.map((p) => (
              <div key={p.id} className="play-lobby-player-card">
                <div
                  className="play-lobby-player-avatar"
                  style={{ backgroundColor: p.color }}
                >
                  {p.avatar}
                </div>
                <div className="play-lobby-player-info">
                  <div className="play-lobby-player-name">
                    {p.name} {p.id === currentUser.id && '(You)'}
                  </div>
                  <div className="play-lobby-player-tags">
                    {p.isHost && <span className="play-lobby-host-pill">HOST</span>}
                    {p.isBot && <span className="play-lobby-bot-pill">BOT</span>}
                    <span className="play-lobby-ready-pill">READY</span>
                  </div>
                </div>

                {isHost && p.id !== currentUser.id && (
                  <button
                    className="play-lobby-kick-btn"
                    onClick={() => onRemovePlayer(p.id)}
                    title="Remove player"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {/* Empty slots placeholders */}
            {Array.from({ length: Math.max(0, 4 - players.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="play-lobby-slot-placeholder">
                <span className="play-lobby-slot-icon">+</span>
                <span>Waiting for player...</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Game Settings & Start Game */}
      <div className="play-lobby-settings-column">
        <div className="play-lobby-settings-card">
          <h3 className="play-lobby-settings-title">⚙️ Game Settings</h3>

          {/* Rounds */}
          <div className="play-setting-group">
            <label className="play-setting-label">Number of Rounds</label>
            <div className="play-setting-pills">
              {[2, 3, 5].map((r) => (
                <button
                  key={r}
                  className={`play-setting-pill ${settings.rounds === r ? 'play-setting-pill--active' : ''}`}
                  onClick={() => onUpdateSettings({ ...settings, rounds: r })}
                  disabled={!isHost}
                >
                  {r} Rounds
                </button>
              ))}
            </div>
          </div>

          {/* Draw Time */}
          <div className="play-setting-group">
            <label className="play-setting-label">Drawing Time per Turn</label>
            <div className="play-setting-pills">
              {[45, 60, 80].map((t) => (
                <button
                  key={t}
                  className={`play-setting-pill ${settings.drawTime === t ? 'play-setting-pill--active' : ''}`}
                  onClick={() => onUpdateSettings({ ...settings, drawTime: t })}
                  disabled={!isHost}
                >
                  {t}s
                </button>
              ))}
            </div>
          </div>

          {/* Word Category */}
          <div className="play-setting-group">
            <label className="play-setting-label">Word Bank Category</label>
            <div className="play-setting-pills">
              <button
                className={`play-setting-pill ${settings.category === 'all' ? 'play-setting-pill--active' : ''}`}
                onClick={() => onUpdateSettings({ ...settings, category: 'all' })}
                disabled={!isHost}
              >
                All-Star Mix
              </button>
              <button
                className={`play-setting-pill ${settings.category === 'tech' ? 'play-setting-pill--active' : ''}`}
                onClick={() => onUpdateSettings({ ...settings, category: 'tech' })}
                disabled={!isHost}
              >
                💻 Tech & Dev
              </button>
              <button
                className={`play-setting-pill ${settings.category === 'party' ? 'play-setting-pill--active' : ''}`}
                onClick={() => onUpdateSettings({ ...settings, category: 'party' })}
                disabled={!isHost}
              >
                🎉 Party Casual
              </button>
            </div>
          </div>

          {/* Integrated Voice Chat Info */}
          <div className="play-voice-info-box">
            <div className="play-voice-info-header">
              <span>🎙️</span>
              <span className="play-voice-info-title">Integrated Voice Room</span>
            </div>
            <p className="play-voice-info-desc">
              Voice chat connects automatically inside the game room. You can mute, undeafen,
              share camera or screen while sketching and guessing!
            </p>
          </div>

          {/* Start Game Action */}
          <div className="play-lobby-start-box">
            {isHost ? (
              <button
                className="play-start-game-btn"
                onClick={onStartGame}
                disabled={players.length < 2}
              >
                <span>🎮</span>
                <span>
                  {players.length < 2 ? 'Need at least 2 players' : 'Start Match!'}
                </span>
              </button>
            ) : (
              <div className="play-waiting-host-notice">
                <span>⏳</span>
                <span>Waiting for room host to start the game...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
