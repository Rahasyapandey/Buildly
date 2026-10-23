import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle/ThemeToggle'
import UserMenu from '../components/Auth/UserMenu'
import LandingBackground3D from '../components/Landing/LandingBackground3D'
import {
  IconCheck,
  IconCloud,
  IconDatabase,
  IconDiagram,
  IconDownload,
  IconFileText,
  IconFolder,
  IconGamepad,
  IconInfinity,
  IconLink,
  IconMicrophone,
  IconPackage,
  IconPen,
  IconScreen,
  IconSettings,
  IconShare,
  IconShield,
  IconSticky,
  IconUser,
  IconUsers,
  IconZap,
} from '../components/Icons/Icons'
import './Landing.css'

export default function Landing() {
  const navigate = useNavigate()

  // Interactive Mockup State
  const [activeTool, setActiveTool] = useState('select')
  const [activeQuadrant, setActiveQuadrant] = useState<'all' | 'arch' | 'uml' | 'erd' | 'flow'>('all')
  const [zoomLevel, setZoomLevel] = useState(100)
  const [interactiveReactions, setInteractiveReactions] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([])

  // Interactive Diagram Tabs
  const [diagramTab, setDiagramTab] = useState<'arch' | 'uml' | 'erd' | 'flow'>('arch')

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
      {/* ── 3D Flowing Ribbons & Frosted Elements Background ──── */}
      <LandingBackground3D />

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
            <UserMenu />
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
        <div className="landing-announcement" onClick={() => navigate('/overview')}>
          <span className="landing-announcement__pill">BUILDLY 2.0</span>
          <span>Ultra-Responsive Collaborative Canvas &amp; Multiplayer Party Mode</span>
          <span className="landing-announcement__arrow">→</span>
        </div>

        <h1 className="landing-hero__title">
          Buildly<span className="hero-title-dot">.</span>
        </h1>

        <div className="landing-hero__tagline">
          Plan &nbsp;·&nbsp; Design &nbsp;·&nbsp; Build &nbsp;·&nbsp; Together
        </div>

        <p className="landing-hero__subtitle">
          The collaborative developer workspace for modern engineering teams.
          Whiteboard system architecture, UML models, database schemas, and play
          multiplayer games — all in one place.
        </p>

        <div className="landing-hero__cta">
          <Link to="/overview" className="cta-primary">
            Open Workspace Studio →
          </Link>
          <Link to="/board" className="cta-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <IconZap size={15} />
            <span>Quick Whiteboard</span>
          </Link>
          <button
            onClick={() => navigate('/play')}
            className="cta-secondary cta-play"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
          >
            <IconGamepad size={15} />
            <span>Play Mode (Live)</span>
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          HERO STAGE: DOODLES, CURSORS & INTERACTIVE MOCKUP WINDOW
          ───────────────────────────────────────────────────────────── */}
      <div className="hero-stage">
        {/* ── Mockup Window Interactive Preview ─────────────────── */}
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
                  title="Harsh"
                >
                  H
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
                  +2
                </div>
              </div>
              <button
                className="mockup-btn-share"
                onClick={() => alert('Invite link copied! Share with your team.')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
              >
                <IconShare size={12} />
                <span>Share</span>
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
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <IconFolder size={13} /> Home
              </Link>
              <button
                className="mockup-nav-item mockup-nav-item--active"
                onClick={() => navigate('/board')}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <IconFileText size={13} /> Boards
              </button>
              <button
                className="mockup-nav-item"
                onClick={() => navigate('/board?template=system-architecture')}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <IconFolder size={13} /> Design &amp; Plan
              </button>
              <button
                className="mockup-nav-item"
                onClick={() => navigate('/overview')}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <IconSettings size={13} /> Settings
              </button>
            </aside>

            {/* Floating Vertical Tool Palette (Interactive) */}
            <div className="mockup-toolbar">
              {[
                { id: 'select', icon: '↖', label: 'Select' },
                { id: 'rect', icon: '▭', label: 'Rectangle' },
                { id: 'pen', icon: <IconPen size={13} />, label: 'Freehand' },
                { id: 'text', icon: 'T', label: 'Text' },
                { id: 'sticky', icon: <IconSticky size={13} />, label: 'Sticky' },
                { id: 'grid', icon: '田', label: 'Grid' },
                { id: 'laser', icon: <IconZap size={13} />, label: 'Vector' },
                { id: 'link', icon: <IconLink size={13} />, label: 'Connect' },
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

              {/* View A: Single Architecture with Properties Panel (Image 2 Reference) */}
              {activeQuadrant === 'arch' && (
                <div className="mockup-single-arch-layout">
                  <div className="single-arch-canvas-area">
                    {/* User Root Node */}
                    <div className="arch-tree-user">
                      <div className="arch-tree-user-pill">
                        <IconUser size={15} />
                        <span>User</span>
                      </div>
                    </div>

                    <div className="arch-tree-stem-v" />

                    {/* Middle Microservices Tier */}
                    <div className="arch-tree-row arch-tree-row--primary">
                      <div className="arch-tree-card arch-tree-card--frontend">
                        <div className="arch-card-icon"><IconScreen size={16} /></div>
                        <div>
                          <div className="arch-card-title">Frontend</div>
                          <div className="arch-card-tech">(React)</div>
                        </div>
                      </div>

                      <div className="arch-tree-conn-h">↔</div>

                      <div className="arch-tree-card arch-tree-card--backend">
                        <div className="arch-card-icon"><IconPackage size={16} /></div>
                        <div>
                          <div className="arch-card-title">Backend</div>
                          <div className="arch-card-tech">(FastAPI)</div>
                        </div>
                      </div>

                      <div className="arch-tree-conn-h">↔</div>

                      <div className="arch-tree-card arch-tree-card--db">
                        <div className="arch-card-icon"><IconDatabase size={16} /></div>
                        <div>
                          <div className="arch-card-title">Database</div>
                          <div className="arch-card-tech">(PostgreSQL)</div>
                        </div>
                      </div>
                    </div>

                    <div className="arch-tree-stem-v" />

                    {/* Lower Services Tier */}
                    <div className="arch-tree-row arch-tree-row--secondary">
                      <div className="arch-tree-card arch-tree-card--payment">
                        <div className="arch-card-bullet" style={{ backgroundColor: '#f59e0b' }} />
                        <div>
                          <div className="arch-card-title">Payment Service</div>
                          <div className="arch-card-tech">(Stripe)</div>
                        </div>
                      </div>

                      <div className="arch-tree-card arch-tree-card--auth">
                        <div className="arch-card-bullet" style={{ backgroundColor: '#3b82f6' }} />
                        <div>
                          <div className="arch-card-title">Auth Service</div>
                          <div className="arch-card-tech">(JWT)</div>
                        </div>
                      </div>

                      <div className="arch-tree-card arch-tree-card--notify">
                        <div className="arch-card-bullet" style={{ backgroundColor: '#ec4899' }} />
                        <div>
                          <div className="arch-card-title">Notification Service</div>
                          <div className="arch-card-tech">(Email/SMS)</div>
                        </div>
                      </div>
                    </div>

                    {/* Minimap preview in bottom-left */}
                    <div className="mockup-minimap-box">
                      <div className="minimap-grid-dot" />
                      <div className="minimap-skeleton-tree">
                        <div className="minimap-node minimap-node--top" />
                        <div className="minimap-row">
                          <span className="minimap-bar" />
                          <span className="minimap-bar" />
                          <span className="minimap-bar" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Inspector Sidebar (Matching Image 2 Reference) */}
                  <aside className="mockup-inspector-sidebar">
                    <div className="inspector-header">
                      <h4 className="inspector-heading">System Architecture</h4>
                    </div>

                    <div className="inspector-tabs-row">
                      <button className="inspector-tab-btn inspector-tab-btn--active">Properties</button>
                      <button className="inspector-tab-btn">Settings</button>
                    </div>

                    <div className="inspector-group">
                      <label className="inspector-label">Title</label>
                      <input
                        type="text"
                        readOnly
                        value="System Architecture"
                        className="inspector-input"
                      />
                    </div>

                    <div className="inspector-group">
                      <label className="inspector-label">Description</label>
                      <textarea
                        readOnly
                        value="High-level architecture of our e-commerce platform with microservices."
                        className="inspector-textarea"
                        rows={3}
                      />
                    </div>

                    <div className="inspector-group">
                      <label className="inspector-label">Theme</label>
                      <div className="inspector-select-box">
                        <span>Light</span>
                        <span style={{ fontSize: '11px', opacity: 0.6 }}>▾</span>
                      </div>
                    </div>

                    <button
                      className="inspector-export-action-btn"
                      onClick={() => navigate('/board?template=system-architecture')}
                    >
                      <IconDownload size={14} />
                      <span>Export</span>
                    </button>
                  </aside>
                </div>
              )}

              {/* View B: Quadrant 1 (in 4-quadrant layout, Image 1 Reference) */}
              {activeQuadrant === 'all' && (
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
                  <div className="mockup-quad-footer">
                    <div className="canvas-user-pill-tag">
                      <span className="user-pill-avatar" style={{ backgroundColor: '#2563eb' }}>A</span>
                      <span>Aarav is designing the architecture...</span>
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
                  <div className="mockup-quad-footer" style={{ justifyContent: 'flex-end' }}>
                    <div className="flowchart-cta-badge">
                      <span>&lt;/&gt; Build Together</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Note (Only in 4-quadrant / UML view, matches Image 1) */}
            {(activeQuadrant === 'all' || activeQuadrant === 'uml') && (
              <div className="sticky-note">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconCheck size={12} /> Cloud Architecture</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconCheck size={12} /> UML Domain Models</div>
                <div style={{ fontSize: '13px', marginTop: '10px', opacity: 0.9, fontWeight: 700 }}>Ready for review</div>
              </div>
            )}

            {/* Bottom Right Zoom Control */}
            <div className={`mockup-zoom-bar ${activeQuadrant === 'arch' ? 'mockup-zoom-bar--with-inspector' : ''}`}>
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
        <div className="landing-stat-card">
          <div className="landing-stat-icon-wrap">
            <IconZap size={18} />
          </div>
          <div className="landing-stat-meta">
            <div className="landing-stat-val">&lt;15ms</div>
            <div className="landing-stat-label">WebSocket Sync Latency</div>
          </div>
        </div>

        <div className="landing-stat-card">
          <div className="landing-stat-icon-wrap">
            <IconShield size={18} />
          </div>
          <div className="landing-stat-meta">
            <div className="landing-stat-val">100%</div>
            <div className="landing-stat-label">Vector PDF &amp; SVG Fidelity</div>
          </div>
        </div>

        <div className="landing-stat-card">
          <div className="landing-stat-icon-wrap">
            <IconMicrophone size={18} />
          </div>
          <div className="landing-stat-meta">
            <div className="landing-stat-val">WebRTC</div>
            <div className="landing-stat-label">Integrated Stereo Voice Huddle</div>
          </div>
        </div>

        <div className="landing-stat-card">
          <div className="landing-stat-icon-wrap">
            <IconInfinity size={18} />
          </div>
          <div className="landing-stat-meta">
            <div className="landing-stat-val">Infinite</div>
            <div className="landing-stat-label">Spatial Multi-user Canvas</div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          INTERACTIVE ENGINEERING DIAGRAMS SECTION
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
              className={`deepdive-tab ${diagramTab === 'arch' ? 'deepdive-tab--active' : ''}`}
              onClick={() => setDiagramTab('arch')}
            >
              <IconCloud size={15} style={{ marginRight: 6 }} /> Cloud Architecture
            </button>
            <button
              className={`deepdive-tab ${diagramTab === 'uml' ? 'deepdive-tab--active' : ''}`}
              onClick={() => setDiagramTab('uml')}
            >
              <IconPackage size={15} style={{ marginRight: 6 }} /> UML Domain Model
            </button>
            <button
              className={`deepdive-tab ${diagramTab === 'erd' ? 'deepdive-tab--active' : ''}`}
              onClick={() => setDiagramTab('erd')}
            >
              <IconDatabase size={15} style={{ marginRight: 6 }} /> Database ERD
            </button>
            <button
              className={`deepdive-tab ${diagramTab === 'flow' ? 'deepdive-tab--active' : ''}`}
              onClick={() => setDiagramTab('flow')}
            >
              <IconZap size={15} style={{ marginRight: 6 }} /> Auth Flowchart
            </button>
          </div>
        </div>

        <div className="deepdive-content-card">
          {diagramTab === 'arch' && (
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

          {diagramTab === 'uml' && (
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

          {diagramTab === 'erd' && (
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

          {diagramTab === 'flow' && (
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
          <div className="feature-pill-icon feature-pill-icon--blue"><IconPen size={20} /></div>
          <div>
            <div className="feature-pill-title">Drawing Canvas</div>
            <div className="feature-pill-desc">Freehand pen, shapes, sticky notes &amp; text</div>
          </div>
        </Link>

        <Link to="/board?template=system-architecture" className="feature-pill-card">
          <div className="feature-pill-icon feature-pill-icon--green"><IconDiagram size={20} /></div>
          <div>
            <div className="feature-pill-title">Diagramming</div>
            <div className="feature-pill-desc">UML, ERD, flowcharts &amp; architecture</div>
          </div>
        </Link>

        <Link to="/board" className="feature-pill-card">
          <div className="feature-pill-icon feature-pill-icon--pink"><IconUsers size={20} /></div>
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
          <div className="feature-pill-icon feature-pill-icon--cyan"><IconMicrophone size={20} /></div>
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
          <div className="feature-pill-icon feature-pill-icon--orange"><IconGamepad size={20} /></div>
          <div>
            <div className="feature-pill-title">Play Mode (Live)</div>
            <div className="feature-pill-desc">Draw &amp; guess multiplayer game with bots</div>
          </div>
        </div>

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
        </div>
      </footer>
    </div>
  )
}
