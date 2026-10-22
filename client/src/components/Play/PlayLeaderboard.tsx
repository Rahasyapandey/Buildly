import { useState } from 'react'
import type { UserStats } from '../../types/play'
import {
  SAMPLE_GLOBAL_LEADERBOARD,
  ALL_ACHIEVEMENTS,
} from '../../utils/playStorage'
import './PlayLeaderboard.css'

interface PlayLeaderboardProps {
  userStats: UserStats
  onBackToGame: () => void
}

export default function PlayLeaderboard({
  userStats,
  onBackToGame,
}: PlayLeaderboardProps) {
  const [boardType, setBoardType] = useState<'global' | 'weekly'>('global')
  const [activeSection, setActiveSection] = useState<'ranks' | 'achievements'>(
    'ranks',
  )

  const accuracy =
    userStats.totalGuesses > 0
      ? Math.round((userStats.correctGuesses / userStats.totalGuesses) * 100)
      : 72

  // Next level calculation: each level needs 500 XP
  const xpInCurrentLevel = userStats.xp % 500
  const xpNeededForNext = 500
  const levelProgress = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100))

  return (
    <div className="play-leaderboard-container">
      {/* Top Banner: Profile Card & Level */}
      <div className="play-profile-header">
        <div className="play-profile-header__left">
          <div className="play-profile-avatar">🎨</div>
          <div className="play-profile-meta">
            <div className="play-profile-name-row">
              <h2 className="play-profile-name">Alex Morgan</h2>
              <span className="play-profile-level-badge">
                Level {userStats.level} · Master Sketcher
              </span>
            </div>

            {/* XP Bar */}
            <div className="play-profile-xp-bar-box">
              <div className="play-profile-xp-track">
                <div
                  className="play-profile-xp-fill"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
              <span className="play-profile-xp-text">
                {xpInCurrentLevel} / {xpNeededForNext} XP to Level {userStats.level + 1}
              </span>
            </div>
          </div>
        </div>

        <button className="play-back-to-room-btn" onClick={onBackToGame}>
          <span>← Back to Room</span>
        </button>
      </div>

      {/* Career Stats Grid */}
      <div className="play-stats-grid">
        <div className="play-stat-tile">
          <span className="play-stat-icon">🎮</span>
          <div className="play-stat-val">{userStats.gamesPlayed}</div>
          <div className="play-stat-label">Matches Played</div>
        </div>

        <div className="play-stat-tile">
          <span className="play-stat-icon">🏆</span>
          <div className="play-stat-val">{userStats.gamesWon}</div>
          <div className="play-stat-label">Matches Won</div>
        </div>

        <div className="play-stat-tile">
          <span className="play-stat-icon">🎯</span>
          <div className="play-stat-val">{accuracy}%</div>
          <div className="play-stat-label">Guess Accuracy</div>
        </div>

        <div className="play-stat-tile">
          <span className="play-stat-icon">🔥</span>
          <div className="play-stat-val">{userStats.winStreak} Streak</div>
          <div className="play-stat-label">Current Win Streak</div>
        </div>

        <div className="play-stat-tile">
          <span className="play-stat-icon">⭐</span>
          <div className="play-stat-val">{userStats.highestScore}</div>
          <div className="play-stat-label">Highest Score</div>
        </div>
      </div>

      {/* Main Tab Switcher: Leaderboard vs Achievements */}
      <div className="play-board-tabs-row">
        <div className="play-board-tabs">
          <button
            className={`play-board-tab ${activeSection === 'ranks' ? 'play-board-tab--active' : ''}`}
            onClick={() => setActiveSection('ranks')}
          >
            <span>🏆</span>
            <span>Hall of Fame</span>
          </button>
          <button
            className={`play-board-tab ${activeSection === 'achievements' ? 'play-board-tab--active' : ''}`}
            onClick={() => setActiveSection('achievements')}
          >
            <span>🎖️</span>
            <span>Badges & Achievements</span>
          </button>
        </div>

        {activeSection === 'ranks' && (
          <div className="play-filter-pill-group">
            <button
              className={`play-filter-pill ${boardType === 'global' ? 'play-filter-pill--active' : ''}`}
              onClick={() => setBoardType('global')}
            >
              All Time
            </button>
            <button
              className={`play-filter-pill ${boardType === 'weekly' ? 'play-filter-pill--active' : ''}`}
              onClick={() => setBoardType('weekly')}
            >
              This Week
            </button>
          </div>
        )}
      </div>

      {/* Content View 1: Leaderboard Table */}
      {activeSection === 'ranks' ? (
        <div className="play-table-card">
          <table className="play-leaderboard-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>RANK</th>
                <th>PLAYER</th>
                <th>LEVEL</th>
                <th>MATCHES WON</th>
                <th>ACCURACY</th>
                <th style={{ textAlign: 'right' }}>TOTAL XP</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_GLOBAL_LEADERBOARD.map((entry) => {
                const isUser = entry.name.includes('(You)')
                return (
                  <tr
                    key={entry.rank}
                    className={`play-table-row ${isUser ? 'play-table-row--user' : ''}`}
                  >
                    <td>
                      <span className={`play-rank-badge play-rank-badge--${entry.rank}`}>
                        {entry.rank === 1
                          ? '🥇'
                          : entry.rank === 2
                          ? '🥈'
                          : entry.rank === 3
                          ? '🥉'
                          : `#${entry.rank}`}
                      </span>
                    </td>
                    <td>
                      <div className="play-table-player-cell">
                        <span className="play-table-avatar">{entry.avatar}</span>
                        <div>
                          <div className="play-table-name">
                            {entry.name}
                            <span className="play-table-badge-tag">{entry.badge}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="play-table-level">Lvl {entry.level}</span>
                    </td>
                    <td>
                      <span className="play-table-wins">{entry.wins} wins</span>
                    </td>
                    <td>
                      <div className="play-table-acc">
                        <span className="play-acc-dot" />
                        <span>{entry.accuracy}%</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="play-table-xp">{entry.xp.toLocaleString()} XP</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Content View 2: Achievements Collection */
        <div className="play-achievements-grid">
          {ALL_ACHIEVEMENTS.map((ach) => {
            const isUnlocked =
              userStats.achievements.includes(ach.id) || ach.unlocked
            return (
              <div
                key={ach.id}
                className={`play-achievement-card ${isUnlocked ? 'play-achievement-card--unlocked' : ''}`}
              >
                <div className="play-achievement-icon">{ach.icon}</div>
                <div className="play-achievement-info">
                  <div className="play-achievement-title-row">
                    <span className="play-achievement-title">{ach.title}</span>
                    <span className="play-achievement-xp">+{ach.xpReward} XP</span>
                  </div>
                  <p className="play-achievement-desc">{ach.desc}</p>
                  <span
                    className={`play-achievement-status ${isUnlocked ? 'play-achievement-status--done' : ''}`}
                  >
                    {isUnlocked ? '✓ Unlocked' : '🔒 Locked'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
