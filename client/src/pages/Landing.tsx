import { Link } from 'react-router-dom'
import './Landing.css'

// Each mode that Buildly will eventually support.
// Storing them as data makes it easy to add or remove modes later.
const MODES = [
  {
    icon: '🏗️',
    title: 'Build Mode',
    desc: 'Collaborative whiteboard and software design tools.',
  },
  {
    icon: '📡',
    title: 'Connect Mode',
    desc: 'Audio, video, and screen sharing for your team.',
  },
  {
    icon: '🎮',
    title: 'Play Mode',
    desc: 'Multiplayer games and team activities.',
  },
]

export default function Landing() {
  return (
    <main className="landing">
      {/* Logo */}
      <div className="landing__logo">
        <div className="landing__logo-icon">⚡</div>
        <span className="landing__logo-name">Buildly</span>
      </div>

      {/* Headline */}
      <h1 className="landing__headline">
        Think together.{' '}
        <span>Build together.</span>
      </h1>

      <p className="landing__tagline">
        A collaborative workspace for developers and software engineering teams.
        Design, communicate, and create in one place.
      </p>

      {/* Primary actions */}
      <div className="landing__actions">
        <Link to="/board" className="btn btn--primary">
          Open Workspace →
        </Link>
        <a
          href="https://github.com/Rahasyapandey/Buildly"
          className="btn btn--ghost"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>

      {/* Modes overview */}
      <div className="landing__modes">
        {MODES.map((mode) => (
          <div key={mode.title} className="mode-card">
            <div className="mode-card__icon">{mode.icon}</div>
            <div className="mode-card__title">{mode.title}</div>
            <p className="mode-card__desc">{mode.desc}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
