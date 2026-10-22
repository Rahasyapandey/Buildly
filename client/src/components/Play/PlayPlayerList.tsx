import { useState } from 'react'
import type { Player } from '../../types/play'
import { soundEffects } from '../../utils/soundEffects'
import './PlayPlayerList.css'

interface PlayPlayerListProps {
  players: Player[]
  currentUser: Player
}

export default function PlayPlayerList({
  players,
  currentUser,
}: PlayPlayerListProps) {
  const [isSfxMuted, setIsSfxMuted] = useState(false)

  // Sort players descending by score
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)

  const toggleSfx = () => {
    const next = !isSfxMuted
    setIsSfxMuted(next)
    soundEffects.setMuted(next)
  }

  return (
    <div className="play-player-list-panel">
      {/* Header */}
      <div className="play-player-list-header">
        <div className="play-player-list-header__title">
          <span>👥</span>
          <span>PLAYERS ({players.length})</span>
        </div>
        <button
          className="play-sfx-toggle-btn"
          onClick={toggleSfx}
          title={isSfxMuted ? 'Unmute game sounds' : 'Mute game sounds'}
        >
          {isSfxMuted ? '🔇' : '🔔'}
        </button>
      </div>

      {/* Players List */}
      <div className="play-player-list-items">
        {sortedPlayers.map((player, index) => {
          const isUser = player.id === currentUser.id
          const rank = index + 1

          return (
            <div
              key={player.id}
              className={`play-player-card ${player.isDrawing ? 'play-player-card--drawing' : ''} ${
                player.hasGuessed ? 'play-player-card--guessed' : ''
              }`}
            >
              {/* Rank */}
              <span className={`play-player-rank play-player-rank--${rank}`}>
                #{rank}
              </span>

              {/* Avatar with speaking ring */}
              <div
                className={`play-player-avatar ${player.isSpeaking ? 'play-player-avatar--speaking' : ''}`}
                style={{ backgroundColor: player.color }}
              >
                {player.avatar}
                {player.isDrawing && (
                  <span className="play-player-badge-draw" title="Currently drawing">
                    ✏️
                  </span>
                )}
                {player.hasGuessed && !player.isDrawing && (
                  <span className="play-player-badge-check" title="Guessed correctly!">
                    ✓
                  </span>
                )}
              </div>

              {/* Name & status */}
              <div className="play-player-info">
                <div className="play-player-name-row">
                  <span className="play-player-name">
                    {player.name} {isUser && '(You)'}
                  </span>
                  {player.isBot && <span className="play-bot-tag">BOT</span>}
                </div>
                <span className="play-player-status">
                  {player.isDrawing
                    ? 'Drawing now'
                    : player.hasGuessed
                    ? 'Guessed!'
                    : 'Guessing...'}
                </span>
              </div>

              {/* Score */}
              <div className="play-player-score-col">
                <span className="play-player-score">{player.score}</span>
                <span className="play-player-score-label">PTS</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
