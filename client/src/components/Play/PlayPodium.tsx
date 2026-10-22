import { useEffect, useRef } from 'react'
import type { Player, UserStats } from '../../types/play'
import { soundEffects } from '../../utils/soundEffects'
import './PlayPodium.css'

interface PlayPodiumProps {
  players: Player[]
  currentUser: Player
  userStats: UserStats
  onPlayAgain: () => void
  onExit: () => void
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  vRot: number
}

export default function PlayPodium({
  players,
  currentUser,
  userStats,
  onPlayAgain,
  onExit,
}: PlayPodiumProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animFrameRef = useRef<number | null>(null)

  // Sort descending by score
  const sorted = [...players].sort((a, b) => b.score - a.score)
  const winner = sorted[0]
  const second = sorted[1]
  const third = sorted[2]

  const userRank = sorted.findIndex((p) => p.id === currentUser.id) + 1
  const isUserWinner = userRank === 1

  // Victory sound on mount
  useEffect(() => {
    soundEffects.playVictory()
  }, [])

  // Confetti Particle System
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ['#2563eb', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4']
    const particles: Particle[] = []

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 400,
        y: canvas.height / 3 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 12 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.25 // gravity
        p.rotation += p.vRot

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx.restore()
      })

      animFrameRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  return (
    <div className="play-podium-container">
      <canvas ref={canvasRef} className="play-podium-confetti" />

      <div className="play-podium-modal">
        {/* Header */}
        <div className="play-podium-header">
          <div className="play-podium-badge">🏆 MATCH CONCLUDED</div>
          <h1 className="play-podium-title">
            {isUserWinner ? '🎉 You Won the Game!' : `${winner?.name || 'Winner'} Takes 1st Place!`}
          </h1>
          <p className="play-podium-subtitle">
            Brilliant sketches, lightning-fast guesses, and pure developer teamwork.
          </p>
        </div>

        {/* Podium Pillars */}
        <div className="play-podium-stage">
          {/* 2nd Place */}
          {second && (
            <div className="play-podium-pillar play-podium-pillar--2">
              <div
                className="play-podium-avatar"
                style={{ backgroundColor: second.color }}
              >
                {second.avatar}
                <span className="play-podium-medal">🥈</span>
              </div>
              <span className="play-podium-name">{second.name}</span>
              <span className="play-podium-score">{second.score} pts</span>
              <div className="play-podium-pedestal play-podium-pedestal--2">
                <span className="play-pedestal-number">2</span>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {winner && (
            <div className="play-podium-pillar play-podium-pillar--1">
              <div
                className="play-podium-avatar play-podium-avatar--winner"
                style={{ backgroundColor: winner.color }}
              >
                {winner.avatar}
                <span className="play-podium-medal">👑</span>
              </div>
              <span className="play-podium-name play-podium-name--winner">
                {winner.name}
              </span>
              <span className="play-podium-score">{winner.score} pts</span>
              <div className="play-podium-pedestal play-podium-pedestal--1">
                <span className="play-pedestal-number">1</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {third && (
            <div className="play-podium-pillar play-podium-pillar--3">
              <div
                className="play-podium-avatar"
                style={{ backgroundColor: third.color }}
              >
                {third.avatar}
                <span className="play-podium-medal">🥉</span>
              </div>
              <span className="play-podium-name">{third.name}</span>
              <span className="play-podium-score">{third.score} pts</span>
              <div className="play-podium-pedestal play-podium-pedestal--3">
                <span className="play-pedestal-number">3</span>
              </div>
            </div>
          )}
        </div>

        {/* XP & Progression Rewards */}
        <div className="play-podium-rewards">
          <div className="play-reward-card">
            <span className="play-reward-icon">⚡</span>
            <div>
              <div className="play-reward-val">+{isUserWinner ? '350' : '150'} XP</div>
              <div className="play-reward-label">Experience Points Earned</div>
            </div>
          </div>

          <div className="play-reward-card">
            <span className="play-reward-icon">🎖️</span>
            <div>
              <div className="play-reward-val">Level {userStats.level}</div>
              <div className="play-reward-label">{userStats.xp} Total XP</div>
            </div>
          </div>

          <div className="play-reward-card">
            <span className="play-reward-icon">🔥</span>
            <div>
              <div className="play-reward-val">{userStats.winStreak} Streak</div>
              <div className="play-reward-label">Matches in a Row</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="play-podium-actions">
          <button className="play-podium-btn play-podium-btn--again" onClick={onPlayAgain}>
            <span>🔄</span>
            <span>Play Again</span>
          </button>
          <button className="play-podium-btn play-podium-btn--exit" onClick={onExit}>
            <span>←</span>
            <span>Back to Workspace</span>
          </button>
        </div>
      </div>
    </div>
  )
}
