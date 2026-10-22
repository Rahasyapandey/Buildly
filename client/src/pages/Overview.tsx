import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

export default function Overview() {
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [showPromo, setShowPromo] = useState(true)

  // Voice & Video interactive widget state
  const [isVoiceConnected, setIsVoiceConnected] = useState(true)
  const [isMicMuted, setIsMicMuted] = useState(false)
  const [isCamOn, setIsCamOn] = useState(false)
  const [copiedInvite, setCopiedInvite] = useState(false)

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
      desc: 'Plan your cloud architecture',
      color: 'blue',
      icon: <IconCloudArch />,
    },
    {
      id: 'uml-class',
      title: 'UML Class Diagram',
      desc: 'Design class structures',
      color: 'purple',
      icon: <IconUML />,
    },
    {
      id: 'erd',
      title: 'ERD',
      desc: 'Model your database',
      color: 'green',
      icon: <IconERD />,
    },
    {
      id: 'flowchart',
      title: 'Flowchart',
      desc: 'Visualize logic flows',
      color: 'amber',
      icon: <IconFlowchart />,
    },
  ]

  const filteredTemplates = templates.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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

        {/* Workspace Dropdown */}
        <div className="ov-ws-pill">
          <div className="ov-ws-pill__left">
            <div className="ov-ws-avatar">N</div>
            <span className="ov-ws-name">Northstar Studio</span>
          </div>
          <div className="ov-ws-pill__right">
            <span className="ov-ws-chevron">⌄</span>
            <span className="ov-ws-gear">⚙</span>
          </div>
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
              <span className="ov-badge-pill ov-badge-pill--new">NEW</span>
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
          <div className="ov-ws-card">
            <div className="ov-ws-card__top">
              <div className="ov-ws-avatar">N</div>
              <div className="ov-ws-card__info">
                <span className="ov-ws-card__title">Northstar Studio</span>
                <span className="ov-ws-card__sub">8 members</span>
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
              placeholder="Search boards, projects, or anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="ov-search-kbd">⌘ K</span>
          </div>

          {/* Top Actions: Avatar Stack, Notifications, Help, Profile */}
          <div className="ov-topbar__right">
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
              <div className="ov-stack-count">+2</div>
            </div>

            <button className="ov-icon-btn" title="Notifications">
              <span>🔔</span>
            </button>

            <button className="ov-icon-btn" title="Help & Documentation">
              <span>❔</span>
            </button>

            <div className="ov-top-profile" title="Alex Morgan (You)">
              AM
            </div>
          </div>
        </header>

        {/* Scrollable Main Body */}
        <div className="ov-body-scroll">
          {/* Hero Greeting Section with Ambient Glow & Better Together Gfx */}
          <section className="ov-hero-section">
            <div className="ov-hero-text">
              <div className="ov-date-tag">TUESDAY, 21 OCTOBER</div>
              <h1 className="ov-greeting">
                Good morning, <span className="ov-name-gradient">Alex.</span>
              </h1>
              <p className="ov-hero-subtitle">
                Ideas, designs, code and fun — all in one place.
              </p>
              <div className="ov-hero-star-prompt">
                <span>Let's build something amazing today.</span>
                <span className="ov-hero-star">⭐</span>
              </div>
            </div>

            {/* Whiteboard 3D Canvas Illustration */}
            <HeroIllustrationSvg />
          </section>

          {/* 4 Metric / KPI Cards */}
          <section className="ov-metrics-grid">
            {/* Metric 1 */}
            <div
              className="ov-metric-card"
              onClick={() => handleOpenBoard('Boards Overview')}
            >
              <div className="ov-metric-card__header">
                <div className="ov-metric-icon ov-metric-icon--blue">
                  <IconMetricBoard />
                </div>
                <button className="ov-metric-arrow" title="View details">→</button>
              </div>
              <div className="ov-metric-title">Boards in motion</div>
              <div className="ov-metric-val">03</div>
              <div className="ov-metric-trend">
                <span>↑</span> +2 this week
              </div>
            </div>

            {/* Metric 2 */}
            <div
              className="ov-metric-card"
              onClick={() => handleOpenBoard('Team Presence')}
            >
              <div className="ov-metric-card__header">
                <div className="ov-metric-icon ov-metric-icon--purple">
                  <IconMetricPeople />
                </div>
                <button className="ov-metric-arrow" title="View details">→</button>
              </div>
              <div className="ov-metric-title">People creating</div>
              <div className="ov-metric-val">08</div>
              <div className="ov-metric-trend">
                <span>↑</span> +4 active right now
              </div>
            </div>

            {/* Metric 3 */}
            <div
              className="ov-metric-card"
              onClick={() => handleOpenBoard('Architecture Map')}
            >
              <div className="ov-metric-card__header">
                <div className="ov-metric-icon ov-metric-icon--cyan">
                  <IconMetricLightbulb />
                </div>
                <button className="ov-metric-arrow" title="View details">→</button>
              </div>
              <div className="ov-metric-title">Ideas connected</div>
              <div className="ov-metric-val">124</div>
              <div className="ov-metric-trend">
                <span>↑</span> +18% this month
              </div>
            </div>

            {/* Metric 4 */}
            <div
              className="ov-metric-card"
              onClick={() => handleOpenBoard('Analytics Dashboard')}
            >
              <div className="ov-metric-card__header">
                <div className="ov-metric-icon ov-metric-icon--violet">
                  <IconMetricBolt />
                </div>
                <button className="ov-metric-arrow" title="View details">→</button>
              </div>
              <div className="ov-metric-title">Total activity</div>
              <div className="ov-metric-val">2.4k</div>
              <div className="ov-metric-trend">
                <span>↑</span> +32% this week
              </div>
            </div>
          </section>

          {/* Explore Templates Section */}
          <section id="ov-templates-section" className="ov-templates-section">
            <div className="ov-section-header">
              <div>
                <span className="ov-section-tag">START BUILDING</span>
                <h2 className="ov-section-title">Explore Templates</h2>
                <p className="ov-section-desc">
                  Get started with ready-to-use templates for your next project.
                </p>
              </div>
              <button
                className="ov-view-all-link"
                onClick={() => handleOpenBoard('All Templates')}
              >
                View all templates →
              </button>
            </div>

            <div className="ov-templates-grid">
              {filteredTemplates.map((item) => (
                <div
                  key={item.id}
                  className="ov-template-card"
                  onClick={() => handleOpenBoard(item.title)}
                >
                  <div className={`ov-template-icon ov-template-icon--${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="ov-template-info">
                    <h3 className="ov-template-title">{item.title}</h3>
                    <p className="ov-template-desc">{item.desc}</p>
                  </div>
                  <span className="ov-template-arrow">→</span>
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
                  <span>PLAY MODE</span>
                </div>
                <h3 className="ov-play-card-title">Draw, Guess, Have Fun!</h3>
                <p className="ov-play-card-desc">
                  Team up, show your creativity and guess what your friends are drawing.
                </p>
                <div className="ov-play-card-actions">
                  <button
                    className="ov-btn-primary"
                    onClick={() => navigate('/play')}
                  >
                    Start Playing →
                  </button>
                  <button
                    className="ov-btn-ghost"
                    onClick={() => navigate('/play')}
                  >
                    Explore
                  </button>
                </div>
              </div>

              {/* Embedded Live Preview of Drawing Canvas */}
              <div className="ov-play-preview-mockup">
                <div className="ov-mock-canvas">
                  {/* Left color palette dots */}
                  <div className="ov-mock-palette">
                    <span style={{ backgroundColor: '#2563eb' }} />
                    <span style={{ backgroundColor: '#ec4899' }} />
                    <span style={{ backgroundColor: '#10b981' }} />
                    <span style={{ backgroundColor: '#f59e0b' }} />
                    <span style={{ backgroundColor: '#8b5cf6' }} />
                    <span style={{ backgroundColor: '#0f172a' }} />
                  </div>

                  {/* Center cat doodle */}
                  <div className="ov-mock-drawing">
                    <CatSketchSvg />
                  </div>

                  {/* Right chat bubbles */}
                  <div className="ov-mock-chat">
                    <div className="ov-mock-bubble">
                      <span className="ov-bubble-dot" style={{ backgroundColor: '#3b82f6' }} />
                      <span className="ov-mock-author">Alex</span> You're drawing...
                    </div>
                    <div className="ov-mock-bubble">
                      <span className="ov-bubble-dot" style={{ backgroundColor: '#ec4899' }} />
                      <span className="ov-mock-author">Priya</span> Nice! 👍
                    </div>
                    <div className="ov-mock-bubble ov-mock-bubble--highlight">
                      <span className="ov-bubble-dot" style={{ backgroundColor: '#10b981' }} />
                      <span className="ov-mock-author">Kavya</span> Cat?
                    </div>
                    <div className="ov-mock-bubble">
                      <span className="ov-bubble-dot" style={{ backgroundColor: '#f59e0b' }} />
                      <span className="ov-mock-author">Arjun</span> So good!
                    </div>
                  </div>

                  {/* Bottom mock voice controls */}
                  <div className="ov-mock-voice-pill">
                    <span>🎙️</span>
                    <span>📹</span>
                    <span>💬</span>
                  </div>
                </div>
              </div>

              {/* Bottom 4 Feature Tags */}
              <div className="ov-play-features-list">
                <span className="ov-play-feature-item">🎮 Real-time gameplay</span>
                <span className="ov-play-feature-item">🎙️ Voice chat</span>
                <span className="ov-play-feature-item">🔒 Private & public rooms</span>
                <span className="ov-play-feature-item">🏆 Fun challenges</span>
              </div>
            </div>

            {/* Right Card: Team Activity Feed */}
            <div className="ov-activity-card">
              <div className="ov-activity-header">
                <div className="ov-activity-title-row">
                  <span className="ov-activity-icon">📊</span>
                  <h3 className="ov-activity-title">Team activity</h3>
                </div>
                <button
                  className="ov-activity-view-all"
                  onClick={() => handleOpenBoard('Team Feed')}
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
                      <strong>Priya Menon</strong> created a new board
                    </div>
                    <div className="ov-activity-sub">System Design · 2h ago</div>
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
                      <strong>Kavya Roy</strong> joined the Play Mode room
                    </div>
                    <div className="ov-activity-sub">Room: 3r7fK · 2h ago</div>
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
                      <strong>Arjun Singh</strong> shared a template
                    </div>
                    <div className="ov-activity-sub">Microservices Architecture · 5h ago</div>
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
                      <strong>Sneha Iyer</strong> commented on your board
                    </div>
                    <div className="ov-activity-sub">Payment Pipeline Design · 1d ago</div>
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
              <span className="ov-widget-sub">Northstar Studio</span>
              <span className="ov-widget-detail">8 members</span>
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
            <span className="ov-ws-avatar-more">+3</span>
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
                <span className="ov-widget-title">Voice & Video</span>
                <span className="ov-status-dot ov-status-dot--connected">
                  ● Connected
                </span>
              </div>
              <p className="ov-widget-desc">Chat, call or share your screen with your team.</p>
            </div>
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
            <button
              className="ov-quick-action-btn"
              onClick={() => navigate('/play')}
            >
              <span className="ov-qa-icon">🔗</span>
              <span className="ov-qa-title">Join Room</span>
              <span className="ov-qa-sub">Enter code</span>
            </button>

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

        {/* Widget 4: Inspirational Gradient Card with Glowing 3D Glass Spheres */}
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
