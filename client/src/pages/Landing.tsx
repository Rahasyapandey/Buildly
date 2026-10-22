import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle/ThemeToggle'
import './Landing.css'

export default function Landing() {
  const navigate = useNavigate()

  // Interactive Mockup State
  const [activeTool, setActiveTool] = useState('select')
  const [activeQuadrant, setActiveQuadrant] = useState<'all' | 'arch' | 'uml' | 'erd' | 'flow'>('all')
  const [zoomLevel, setZoomLevel] = useState(100)
  const [interactiveReactions, setInteractiveReactions] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([])

  // Interactive Diagram Tab Showcase
  const [showcaseTab, setShowcaseTab] = useState<'arch' | 'uml' | 'erd' | 'flow'>('arch')

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const emojis = ['✨', '💡', '🚀', '🎯', '👍', '❤️']
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
    setInteractiveReactions((prev) => [...prev.slice(-8), { id: Date.now(), x, y, emoji: randomEmoji }])
  }

  return (
    <div className="landing-container">
      {/* ─────────────────────────────────────────────────────────────
          TOP FLOATING GLASS NAVBAR
          ───────────────────────────────────────────────────────────── */}
      <nav className="landing-nav">
        <div className="landing-nav__inner">
          <Link to="/" className="landing-nav__brand">
            <img src="/logo.png" alt="Buildly Logo" className="landing-nav__logo" />
            <span className="landing-nav__title">
              Buildly<span className="landing-nav__dot">.</span>
            </span>
          </Link>

          <div className="landing-nav__links">
            <Link to="/overview" className="landing-nav__link">Workspace</Link>
            <Link to="/board" className="landing-nav__link">Whiteboard</Link>
            <Link to="/play" className="landing-nav__link">Play Mode</Link>
            <Link to="/showcase" className="landing-nav__link landing-nav__link--sparkle">
              Generative UI ✨
            </Link>
            <a
              href="https://github.com/Rahasyapandey/Buildly"
              target="_blank"
              rel="noreferrer"
              className="landing-nav__link"
            >
              GitHub
            </a>
          </div>

          <div className="landing-nav__actions">
            <ThemeToggle variant="pill" />
            <Link to="/overview" className="landing-nav__cta">
              Launch Studio →
            </Link>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          HERO HEADER
          ───────────────────────────────────────────────────────────── */}
      <header className="landing-hero">
        {/* Animated Announcement Pill */}
        <div className="landing-announcement" onClick={() => navigate('/showcase')}>
          <span className="landing-announcement__pill">BUILDLY 2.0</span>
          <span>Ultra-Responsive Collaborative Canvas &amp; Generative UI Suite</span>
          <span className="landing-announcement__arrow">→</span>
        </div>

        <div className="landing-hero__brand">
          <img
            src="/logo.png"
            alt="Buildly Logo"
            className="landing-hero__logo"
          />
          <h1 className="landing-hero__title">
            Buildly<span className="landing-hero__dot">.</span>
          </h1>
        </div>

        <div className="landing-hero__tagline">
          Plan &nbsp;·&nbsp; Design &nbsp;·&nbsp; Build &nbsp;·&nbsp; Together
        </div>

        <p className="landing-hero__subtitle">
          The collaborative developer workspace for modern engineering teams.
          <br />
          Whiteboard system architecture, UML models, database schemas, and play multiplayer games — all in one place.
        </p>

        <div className="landing-hero__cta">
          <Link to="/overview" className="cta-primary">
            Open Workspace Studio →
          </Link>
          <Link to="/board" className="cta-secondary">
            ⚡ Quick Whiteboard
          </Link>
          <button
            onClick={() => navigate('/play')}
            className="cta-secondary cta-play"
          >
            🎮 Play Mode (Live)
          </button>
          <Link to="/showcase" className="cta-showcase">
            ✨ Generative UI Showcase
          </Link>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          HERO STAGE: DOODLES, CURSORS & INTERACTIVE MOCKUP WINDOW
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
          <span>Better systems together</span>
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
            <strong>Aarav</strong> is designing the architecture...
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
            <strong>Yashasvi</strong> updated database ERD
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
                <span>Buildly<span style={{ color: '#2563eb' }}>.</span></span>
              </Link>
              <div className="mockup-project-picker">
                <span>Production Architecture Suite</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>⌄</span>
              </div>
            </div>

            {/* Quadrant Focus Tabs */}
            <div className="mockup-quadrant-tabs">
              <button
                className={`mockup-q-tab ${activeQuadrant === 'all' ? 'mockup-q-tab--active' : ''}`}
                onClick={() => setActiveQuadrant('all')}
              >
                All (4 Quadrants)
              </button>
              <button
                className={`mockup-q-tab ${activeQuadrant === 'arch' ? 'mockup-q-tab--active' : ''}`}
                onClick={() => setActiveQuadrant('arch')}
              >
                Architecture
              </button>
              <button
                className={`mockup-q-tab ${activeQuadrant === 'uml' ? 'mockup-q-tab--active' : ''}`}
                onClick={() => setActiveQuadrant('uml')}
              >
                UML Class
              </button>
              <button
                className={`mockup-q-tab ${activeQuadrant === 'erd' ? 'mockup-q-tab--active' : ''}`}
                onClick={() => setActiveQuadrant('erd')}
              >
                ERD
              </button>
              <button
                className={`mockup-q-tab ${activeQuadrant === 'flow' ? 'mockup-q-tab--active' : ''}`}
                onClick={() => setActiveQuadrant('flow')}
              >
                Flowchart
              </button>
            </div>

            <div className="mockup-topbar__right">
              <div className="mockup-team-avatars">
                <div
                  className="mockup-team-avatar"
                  style={{ backgroundColor: '#3b82f6' }}
                  title="Aarav"
                >
                  A
                </div>
                <div
                  className="mockup-team-avatar"
                  style={{ backgroundColor: '#8b5cf6' }}
                  title="Yashasvi"
                >
                  Y
                </div>
                <div
                  className="mockup-team-avatar"
                  style={{ backgroundColor: '#10b981' }}
                  title="Rahasya"
                >
                  R
                </div>
                <div
                  className="mockup-team-avatar"
                  style={{ backgroundColor: '#f59e0b', fontSize: '9px' }}
                >
                  +4
                </div>
              </div>
              <button
                className="mockup-btn-share"
                onClick={() => alert('Invite link copied! Share with your team.')}
              >
                🔗 Share
              </button>
              <button
                className="mockup-btn-launch"
                onClick={() => navigate('/board?template=system-architecture')}
              >
                Launch Board →
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
              <button
                className="mockup-nav-item mockup-nav-item--active"
                onClick={() => navigate('/board')}
              >
                <span>📄</span> Boards
              </button>
              <button className="mockup-nav-item" onClick={() => navigate('/play')}>
                <span>🎮</span> Play
              </button>
              <button className="mockup-nav-item" onClick={() => navigate('/showcase')}>
                <span>✨</span> Showcase
              </button>
              <button className="mockup-nav-item" onClick={() => navigate('/overview')}>
                <span>⚙</span> Settings
              </button>
            </aside>

            {/* Floating Vertical Tool Palette (Interactive) */}
            <div className="mockup-toolbar">
              {[
                { id: 'select', icon: '↖', label: 'Select' },
                { id: 'rect', icon: '▭', label: 'Rectangle' },
                { id: 'pen', icon: '✏️', label: 'Freehand' },
                { id: 'text', icon: 'T', label: 'Text' },
                { id: 'sticky', icon: '📝', label: 'Sticky' },
                { id: 'grid', icon: '田', label: 'Grid' },
                { id: 'laser', icon: '✒️', label: 'Vector' },
                { id: 'link', icon: '🔗', label: 'Connect' },
              ].map((t) => (
                <button
                  key={t.id}
                  className={`mockup-tool-btn ${activeTool === t.id ? 'mockup-tool-btn--active' : ''}`}
                  onClick={() => setActiveTool(t.id)}
                  title={t.label}
                >
                  {t.icon}
                </button>
              ))}
            </div>

            {/* Canvas Quadrant Diagrams */}
            <div
              className={`mockup-canvas-content mockup-canvas-content--${activeQuadrant}`}
              onClick={handleCanvasClick}
              title="Click anywhere to stamp live reactions!"
            >
              {/* Stamp reactions */}
              {interactiveReactions.map((r) => (
                <span
                  key={r.id}
                  className="mockup-reaction-stamp"
                  style={{ left: r.x - 10, top: r.y - 10 }}
                >
                  {r.emoji}
                </span>
              ))}

              {/* Quadrant 1: System Architecture */}
              {(activeQuadrant === 'all' || activeQuadrant === 'arch') && (
                <div className="mockup-quad-box">
                  <div className="canvas-quadrant-title">
                    <span>System Architecture</span>
                    <button
                      className="canvas-quadrant-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate('/board?template=system-architecture&title=System Architecture')
                      }}
                    >
                      Open in Canvas ↗
                    </button>
                  </div>
                  <div className="arch-diagram">
                    <div className="arch-row">
                      <div className="arch-node arch-node--react">
                        Frontend
                        <br />
                        <span style={{ fontSize: '12px', opacity: 0.8 }}>
                          (React 19)
                        </span>
                      </div>
                      <span className="arch-arrow">→</span>
                      <div className="arch-node arch-node--fastapi">
                        Backend
                        <br />
                        <span style={{ fontSize: '12px', opacity: 0.8 }}>
                          (FastAPI)
                        </span>
                      </div>
                      <span className="arch-arrow">→</span>
                      <div className="arch-node arch-node--postgres">
                        Database
                        <br />
                        <span style={{ fontSize: '12px', opacity: 0.8 }}>
                          (PostgreSQL 16)
                        </span>
                      </div>
                    </div>
                    <div className="arch-node arch-node--redis">
                      Redis
                      <br />
                      <span style={{ fontSize: '12px', opacity: 0.8 }}>
                        (Cache &amp; PubSub)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quadrant 2: UML Class Diagram */}
              {(activeQuadrant === 'all' || activeQuadrant === 'uml') && (
                <div className="mockup-quad-box">
                  <div className="canvas-quadrant-title">
                    <span>UML Class Diagram</span>
                    <button
                      className="canvas-quadrant-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate('/board?template=uml-class&title=UML Class Diagram')
                      }}
                    >
                      Open in Canvas ↗
                    </button>
                  </div>
                  <div className="uml-diagram">
                    {/* User Class */}
                    <div className="uml-class-box">
                      <div className="uml-class-header">User</div>
                      <div className="uml-class-section">
                        + id: UUID
                        <br />
                        + name: string
                        <br />+ email: string
                      </div>
                      <div className="uml-class-section">
                        + login(): Token
                        <br />+ logout(): void
                      </div>
                    </div>

                    <span
                      style={{
                        alignSelf: 'center',
                        color: '#94a3b8',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      1 ── * owns
                    </span>

                    {/* Board Class */}
                    <div className="uml-class-box">
                      <div className="uml-class-header">Board</div>
                      <div className="uml-class-section">
                        + id: UUID
                        <br />
                        + title: string
                        <br />+ elements: Element[]
                      </div>
                      <div className="uml-class-section">
                        + exportPdf(): Promise
                        <br />+ syncDelta(): void
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quadrant 3: ERD (Entity Relationship Diagram) */}
              {(activeQuadrant === 'all' || activeQuadrant === 'erd') && (
                <div className="mockup-quad-box">
                  <div className="canvas-quadrant-title">
                    <span>Relational Database (ERD)</span>
                    <button
                      className="canvas-quadrant-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate('/board?template=erd&title=Relational ERD')
                      }}
                    >
                      Open in Canvas ↗
                    </button>
                  </div>
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
              )}

              {/* Quadrant 4: Flowchart */}
              {(activeQuadrant === 'all' || activeQuadrant === 'flow') && (
                <div className="mockup-quad-box">
                  <div className="canvas-quadrant-title">
                    <span>Real-time Auth &amp; Sync Flowchart</span>
                    <button
                      className="canvas-quadrant-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate('/board?template=flowchart&title=Auth Flowchart')
                      }}
                    >
                      Open in Canvas ↗
                    </button>
                  </div>
                  <div className="flowchart-diagram">
                    <div className="flowchart-node flowchart-node--start">
                      Start
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>↓</span>
                    <div className="flowchart-node flowchart-node--login">
                      Validate JWT
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>↓</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="flowchart-node--valid">
                        <span>Valid?</span>
                      </div>
                      <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>
                        Yes →
                      </span>
                      <div className="flowchart-node flowchart-node--dashboard">
                        Live WebRTC Canvas
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Note */}
            <div className="sticky-note">
              <div>☑ Cloud Architecture</div>
              <div>☑ UML Domain Models</div>
              <div>☑ Database ERD</div>
              <div>☑ Vector PDF Export</div>
              <div style={{ fontSize: '16px', marginTop: '4px' }}>🚀</div>
            </div>

            {/* Bottom Right Zoom Control */}
            <div className="mockup-zoom-bar">
              <button
                onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
              >
                -
              </button>
              <span>{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(200, z + 10))}
                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
              >
                +
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                title="Reset 100%"
              >
                ⛶
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ENGINE STATS & TELEMETRY BANNER
          ───────────────────────────────────────────────────────────── */}
      <section className="landing-stats-bar">
        <div className="landing-stat-item">
          <div className="landing-stat-val">&lt;15ms</div>
          <div className="landing-stat-label">WebSocket Sync Latency</div>
        </div>
        <div className="landing-stat-divider" />
        <div className="landing-stat-item">
          <div className="landing-stat-val">100%</div>
          <div className="landing-stat-label">Vector PDF &amp; SVG Fidelity</div>
        </div>
        <div className="landing-stat-divider" />
        <div className="landing-stat-item">
          <div className="landing-stat-val">WebRTC</div>
          <div className="landing-stat-label">Integrated Stereo Voice Huddle</div>
        </div>
        <div className="landing-stat-divider" />
        <div className="landing-stat-item">
          <div className="landing-stat-val">Infinite</div>
          <div className="landing-stat-label">Spatial Multi-user Canvas</div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          INTERACTIVE ARCHITECTURE SHOWCASE SECTION
          ───────────────────────────────────────────────────────────── */}
      <section className="diagram-deepdive-section">
        <div className="deepdive-header">
          <span className="deepdive-badge">ENGINEERING DIAGRAMS</span>
          <h2 className="deepdive-title">Four Essential Diagrams, Zero Friction</h2>
          <p className="deepdive-desc">
            Toggle between specialized templates designed for production software engineering teams.
          </p>

          <div className="deepdive-tabs">
            <button
              className={`deepdive-tab ${showcaseTab === 'arch' ? 'deepdive-tab--active' : ''}`}
              onClick={() => setShowcaseTab('arch')}
            >
              ☁️ Cloud Architecture
            </button>
            <button
              className={`deepdive-tab ${showcaseTab === 'uml' ? 'deepdive-tab--active' : ''}`}
              onClick={() => setShowcaseTab('uml')}
            >
              📦 UML Domain Model
            </button>
            <button
              className={`deepdive-tab ${showcaseTab === 'erd' ? 'deepdive-tab--active' : ''}`}
              onClick={() => setShowcaseTab('erd')}
            >
              🗄️ Database ERD
            </button>
            <button
              className={`deepdive-tab ${showcaseTab === 'flow' ? 'deepdive-tab--active' : ''}`}
              onClick={() => setShowcaseTab('flow')}
            >
              ⚡ Auth Flowchart
            </button>
          </div>
        </div>

        <div className="deepdive-content-card">
          {showcaseTab === 'arch' && (
            <div className="deepdive-grid">
              <div className="deepdive-info">
                <h3>Cloud Microservices Topology</h3>
                <p>
                  Map distributed systems with API Gateways, FastAPI services, Redis caches, and PostgreSQL clusters.
                  Export directly to high-resolution vector PDF for architectural review boards.
                </p>
                <ul className="deepdive-bullets">
                  <li>✓ Service boundary mapping &amp; port connectors</li>
                  <li>✓ Low-latency Redis pub/sub caches</li>
                  <li>✓ Instant 2x/4x vector PDF export</li>
                </ul>
                <button
                  className="deepdive-launch-btn"
                  onClick={() => navigate('/board?template=system-architecture&title=Cloud Architecture')}
                >
                  Load Architecture Template on Board →
                </button>
              </div>
              <div className="deepdive-preview-box">
                <div className="deepdive-mock-nodes">
                  <div className="dd-node dd-node--blue">React 19 Client</div>
                  <span className="dd-arrow">──&gt;</span>
                  <div className="dd-node dd-node--purple">API Gateway (NGINX)</div>
                  <span className="dd-arrow">──&gt;</span>
                  <div className="dd-node dd-node--green">FastAPI Microservice</div>
                </div>
              </div>
            </div>
          )}

          {showcaseTab === 'uml' && (
            <div className="deepdive-grid">
              <div className="deepdive-info">
                <h3>Object-Oriented Domain Models</h3>
                <p>
                  Design UML class hierarchies with attributes, methods, visibility indicators (+, -, #), and 1:N cardinality relationships.
                </p>
                <ul className="deepdive-bullets">
                  <li>✓ Standard UML 2.5 class syntax</li>
                  <li>✓ Inheritance and association connectors</li>
                  <li>✓ Clean dark and light mode contrast</li>
                </ul>
                <button
                  className="deepdive-launch-btn"
                  onClick={() => navigate('/board?template=uml-class&title=UML Domain Model')}
                >
                  Load UML Class Template on Board →
                </button>
              </div>
              <div className="deepdive-preview-box">
                <div className="deepdive-mock-uml">
                  <div className="dd-uml-box">
                    <div className="dd-uml-head">«User»</div>
                    <div className="dd-uml-body">+ id: UUID<br />+ email: string</div>
                    <div className="dd-uml-foot">+ login(): Token</div>
                  </div>
                  <span className="dd-arrow">1 ──── *</span>
                  <div className="dd-uml-box">
                    <div className="dd-uml-head">«Board»</div>
                    <div className="dd-uml-body">+ id: UUID<br />+ elements: Element[]</div>
                    <div className="dd-uml-foot">+ exportPdf(): void</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showcaseTab === 'erd' && (
            <div className="deepdive-grid">
              <div className="deepdive-info">
                <h3>Relational Database Schema (ERD)</h3>
                <p>
                  Visualize PostgreSQL tables, foreign key constraints, column data types, and primary index mappings with crystal clarity.
                </p>
                <ul className="deepdive-bullets">
                  <li>✓ Column types: UUID, JSONB, TIMESTAMPTZ, BIGINT</li>
                  <li>✓ Primary Key (PK) &amp; Foreign Key (FK) flags</li>
                  <li>✓ 1-to-many and many-to-many relationship lines</li>
                </ul>
                <button
                  className="deepdive-launch-btn"
                  onClick={() => navigate('/board?template=erd&title=Relational ERD Schema')}
                >
                  Load Database ERD Template on Board →
                </button>
              </div>
              <div className="deepdive-preview-box">
                <div className="deepdive-mock-erd">
                  <div className="dd-erd-table">
                    <div className="dd-erd-th">users (PK)</div>
                    <div className="dd-erd-td">id: uuid (PK)<br />email: varchar(255)<br />created_at: timestamp</div>
                  </div>
                  <span className="dd-arrow">1:N ──&gt;</span>
                  <div className="dd-erd-table">
                    <div className="dd-erd-th" style={{ background: '#059669' }}>boards</div>
                    <div className="dd-erd-td">id: uuid (PK)<br />owner_id: uuid (FK)<br />elements: jsonb</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showcaseTab === 'flow' && (
            <div className="deepdive-grid">
              <div className="deepdive-info">
                <h3>Production Auth &amp; Logic Flowcharts</h3>
                <p>
                  Illustrate async workflows, decision diamonds, terminal stages, and OAuth retry policies.
                </p>
                <ul className="deepdive-bullets">
                  <li>✓ Process boxes &amp; decision nodes</li>
                  <li>✓ Directional flow paths with labels</li>
                  <li>✓ Sticky notes for architectural context</li>
                </ul>
                <button
                  className="deepdive-launch-btn"
                  onClick={() => navigate('/board?template=flowchart&title=Auth Flowchart')}
                >
                  Load Flowchart Template on Board →
                </button>
              </div>
              <div className="deepdive-preview-box">
                <div className="deepdive-mock-flow">
                  <div className="dd-flow-pill">Start</div>
                  <span className="dd-arrow">↓</span>
                  <div className="dd-flow-box">Validate JWT &amp; Role</div>
                  <span className="dd-arrow">↓</span>
                  <div className="dd-flow-box" style={{ borderColor: '#10b981', color: '#10b981' }}>Connect WebRTC Canvas</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM 6-PHASE FEATURE CARDS MATRIX
          ───────────────────────────────────────────────────────────── */}
      <section className="features-matrix">
        <Link to="/board" className="feature-pill-card">
          <div className="feature-pill-icon feature-pill-icon--blue">✏️</div>
          <div>
            <div className="feature-pill-title">Drawing Canvas</div>
            <div className="feature-pill-desc">Freehand pen, shapes, sticky notes &amp; text</div>
          </div>
        </Link>

        <Link to="/board?template=system-architecture" className="feature-pill-card">
          <div className="feature-pill-icon feature-pill-icon--green">⬡</div>
          <div>
            <div className="feature-pill-title">Diagramming</div>
            <div className="feature-pill-desc">UML, ERD, flowcharts &amp; architecture</div>
          </div>
        </Link>

        <Link to="/board" className="feature-pill-card">
          <div className="feature-pill-icon feature-pill-icon--pink">👥</div>
          <div>
            <div className="feature-pill-title">Real-time Collaboration</div>
            <div className="feature-pill-desc">Multi-user cursors &amp; instant vector sync</div>
          </div>
        </Link>

        <div
          className="feature-pill-card"
          onClick={() => navigate('/board?mode=connect')}
          style={{ cursor: 'pointer' }}
        >
          <div className="feature-pill-icon feature-pill-icon--cyan">🎙️</div>
          <div>
            <div className="feature-pill-title">Connect Mode (Voice)</div>
            <div className="feature-pill-desc">Low-latency WebRTC stereo huddle</div>
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
            <div className="feature-pill-desc">Draw &amp; guess multiplayer game with bots</div>
          </div>
        </div>

        <Link
          to="/showcase"
          className="feature-pill-card feature-pill-card--showcase"
        >
          <div className="feature-pill-icon feature-pill-icon--purple">✨</div>
          <div>
            <div className="feature-pill-title">Generative UI Suite</div>
            <div className="feature-pill-desc">Interactive executive studio &amp; simulators</div>
          </div>
        </Link>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER
          ───────────────────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-footer__left">
          <img src="/logo.png" alt="Buildly" className="landing-footer__logo" />
          <span className="landing-footer__brand">
            Buildly<span style={{ color: '#2563eb' }}>.</span>
          </span>
          <span className="landing-footer__copy">
            © 2026 Buildly. The collaborative developer workspace.
          </span>
        </div>

        <div className="landing-footer__right">
          <span className="landing-footer__status">● All systems operational</span>
          <Link to="/overview" className="landing-footer__link">Workspace</Link>
          <Link to="/board" className="landing-footer__link">Whiteboard</Link>
          <Link to="/play" className="landing-footer__link">Play Mode</Link>
          <Link to="/showcase" className="landing-footer__link">Generative UI</Link>
        </div>
      </footer>
    </div>
  )
}
