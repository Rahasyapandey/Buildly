import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle/ThemeToggle'
import {
  IconHome,
  IconFolder,
  IconGamepad,
  IconWaveform,
  IconTeam,
  IconTemplates,
  IconMetricBoard,
  IconMetricPeople,
  IconMetricLightbulb,
  IconMetricBolt,
  IconCloudArch,
  IconUML,
  IconERD,
  IconFlowchart,
  IconWorkspaceBoard,
  IconVideoCall,
  IconSparkle,
  CatSketchSvg,
  HeroIllustrationSvg,
} from '../components/OverviewIcons'
import './Overview.css'

const TODAY_STR = new Date()
  .toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  .toUpperCase()

export default function Overview() {
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const wsMenuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [showPromo, setShowPromo] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'architecture' | 'uml' | 'database' | 'workflow'>('all')

  const todayStr = TODAY_STR

  // Interactive Workspace Switcher
  const [showWsMenu, setShowWsMenu] = useState(false)
  const [activeWorkspace, setActiveWorkspace] = useState('Northstar Studio')
  const workspaces = [
    { id: 'ws1', name: 'Northstar Studio', members: '8 members', role: 'Admin' },
    { id: 'ws2', name: 'Acme Cloud Architecture', members: '4 members', role: 'Editor' },
    { id: 'ws3', name: 'Personal Sandbox', members: '1 member', role: 'Owner' },
  ]

  // Interactive Notifications
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Priya Menon joined System Architecture', time: '12m ago', unread: true, icon: '📐' },
    { id: '2', title: 'Kavya invited you to Play Mode room BUILD-4892', time: '40m ago', unread: true, icon: '🎮' },
    { id: '3', title: 'Buildly 2.0 active: Vector PDF export & WebRTC', time: '2h ago', unread: false, icon: '⚡' },
  ])

  // Voice & Video interactive widget state
  const [isVoiceConnected, setIsVoiceConnected] = useState(true)
  const [isMicMuted, setIsMicMuted] = useState(false)
  const [isCamOn, setIsCamOn] = useState(false)
  const [copiedInvite, setCopiedInvite] = useState(false)

  // Interactive Play Doodle Preview State
  const [doodleColor, setDoodleColor] = useState('#2563eb')
  const [doodleHearts, setDoodleHearts] = useState<Array<{ id: number; x: number; y: number }>>([])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wsMenuRef.current && !wsMenuRef.current.contains(e.target as Node)) {
        setShowWsMenu(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard shortcut: ⌘K or Ctrl+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleOpenBoard = (title: string) => {
    navigate(`/board?title=${encodeURIComponent(title)}`)
  }

  const handleOpenTemplate = (templateId: string, title: string) => {
    navigate(`/board?template=${templateId}&title=${encodeURIComponent(title)}`)
  }

  const handleCopyInvite = () => {
    navigator.clipboard?.writeText(window.location.origin)
    setCopiedInvite(true)
    setTimeout(() => setCopiedInvite(false), 2000)
  }

  // Templates definition matching design
  const templates = [
    {
      id: 'system-architecture',
      title: 'System Architecture',
      desc: 'Plan your cloud microservices & caching tier',
      color: 'blue',
      category: 'architecture' as const,
      icon: <IconCloudArch />,
      tag: 'FastAPI + Postgres + Redis',
    },
    {
      id: 'uml-class',
      title: 'UML Class Diagram',
      desc: 'Design object-oriented class hierarchies',
      color: 'purple',
      category: 'uml' as const,
      icon: <IconUML />,
      tag: 'Clean Architecture',
    },
    {
      id: 'erd',
      title: 'Relational ERD',
      desc: 'Model multi-tenant database tables & foreign keys',
      color: 'green',
      category: 'database' as const,
      icon: <IconERD />,
      tag: 'PostgreSQL 16 Schema',
    },
    {
      id: 'flowchart',
      title: 'Auth & Sync Flowchart',
      desc: 'Visualize logic flows, auth gates & WebSockets',
      color: 'amber',
      category: 'workflow' as const,
      icon: <IconFlowchart />,
      tag: 'Real-time Pipeline',
    },
  ]

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory
    return matchesSearch && matchesCat
  })

  const unreadNotifCount = notifications.filter((n) => n.unread).length

  return (
    <div className="ov-layout">
      {/* ─────────────────────────────────────────────────────────────
          1. LEFT SIDEBAR
          ───────────────────────────────────────────────────────────── */}
      <aside className="ov-sidebar">
        {/* Brand Header */}
        <Link to="/" className="ov-brand" title="Buildly Homepage">
          <div className="ov-brand__left">
            <img src="/logo.png" alt="Buildly" className="ov-brand__logo" />
            <span className="ov-brand__name">
              Buildly<span className="ov-brand__dot">.</span>
            </span>
          </div>
        </Link>

        {/* Workspace Dropdown Pill */}
        <div className="ov-ws-wrap" ref={wsMenuRef}>
          <div
            className="ov-ws-pill"
            onClick={() => setShowWsMenu((prev) => !prev)}
            title="Switch Workspace"
          >
            <div className="ov-ws-pill__left">
              <div className="ov-ws-avatar">{activeWorkspace.charAt(0)}</div>
              <span className="ov-ws-name">{activeWorkspace}</span>
            </div>
            <div className="ov-ws-pill__right">
              <span className="ov-ws-chevron">⌄</span>
              <span className="ov-ws-gear">⚙</span>
            </div>
          </div>

          {showWsMenu && (
            <div className="ov-ws-dropdown" role="menu">
              <div className="ov-ws-dropdown-title">Your Workspaces</div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  className={`ov-ws-item ${ws.name === activeWorkspace ? 'ov-ws-item--active' : ''}`}
                  onClick={() => {
                    setActiveWorkspace(ws.name)
                    setShowWsMenu(false)
                  }}
                >
                  <div className="ov-ws-avatar" style={{ width: 26, height: 26, fontSize: 12 }}>
                    {ws.name.charAt(0)}
                  </div>
                  <div className="ov-ws-item-info">
                    <span className="ov-ws-item-name">{ws.name}</span>
                    <span className="ov-ws-item-sub">{ws.members} • {ws.role}</span>
                  </div>
                  {ws.name === activeWorkspace && <span className="ov-ws-check">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Group: MAIN */}
        <div className="ov-nav-group">
          <div className="ov-nav-label">MAIN</div>
          <nav className="ov-nav-menu">
            <button className="ov-nav-item ov-nav-item--active">
              <span className="ov-nav-icon"><IconHome /></span>
              <span>Home</span>
            </button>

            <button
              className="ov-nav-item"
              onClick={() => handleOpenBoard('My Projects')}
            >
              <span className="ov-nav-icon"><IconFolder /></span>
              <span>Projects</span>
            </button>

            <button
              className="ov-nav-item"
              onClick={() => navigate('/play')}
              title="Multiplayer Drawing & Guessing with Voice Chat"
            >
              <span className="ov-nav-icon"><IconGamepad /></span>
              <span>Play Mode</span>
              <span className="ov-badge-pill ov-badge-pill--new">LIVE</span>
            </button>

            <button
              className="ov-nav-item"
              onClick={() => handleOpenBoard('Voice Huddle Room')}
              title="Voice-only Audio Huddle"
            >
              <span className="ov-nav-icon"><IconWaveform /></span>
              <span>Connect</span>
              <span className="ov-badge-pill ov-badge-pill--voice">VOICE</span>
            </button>

            <Link
              to="/showcase"
              className="ov-nav-item ov-nav-item--glow"
              title="Interactive Generative UI Architecture Suite"
            >
              <span className="ov-nav-icon"><IconSparkle /></span>
              <span>Generative UI</span>
              <span className="ov-badge-pill ov-badge-pill--sparkle">PRO</span>
            </Link>

            <button className="ov-nav-item" onClick={handleCopyInvite}>
              <span className="ov-nav-icon"><IconTeam /></span>
              <span>Team</span>
            </button>

            <button
              className="ov-nav-item"
              onClick={() => {
                const el = document.getElementById('ov-templates-section')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span className="ov-nav-icon"><IconTemplates /></span>
              <span>Templates</span>
            </button>
          </nav>
        </div>

        {/* Navigation Group: WORKSPACE */}
        <div className="ov-nav-group">
          <div className="ov-nav-label">WORKSPACE</div>
          <div className="ov-ws-card" onClick={() => handleOpenBoard('Workspace Studio')}>
            <div className="ov-ws-card__top">
              <div className="ov-ws-avatar">{activeWorkspace.charAt(0)}</div>
              <div className="ov-ws-card__info">
                <span className="ov-ws-card__title">{activeWorkspace}</span>
                <span className="ov-ws-card__sub">8 members active</span>
              </div>
            </div>
            <div className="ov-ws-card__actions">
              <span className="ov-ws-chevron">⌄</span>
              <span className="ov-ws-gear">⚙</span>
            </div>
          </div>
        </div>

        {/* Promo Card: Build Better Together */}
        {showPromo && (
          <div className="ov-promo-card">
            <button
              className="ov-promo-close"
              onClick={() => setShowPromo(false)}
              title="Dismiss"
            >
              ✕
            </button>
            <h4 className="ov-promo-title">Build Better Together</h4>
            <p className="ov-promo-sub">Collaborate · Create · Grow</p>
            <button
              className="ov-promo-btn"
              onClick={() => navigate('/play')}
            >
              Explore Play Mode →
            </button>
          </div>
        )}

        {/* User Profile Bar at bottom */}
        <div className="ov-user-bar">
          <div className="ov-user-bar__left">
            <div className="ov-user-avatar">AM</div>
            <div className="ov-user-meta">
              <span className="ov-user-name">Alex Morgan</span>
              <span className="ov-user-role">Workspace admin</span>
            </div>
          </div>
          <span className="ov-user-chevron">⌄</span>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          2. CENTER MAIN DASHBOARD
          ───────────────────────────────────────────────────────────── */}
      <main className="ov-main-content">
        {/* Top Navbar */}
        <header className="ov-topbar">
          {/* Rounded Search Bar */}
          <div className="ov-search-box">
            <span className="ov-search-icon">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              className="ov-search-input"
              placeholder="Search architecture, UML, ERD, or projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="ov-search-kbd">⌘ K</span>
          </div>

          {/* Top Actions: Avatar Stack, Notifications, Theme, Generative UI, Profile */}
          <div className="ov-topbar__right">
            {/* Generative UI Top Button */}
            <Link
              to="/showcase"
              className="ov-topbar-showcase-btn"
              title="Launch Standalone Generative UI Suite"
            >
              <span className="ov-sparkle-dot" />
              <span>Generative UI</span>
            </Link>

            {/* Team stack */}
            <div className="ov-avatar-stack" title="Active Teammates">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces"
                alt="Priya"
                className="ov-stack-img"
              />
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces"
                alt="Kavya"
                className="ov-stack-img"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces"
                alt="Arjun"
                className="ov-stack-img"
              />
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=faces"
                alt="Sneha"
                className="ov-stack-img"
              />
              <div className="ov-stack-count">+4</div>
            </div>

            {/* Notifications Popover Trigger */}
            <div className="ov-notif-wrap" ref={notifRef}>
              <button
                className="ov-icon-btn"
                title="Notifications"
                onClick={() => setShowNotifications((prev) => !prev)}
              >
                <span>🔔</span>
                {unreadNotifCount > 0 && <span className="ov-notif-badge">{unreadNotifCount}</span>}
              </button>

              {showNotifications && (
                <div className="ov-notif-dropdown" role="menu">
                  <div className="ov-notif-header">
                    <span className="ov-notif-header-title">Notifications</span>
                    <button
                      className="ov-notif-mark-btn"
                      onClick={() =>
                        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
                      }
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="ov-notif-list">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`ov-notif-item ${n.unread ? 'ov-notif-item--unread' : ''}`}
                      >
                        <span className="ov-notif-item-icon">{n.icon}</span>
                        <div className="ov-notif-item-body">
                          <div className="ov-notif-item-title">{n.title}</div>
                          <div className="ov-notif-item-time">{n.time}</div>
                        </div>
                        {n.unread && <span className="ov-notif-dot" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle in Topbar */}
            <ThemeToggle variant="icon" />

            <div className="ov-top-profile" title="Alex Morgan (Workspace Admin)">
              AM
            </div>
          </div>
        </header>

        {/* Scrollable Main Body */}
        <div className="ov-body-scroll">
          {/* Hero Greeting Section with Ambient Glow & Better Together Gfx */}
          <section className="ov-hero-section">
            <div className="ov-hero-text">
              <div className="ov-date-tag">{todayStr} • BUILDLY 2.0</div>
              <h1 className="ov-greeting">
                Good morning, <span className="ov-name-gradient">Alex.</span>
              </h1>
              <p className="ov-hero-subtitle">
                Whiteboard architecture, UML models, database schemas and real-time games — together.
              </p>
              <div className="ov-hero-quick-actions">
                <button
                  className="ov-hero-btn-primary"
                  onClick={() => handleOpenBoard('Architecture Map')}
                >
                  <span>✏️</span> Open Whiteboard
                </button>
                <button
                  className="ov-hero-btn-secondary"
                  onClick={() => navigate('/play')}
                >
                  <span>🎮</span> Play Mode Room
                </button>
                <Link
                  to="/showcase"
                  className="ov-hero-btn-showcase"
                >
                  <span>✨</span> Generative UI Suite
                </Link>
              </div>
            </div>

            {/* Whiteboard 3D Canvas Illustration */}
            <HeroIllustrationSvg />
          </section>

          {/* 4 Metric / KPI Cards with Animated Sparkline SVG Curves */}
          <section className="ov-metrics-grid">
            {/* Metric 1 */}
            <div
              className="ov-metric-card"
              onClick={() => handleOpenBoard('Active Boards')}
            >
              <div className="ov-metric-card__header">
                <div className="ov-metric-icon ov-metric-icon--blue">
                  <IconMetricBoard />
                </div>
                <button className="ov-metric-arrow" title="View details">→</button>
              </div>
              <div className="ov-metric-title">Boards in motion</div>
              <div className="ov-metric-val">12</div>
              <div className="ov-metric-footer-row">
                <div className="ov-metric-trend">
                  <span>↑</span> +4 this week
                </div>
                {/* SVG Sparkline */}
                <svg className="ov-sparkline" viewBox="0 0 70 20" fill="none">
                  <path d="M 0 15 Q 18 18 35 8 T 70 4" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Metric 2 */}
            <div
              className="ov-metric-card"
              onClick={() => handleOpenBoard('Team Collaboration')}
            >
              <div className="ov-metric-card__header">
                <div className="ov-metric-icon ov-metric-icon--purple">
                  <IconMetricPeople />
                </div>
                <button className="ov-metric-arrow" title="View details">→</button>
              </div>
              <div className="ov-metric-title">People creating</div>
              <div className="ov-metric-val">08</div>
              <div className="ov-metric-footer-row">
                <div className="ov-metric-trend">
                  <span>↑</span> +5 active right now
                </div>
                <svg className="ov-sparkline" viewBox="0 0 70 20" fill="none">
                  <path d="M 0 14 Q 20 5 40 12 T 70 3" stroke="#8b5cf6" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Metric 3 */}
            <div
              className="ov-metric-card"
              onClick={() => handleOpenTemplate('system-architecture', 'Cloud Architecture')}
            >
              <div className="ov-metric-card__header">
                <div className="ov-metric-icon ov-metric-icon--cyan">
                  <IconMetricLightbulb />
                </div>
                <button className="ov-metric-arrow" title="View details">→</button>
              </div>
              <div className="ov-metric-title">Ideas connected</div>
              <div className="ov-metric-val">124</div>
              <div className="ov-metric-footer-row">
                <div className="ov-metric-trend">
                  <span>↑</span> +28% this month
                </div>
                <svg className="ov-sparkline" viewBox="0 0 70 20" fill="none">
                  <path d="M 0 16 Q 25 15 45 6 T 70 2" stroke="#06b6d4" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Metric 4 */}
            <div
              className="ov-metric-card"
              onClick={() => handleOpenBoard('Real-time Metrics')}
            >
              <div className="ov-metric-card__header">
                <div className="ov-metric-icon ov-metric-icon--violet">
                  <IconMetricBolt />
                </div>
                <button className="ov-metric-arrow" title="View details">→</button>
              </div>
              <div className="ov-metric-title">Canvas interactions</div>
              <div className="ov-metric-val">3.8k</div>
              <div className="ov-metric-footer-row">
                <div className="ov-metric-trend">
                  <span>↑</span> +42% latency &lt;15ms
                </div>
                <svg className="ov-sparkline" viewBox="0 0 70 20" fill="none">
                  <path d="M 0 18 Q 20 12 40 8 T 70 2" stroke="#ec4899" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </section>

          {/* Explore Templates Section */}
          <section id="ov-templates-section" className="ov-templates-section">
            <div className="ov-section-header">
              <div>
                <span className="ov-section-tag">ENGINEERING TEMPLATES</span>
                <h2 className="ov-section-title">Explore Architecture &amp; Diagrams</h2>
                <p className="ov-section-desc">
                  One-click load pre-crafted software architecture, UML class models, ERD schemas, and flowcharts.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="ov-category-pills">
                {(['all', 'architecture', 'uml', 'database', 'workflow'] as const).map((cat) => (
                  <button
                    key={cat}
                    className={`ov-cat-pill ${selectedCategory === cat ? 'ov-cat-pill--active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === 'all' ? 'All (4)' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="ov-templates-grid">
              {filteredTemplates.map((item) => (
                <div
                  key={item.id}
                  className="ov-template-card"
                  onClick={() => handleOpenTemplate(item.id, item.title)}
                  title={`Click to open ${item.title} on Whiteboard`}
                >
                  <div className={`ov-template-icon ov-template-icon--${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="ov-template-info">
                    <div className="ov-template-tag-row">
                      <h3 className="ov-template-title">{item.title}</h3>
                      <span className="ov-template-pill-badge">{item.tag}</span>
                    </div>
                    <p className="ov-template-desc">{item.desc}</p>
                  </div>
                  <span className="ov-template-arrow" title="Launch Board">Launch →</span>
                </div>
              ))}
            </div>
          </section>

          {/* Dual Section: Play Mode & Team Activity */}
          <section className="ov-dual-grid">
            {/* Left Big Card: Play Mode Showcase */}
            <div className="ov-play-showcase-card">
              <div className="ov-play-card-header">
                <div className="ov-play-badge">
                  <span className="ov-play-badge-icon">🎮</span>
                  <span>PLAY MODE (LIVE PARTY)</span>
                </div>
                <h3 className="ov-play-card-title">Draw, Guess, Build Camaraderie!</h3>
                <p className="ov-play-card-desc">
                  Team up, sketch architectural metaphors or fun challenges, and test your team's wits with low-latency WebRTC voice.
                </p>
                <div className="ov-play-card-actions">
                  <button
                    className="ov-btn-primary"
                    onClick={() => navigate('/play')}
                  >
                    Start Game Room →
                  </button>
                  <button
                    className="ov-btn-ghost"
                    onClick={() => navigate('/play?tab=leaderboard')}
                  >
                    Leaderboard &amp; XP
                  </button>
                </div>
              </div>

              {/* Embedded Live Preview of Drawing Canvas with interactive scratch interaction */}
              <div
                className="ov-play-preview-mockup"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = e.clientX - rect.left
                  const y = e.clientY - rect.top
                  setDoodleHearts((prev) => [...prev.slice(-6), { id: Date.now(), x, y }])
                }}
                title="Click anywhere to stamp mini reactions!"
              >
                <div className="ov-mock-canvas">
                  {/* Left color palette dots */}
                  <div className="ov-mock-palette" onClick={(e) => e.stopPropagation()}>
                    {['#2563eb', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#0f172a'].map((c) => (
                      <span
                        key={c}
                        style={{
                          backgroundColor: c,
                          outline: doodleColor === c ? '2px solid white' : 'none',
                          transform: doodleColor === c ? 'scale(1.2)' : 'none',
                          cursor: 'pointer',
                        }}
                        onClick={() => setDoodleColor(c)}
                      />
                    ))}
                  </div>

                  {/* Center cat doodle */}
                  <div className="ov-mock-drawing" style={{ position: 'relative' }}>
                    <CatSketchSvg />
                    {doodleHearts.map((h) => (
                      <span
                        key={h.id}
                        className="ov-doodle-spark"
                        style={{
                          position: 'absolute',
                          left: h.x - 30,
                          top: h.y - 20,
                          color: doodleColor,
                          fontSize: '18px',
                          pointerEvents: 'none',
                        }}
                      >
                        ✨
                      </span>
                    ))}
                  </div>

                  {/* Right chat bubbles */}
                  <div className="ov-mock-chat">
                    <div className="ov-mock-bubble">
                      <span className="ov-bubble-dot" style={{ backgroundColor: '#3b82f6' }} />
                      <span className="ov-mock-author">Alex</span> You're drawing...
                    </div>
                    <div className="ov-mock-bubble">
                      <span className="ov-bubble-dot" style={{ backgroundColor: '#ec4899' }} />
                      <span className="ov-mock-author">Priya</span> Nice sketch! 👍
                    </div>
                    <div className="ov-mock-bubble ov-mock-bubble--highlight">
                      <span className="ov-bubble-dot" style={{ backgroundColor: '#10b981' }} />
                      <span className="ov-mock-author">Kavya</span> Cat mascot? 🎯
                    </div>
                    <div className="ov-mock-bubble">
                      <span className="ov-bubble-dot" style={{ backgroundColor: '#f59e0b' }} />
                      <span className="ov-mock-author">Arjun</span> Super clean!
                    </div>
                  </div>

                  {/* Bottom mock voice controls */}
                  <div className="ov-mock-voice-pill">
                    <span>🎙️ Active</span>
                    <span style={{ fontSize: '12px', color: '#10b981' }}>● 12ms</span>
                    <span>💬</span>
                  </div>
                </div>
              </div>

              {/* Bottom 4 Feature Tags */}
              <div className="ov-play-features-list">
                <span className="ov-play-feature-item">🎮 Real-time Canvas</span>
                <span className="ov-play-feature-item">🎙️ WebRTC Voice</span>
                <span className="ov-play-feature-item">🔒 Code Rooms</span>
                <span className="ov-play-feature-item">🏆 Global Leaderboard</span>
              </div>
            </div>

            {/* Right Card: Team Activity Feed */}
            <div className="ov-activity-card">
              <div className="ov-activity-header">
                <div className="ov-activity-title-row">
                  <span className="ov-activity-icon">📊</span>
                  <h3 className="ov-activity-title">Live Workspace Activity</h3>
                </div>
                <button
                  className="ov-activity-view-all"
                  onClick={() => handleOpenBoard('Workspace Activity Stream')}
                >
                  View all →
                </button>
              </div>

              <div className="ov-activity-list">
                <div className="ov-activity-item">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces"
                    alt="Priya"
                    className="ov-activity-photo"
                  />
                  <div className="ov-activity-info">
                    <div className="ov-activity-text">
                      <strong>Priya Menon</strong> updated System Architecture
                    </div>
                    <div className="ov-activity-sub">FastAPI Microservices · 12m ago</div>
                  </div>
                </div>

                <div className="ov-activity-item">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces"
                    alt="Kavya"
                    className="ov-activity-photo"
                  />
                  <div className="ov-activity-info">
                    <div className="ov-activity-text">
                      <strong>Kavya Roy</strong> created Play room BUILD-4892
                    </div>
                    <div className="ov-activity-sub">Multiplayer Party · 45m ago</div>
                  </div>
                </div>

                <div className="ov-activity-item">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces"
                    alt="Arjun"
                    className="ov-activity-photo"
                  />
                  <div className="ov-activity-info">
                    <div className="ov-activity-text">
                      <strong>Arjun Singh</strong> exported ERD Database schema
                    </div>
                    <div className="ov-activity-sub">Multi-page Vector PDF · 2h ago</div>
                  </div>
                </div>

                <div className="ov-activity-item">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=faces"
                    alt="Sneha"
                    className="ov-activity-photo"
                  />
                  <div className="ov-activity-info">
                    <div className="ov-activity-text">
                      <strong>Sneha Iyer</strong> added sticky note to UML Model
                    </div>
                    <div className="ov-activity-sub">Domain Entities · 4h ago</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Bar */}
          <footer className="ov-footer">
            <div className="ov-footer__left">
              <img src="/logo.png" alt="Buildly" className="ov-footer__logo" />
              <span className="ov-footer__brand">
                Buildly<span className="ov-footer__dot">.</span>
              </span>
              <span className="ov-footer__tagline">
                Think together. Build together.
              </span>
            </div>

            <div className="ov-footer__right">
              <span className="ov-footer__links">
                Plan &nbsp;·&nbsp; Design &nbsp;·&nbsp; Build &nbsp;·&nbsp; Grow &nbsp;·&nbsp; Enjoy
              </span>
              <span className="ov-footer__orb" />
            </div>
          </footer>
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          3. RIGHT SIDEBAR / WIDGET COLUMN
          ───────────────────────────────────────────────────────────── */}
      <aside className="ov-right-panel">
        {/* Widget 1: Your Workspace */}
        <div
          className="ov-widget-card"
          onClick={handleCopyInvite}
          style={{ cursor: 'pointer' }}
          title="Click to copy workspace invite link"
        >
          <div className="ov-widget-header">
            <div className="ov-widget-icon ov-widget-icon--blue">
              <IconWorkspaceBoard />
            </div>
            <div className="ov-widget-title-col">
              <div className="ov-widget-title-row">
                <span className="ov-widget-title">Your Workspace</span>
                <span className="ov-widget-chevron">›</span>
              </div>
              <span className="ov-widget-sub">{activeWorkspace}</span>
              <span className="ov-widget-detail">8 active collaborators</span>
            </div>
          </div>

          <div className="ov-ws-avatars-row">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces"
              alt="Priya"
              className="ov-ws-avatar-dot"
            />
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces"
              alt="Kavya"
              className="ov-ws-avatar-dot"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces"
              alt="Arjun"
              className="ov-ws-avatar-dot"
            />
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=faces"
              alt="Sneha"
              className="ov-ws-avatar-dot"
            />
            <div className="ov-ws-avatar-dot ov-ws-avatar-dot--me">AM</div>
            <span className="ov-ws-avatar-more">+4</span>
          </div>
        </div>

        {/* Widget 2: Voice & Video */}
        <div className="ov-widget-card">
          <div className="ov-widget-header">
            <div className="ov-widget-icon ov-widget-icon--cyan">
              <IconVideoCall />
            </div>
            <div className="ov-widget-title-col">
              <div className="ov-widget-title-row">
                <span className="ov-widget-title">Voice &amp; Video</span>
                <span className="ov-status-dot ov-status-dot--connected">
                  ● Connected (14ms)
                </span>
              </div>
              <p className="ov-widget-desc">Low-latency WebRTC huddle with crystal audio.</p>
            </div>
          </div>

          {/* Bouncing Audio Waveform Bars */}
          <div className="ov-voice-active-bar">
            <div className="ov-voice-wave-bars">
              <span className={`ov-vbar ${!isMicMuted ? 'ov-vbar--active' : ''}`} />
              <span className={`ov-vbar ${!isMicMuted ? 'ov-vbar--active' : ''}`} />
              <span className={`ov-vbar ${!isMicMuted ? 'ov-vbar--active' : ''}`} />
              <span className={`ov-vbar ${!isMicMuted ? 'ov-vbar--active' : ''}`} />
              <span className={`ov-vbar ${!isMicMuted ? 'ov-vbar--active' : ''}`} />
            </div>
            <span className="ov-voice-status-text">
              {isMicMuted ? 'Microphone muted' : 'Audio stream active'}
            </span>
          </div>

          <div className="ov-call-controls-row">
            <button
              className={`ov-call-btn ${isMicMuted ? 'ov-call-btn--off' : ''}`}
              onClick={() => setIsMicMuted((prev) => !prev)}
              title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isMicMuted ? '🔇' : '🎙️'}
            </button>

            <button
              className={`ov-call-btn ${isCamOn ? 'ov-call-btn--active' : ''}`}
              onClick={() => setIsCamOn((prev) => !prev)}
              title={isCamOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              📹
            </button>

            <button
              className="ov-call-btn"
              onClick={() => navigate('/play')}
              title="Open Chat"
            >
              💬
            </button>

            <button
              className="ov-call-btn ov-call-btn--ghost"
              title="More Options"
              onClick={() => alert('Opus 48kHz Stereo • Echo Cancellation Enabled • Sub-15ms')}
            >
              ⋯
            </button>

            <button
              className="ov-call-leave-btn"
              onClick={() => setIsVoiceConnected((prev) => !prev)}
            >
              {isVoiceConnected ? 'Leave' : 'Join'}
            </button>
          </div>
        </div>

        {/* Widget 3: Quick Actions (2x2 Grid) */}
        <div className="ov-widget-card">
          <div className="ov-widget-header">
            <div className="ov-widget-icon ov-widget-icon--indigo">
              <IconSparkle />
            </div>
            <span className="ov-widget-title">Quick Actions</span>
          </div>

          <div className="ov-quick-actions-grid">
            {/* Action 1 */}
            <button
              className="ov-quick-action-btn"
              onClick={handleCopyInvite}
            >
              <span className="ov-qa-icon">👥</span>
              <span className="ov-qa-title">
                {copiedInvite ? '✓ Link Copied' : 'Invite Teammates'}
              </span>
              <span className="ov-qa-sub">Build together</span>
            </button>

            {/* Action 2 */}
            <button
              className="ov-quick-action-btn"
              onClick={() => navigate('/play')}
            >
              <span className="ov-qa-icon">🎮</span>
              <span className="ov-qa-title">Create Room</span>
              <span className="ov-qa-sub">Play with friends</span>
            </button>

            {/* Action 3 */}
            <Link
              to="/showcase"
              className="ov-quick-action-btn"
              style={{ textDecoration: 'none' }}
            >
              <span className="ov-qa-icon">✨</span>
              <span className="ov-qa-title">Generative UI</span>
              <span className="ov-qa-sub">Live suite demo</span>
            </Link>

            {/* Action 4 */}
            <button
              className="ov-quick-action-btn"
              onClick={() => handleOpenBoard('Screen Share Session')}
            >
              <span className="ov-qa-icon">🖥️</span>
              <span className="ov-qa-title">Screen Share</span>
              <span className="ov-qa-sub">Share your screen</span>
            </button>
          </div>
        </div>

        {/* Widget 4: Generative UI Showcase Card */}
        <div
          className="ov-showcase-card"
          onClick={() => navigate('/showcase')}
          title="Open Standalone Generative UI Suite"
        >
          <div className="ov-showcase-header">
            <span className="ov-showcase-badge">GENERATIVE UI SUITE</span>
            <span className="ov-sparkle-dot" />
          </div>
          <h4 className="ov-showcase-title">Architecture Studio &amp; Labs</h4>
          <p className="ov-showcase-desc">
            Explore interactive cloud topologies, multiplayer game previews, and WebRTC audio synthesis.
          </p>
          <div className="ov-showcase-footer">
            <span>Launch Suite</span>
            <span>→</span>
          </div>
        </div>

        {/* Widget 5: Inspirational Gradient Card with Glowing 3D Glass Spheres */}
        <div className="ov-inspire-card">
          <div className="ov-inspire-spheres">
            <div className="ov-3d-glass-sphere ov-3d-glass-sphere--1" />
            <div className="ov-3d-glass-sphere ov-3d-glass-sphere--2" />
          </div>
          <div className="ov-inspire-content">
            <h4 className="ov-inspire-title">Great things happen here.</h4>
            <p className="ov-inspire-sub">Build. Play. Connect. Grow. ⤴</p>
          </div>
        </div>
      </aside>
    </div>
  )
}
