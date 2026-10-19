import { Link } from 'react-router-dom'
import './Board.css'

// Sidebar navigation items.
// Each entry has an icon, a label, and an optional "coming soon" flag.
// As new tools are built, they get added here.
const NAV_ITEMS = [
  { icon: '✏️', label: 'Draw',       active: true,  comingSoon: false },
  { icon: '▭',  label: 'Shapes',     active: false, comingSoon: false },
  { icon: '⬡',  label: 'UML',        active: false, comingSoon: true  },
  { icon: '🗃️', label: 'ERD',        active: false, comingSoon: true  },
  { icon: '⤵',  label: 'Flowchart',  active: false, comingSoon: true  },
]

export default function Board() {
  return (
    <div className="board-layout">
      {/* ── Left Sidebar ───────────────────────────────────── */}
      <aside className="sidebar">
        {/* Logo / back to landing */}
        <div className="sidebar__header">
          <div className="sidebar__logo-icon">⚡</div>
          <Link to="/" className="sidebar__logo-name" style={{ color: 'inherit', textDecoration: 'none' }}>
            Buildly
          </Link>
        </div>

        {/* Tool navigation */}
        <span className="sidebar__section-label">Tools</span>
        <nav className="sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`sidebar__nav-item${item.active ? ' sidebar__nav-item--active' : ''}`}
              disabled={item.comingSoon}
              title={item.comingSoon ? 'Coming soon' : item.label}
            >
              <span className="sidebar__nav-icon">{item.icon}</span>
              {item.label}
              {item.comingSoon && (
                <span style={{ marginLeft: 'auto', fontSize: '10px', opacity: 0.5 }}>
                  soon
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar__footer">
          <p className="sidebar__footer-text">Phase 1 — Foundation</p>
        </div>
      </aside>

      {/* ── Main content area ──────────────────────────────── */}
      <div className="board-main">
        {/* Top toolbar */}
        <header className="toolbar">
          <span className="toolbar__board-name">Untitled Board</span>
          <span className="toolbar__badge">Canvas coming in Phase 2</span>
        </header>

        {/* Canvas area — will be replaced by a real <canvas> in Phase 2 */}
        <div className="canvas-area">
          <div className="canvas-placeholder">
            <div className="canvas-placeholder__icon">🎨</div>
            <p className="canvas-placeholder__title">Canvas</p>
            <p className="canvas-placeholder__desc">
              The drawing canvas will be built in Phase 2.
              This is the workspace where you'll draw, design, and collaborate.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
