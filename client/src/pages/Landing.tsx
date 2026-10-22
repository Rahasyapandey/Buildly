import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle/ThemeToggle'
import './Landing.css'

export default function Landing() {
  const navigate = useNavigate()
  return (
    <div className="landing-container">
      {/* ─────────────────────────────────────────────────────────────
          TOP HERO HEADER
          ───────────────────────────────────────────────────────────── */}
      <header className="landing-hero">
        <div className="landing-hero__brand">
          <img
            src="/logo.png"
            alt="Buildly Logo"
            className="landing-hero__logo"
          />
          <h1 className="landing-hero__title">Buildly</h1>
        </div>

        <div className="landing-hero__tagline">
          Plan &nbsp;·&nbsp; Design &nbsp;·&nbsp; Build &nbsp;·&nbsp; Together
        </div>

        <p className="landing-hero__subtitle">
          The collaborative developer workspace for modern teams.
          <br />
          Whiteboard, design, plan, and build — all in one place.
        </p>

        <div className="landing-hero__cta">
          <Link to="/overview" className="cta-primary">
            Open Workspace →
          </Link>
          <Link to="/board" className="cta-secondary">
            ⚡ Quick Whiteboard
          </Link>
          <a
            href="https://github.com/Rahasyapandey/Buildly"
            className="cta-secondary"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <ThemeToggle variant="pill" />
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          HERO STAGE: DOODLES, CURSORS & MOCKUP WINDOW
          ───────────────────────────────────────────────────────────── */}
      <div className="hero-stage">
        {/* Doodles */}
        <div className="doodle-note doodle-note--left">
          <span>From ideas...</span>
          <svg className="doodle-arrow" viewBox="0 0 40 40">
            <path
              d="M 10 10 Q 25 15 28 32 M 22 28 L 28 32 L 32 24"
              stroke="#4f46e5"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="doodle-note doodle-note--right">
          <span>Better ideas together</span>
          <svg className="doodle-arrow" viewBox="0 0 40 40">
            <path
              d="M 30 10 Q 15 15 12 32 M 18 28 L 12 32 L 8 24"
              stroke="#4f46e5"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Floating Card Badges */}
        <div className="floating-badge floating-badge--left">
          <span className="floating-badge__icon">🖼️</span>
          <span>Design &amp; Plan</span>
        </div>

        <div className="floating-badge floating-badge--right">
          <span className="floating-badge__icon">&lt;/&gt;</span>
          <span>Build Together</span>
        </div>

        {/* Live User Cursor Chips */}
        <div className="cursor-chip cursor-chip--aarav">
          <svg className="cursor-pointer-icon" viewBox="0 0 24 24">
            <path d="M4 2 L18 10 L11 12 L8 19 Z" />
          </svg>
          <div className="cursor-avatar cursor-avatar--aarav">
            A
            <span className="cursor-avatar__status cursor-avatar__status--green" />
          </div>
          <span>
            <strong>Aarav</strong> is working on the diagram...
          </span>
        </div>

        <div className="cursor-chip cursor-chip--yashasvi">
          <svg className="cursor-pointer-icon" viewBox="0 0 24 24">
            <path d="M4 2 L18 10 L11 12 L8 19 Z" />
          </svg>
          <div className="cursor-avatar cursor-avatar--yashasvi">
            Y
            <span className="cursor-avatar__status cursor-avatar__status--purple" />
          </div>
          <span>
            <strong>Yashasvi</strong> edited the board
          </span>
        </div>

        {/* ── Mockup Window Showcase ──────────────────────────────── */}
        <div className="mockup-window">
          {/* Window Top Bar */}
          <div className="mockup-topbar">
            <div className="mockup-topbar__left">
              <Link to="/overview" className="mockup-brand">
                <img
                  src="/logo.png"
                  alt="Buildly"
                  className="mockup-brand__logo"
                />
                <span>Buildly</span>
              </Link>
              <div className="mockup-project-picker">
                <span>Project Alpha</span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>⌄</span>
              </div>
            </div>

            <div className="mockup-topbar__right">
              <div className="mockup-team-avatars">
                <div
                  className="mockup-team-avatar"
                  style={{ backgroundColor: '#3b82f6' }}
                >
                  A
                </div>
                <div
                  className="mockup-team-avatar"
                  style={{ backgroundColor: '#8b5cf6' }}
                >
                  Y
                </div>
                <div
                  className="mockup-team-avatar"
                  style={{ backgroundColor: '#10b981' }}
                >
                  R
                </div>
                <div
                  className="mockup-team-avatar"
                  style={{ backgroundColor: '#f59e0b', fontSize: '9px' }}
                >
                  +3
                </div>
              </div>
              <button
                className="mockup-btn-share"
                onClick={() => alert('Invite link copied to clipboard!')}
              >
                🔗 Share
              </button>
            </div>
          </div>

          {/* Window Canvas Workspace */}
          <div className="mockup-workspace">
            {/* Left Mini Nav */}
            <aside className="mockup-sidebar">
              <Link
                to="/overview"
                className="mockup-nav-item"
                style={{ textDecoration: 'none' }}
              >
                <span>🏠</span> Home
              </Link>
              <button className="mockup-nav-item mockup-nav-item--active">
                <span>📄</span> Boards
              </button>
              <button className="mockup-nav-item">
                <span>📁</span> Projects
              </button>
              <button className="mockup-nav-item">
                <span>👥</span> Team
              </button>
              <button className="mockup-nav-item">
                <span>⚙</span> Settings
              </button>
            </aside>

            {/* Floating Vertical Tool Palette */}
            <div className="mockup-toolbar">
              <button className="mockup-tool-btn mockup-tool-btn--active">
                ↖
              </button>
              <button className="mockup-tool-btn">▭</button>
              <button className="mockup-tool-btn">✏️</button>
              <button className="mockup-tool-btn">T</button>
              <button className="mockup-tool-btn">📝</button>
              <button className="mockup-tool-btn">田</button>
              <button className="mockup-tool-btn">✒️</button>
              <button className="mockup-tool-btn">🔗</button>
              <button className="mockup-tool-btn">···</button>
            </div>

            {/* Canvas Quadrant Diagrams */}
            <div className="mockup-canvas-content">
              {/* Quadrant 1: System Architecture */}
              <div>
                <div className="canvas-quadrant-title">System Architecture</div>
                <div className="arch-diagram">
                  <div className="arch-row">
                    <div className="arch-node arch-node--react">
                      Frontend
                      <br />
                      <span style={{ fontSize: '10px', opacity: 0.8 }}>
                        (React)
                      </span>
                    </div>
                    <span className="arch-arrow">→</span>
                    <div className="arch-node arch-node--fastapi">
                      Backend
                      <br />
                      <span style={{ fontSize: '10px', opacity: 0.8 }}>
                        (FastAPI)
                      </span>
                    </div>
                    <span className="arch-arrow">→</span>
                    <div className="arch-node arch-node--postgres">
                      Database
                      <br />
                      <span style={{ fontSize: '10px', opacity: 0.8 }}>
                        (PostgreSQL)
                      </span>
                    </div>
                  </div>
                  <div className="arch-node arch-node--redis">
                    Redis
                    <br />
                    <span style={{ fontSize: '10px', opacity: 0.8 }}>
                      (Cache)
                    </span>
                  </div>
                </div>
              </div>

              {/* Quadrant 2: UML Class Diagram */}
              <div>
                <div className="canvas-quadrant-title">UML Class Diagram</div>
                <div className="uml-diagram">
                  {/* User Class */}
                  <div className="uml-class-box">
                    <div className="uml-class-header">User</div>
                    <div className="uml-class-section">
                      + id: int
                      <br />
                      + name: string
                      <br />+ email: string
                    </div>
                    <div className="uml-class-section">
                      + login()
                      <br />+ logout()
                    </div>
                  </div>

                  <span
                    style={{
                      alignSelf: 'center',
                      color: '#94a3b8',
                      fontSize: '11px',
                    }}
                  >
                    1 ── *
                  </span>

                  {/* Project Class */}
                  <div className="uml-class-box">
                    <div className="uml-class-header">Project</div>
                    <div className="uml-class-section">
                      + id: int
                      <br />
                      + name: string
                      <br />+ ownerId: int
                    </div>
                    <div className="uml-class-section">
                      + create()
                      <br />+ update()
                    </div>
                  </div>
                </div>
              </div>

              {/* Quadrant 3: ERD (Entity Relationship Diagram) */}
              <div>
                <div className="canvas-quadrant-title">ERD</div>
                <div className="erd-diagram">
                  {/* User Entity */}
                  <div className="erd-entity erd-entity--purple">
                    <div className="erd-entity-header erd-entity-header--purple">
                      User
                    </div>
                    <div className="erd-entity-body">
                      id (PK)
                      <br />
                      name
                      <br />
                      email
                    </div>
                  </div>

                  <div className="erd-relation">
                    <span>creates</span>
                  </div>

                  {/* Project Entity */}
                  <div className="erd-entity erd-entity--green">
                    <div className="erd-entity-header erd-entity-header--green">
                      Project
                    </div>
                    <div className="erd-entity-body">
                      id (PK)
                      <br />
                      name
                      <br />
                      ownerId (FK)
                    </div>
                  </div>

                  <div className="erd-relation">
                    <span>has</span>
                  </div>

                  {/* Board Entity */}
                  <div className="erd-entity erd-entity--blue">
                    <div className="erd-entity-header erd-entity-header--blue">
                      Board
                    </div>
                    <div className="erd-entity-body">
                      id (PK)
                      <br />
                      title
                      <br />
                      projectId (FK)
                    </div>
                  </div>
                </div>
              </div>

              {/* Quadrant 4: Flowchart */}
              <div>
                <div className="canvas-quadrant-title">Flowchart</div>
                <div className="flowchart-diagram">
                  <div className="flowchart-node flowchart-node--start">
                    Start
                  </div>
                  <span style={{ color: '#94a3b8', fontSize: '10px' }}>↓</span>
                  <div className="flowchart-node flowchart-node--login">
                    Login
                  </div>
                  <span style={{ color: '#94a3b8', fontSize: '10px' }}>↓</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="flowchart-node--valid">
                      <span>Valid?</span>
                    </div>
                    <span style={{ fontSize: '10px', color: '#10b981' }}>
                      Yes →
                    </span>
                    <div className="flowchart-node flowchart-node--dashboard">
                      Dashboard
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Note */}
            <div className="sticky-note">
              <div>☑ UML</div>
              <div>☑ ERD</div>
              <div>☑ Flowcharts</div>
              <div style={{ fontSize: '16px', marginTop: '4px' }}>:)</div>
            </div>

            {/* Bottom Right Zoom Control */}
            <div className="mockup-zoom-bar">
              <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                -
              </button>
              <span>100%</span>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                +
              </button>
              <span>⛶</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM 6-PHASE FEATURE CARDS MATRIX
          ───────────────────────────────────────────────────────────── */}
      <section className="features-matrix">
        <Link to="/board" className="feature-pill-card">
          <div className="feature-pill-icon feature-pill-icon--blue">✏️</div>
          <div>
            <div className="feature-pill-title">Drawing Canvas</div>
            <div className="feature-pill-desc">Freehand, shapes, tools</div>
          </div>
        </Link>

        <Link to="/board" className="feature-pill-card">
          <div className="feature-pill-icon feature-pill-icon--green">⬡</div>
          <div>
            <div className="feature-pill-title">Diagramming</div>
            <div className="feature-pill-desc">UML, ERD, flowcharts</div>
          </div>
        </Link>

        <Link to="/board" className="feature-pill-card">
          <div className="feature-pill-icon feature-pill-icon--pink">👥</div>
          <div>
            <div className="feature-pill-title">Real-time Collaboration</div>
            <div className="feature-pill-desc">Multi-user, live updates</div>
          </div>
        </Link>

        <div
          className="feature-pill-card"
          onClick={() => alert('Connect Mode (audio, video & screen share) planned for Phase 6!')}
          style={{ cursor: 'pointer' }}
        >
          <div className="feature-pill-icon feature-pill-icon--cyan">📹</div>
          <div>
            <div className="feature-pill-title">Connect Mode</div>
            <div className="feature-pill-desc">Audio, video, screen share</div>
          </div>
        </div>

        <div
          className="feature-pill-card"
          onClick={() => navigate('/play')}
          style={{ cursor: 'pointer' }}
        >
          <div className="feature-pill-icon feature-pill-icon--orange">🎮</div>
          <div>
            <div className="feature-pill-title">Play Mode (Live)</div>
            <div className="feature-pill-desc">Draw & guess multiplayer game</div>
          </div>
        </div>

        <div
          className="feature-pill-card"
          onClick={() => alert('Production Ready: Docker Compose, Alembic, PostgreSQL & automated testing configured!')}
          style={{ cursor: 'pointer' }}
        >
          <div className="feature-pill-icon feature-pill-icon--purple">☁️</div>
          <div>
            <div className="feature-pill-title">Production Ready</div>
            <div className="feature-pill-desc">Security, CI/CD, deployment</div>
          </div>
        </div>
      </section>
    </div>
  )
}
