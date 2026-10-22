import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle/ThemeToggle'
import './Showcase.css'

export default function Showcase() {
  return (
    <div className="showcase-page">
      <header className="showcase-header">
        <Link to="/" className="showcase-brand">
          <span className="showcase-logo">
            Buildly<span className="dot">.</span>
          </span>
          <span className="showcase-badge">✨ Generative UI Studio</span>
        </Link>

        <nav className="showcase-nav-links">
          <Link to="/overview" className="showcase-link">
            Dashboard
          </Link>
          <Link to="/board" className="showcase-link">
            Whiteboard
          </Link>
          <Link to="/play" className="showcase-link">
            Play Mode
          </Link>
        </nav>

        <div className="showcase-actions">
          <a
            href="/showcase.html"
            target="_blank"
            rel="noopener noreferrer"
            className="showcase-raw-link"
            title="Open pure HTML showcase artifact in dedicated window"
          >
            <span>⤢</span> Fullscreen
          </a>
          <ThemeToggle variant="pill" />
          <Link to="/overview" className="showcase-back-btn">
            ← Workspace
          </Link>
        </div>
      </header>

      <main className="showcase-body">
        <iframe
          src="/showcase.html"
          title="Buildly Generative UI Showcase"
          className="showcase-iframe"
          allow="microphone; camera; clipboard-write;"
        />
      </main>
    </div>
  )
}
