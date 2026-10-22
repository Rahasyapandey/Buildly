import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Overview.css'

export default function Overview() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  // Recent boards matching the design
  const recentBoards = [
    {
      id: 'commerce-platform',
      title: 'Commerce platform',
      color: 'blue',
      meta: 'Updated 14 mins ago · 4 members',
      members: ['SA', 'LM', 'AM'],
    },
    {
      id: 'event-driven-payments',
      title: 'Event-driven payments',
      color: 'purple',
      meta: 'Updated 2 hours ago · 2 members',
      members: ['RK', 'AM'],
    },
    {
      id: 'identity-data-model',
      title: 'Identity data model',
      color: 'teal',
      meta: 'Updated yesterday · 3 members',
      members: ['JD', 'AM', 'EL'],
    },
  ]

  const filteredBoards = recentBoards.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleOpenBoard = (title: string) => {
    navigate(`/board?title=${encodeURIComponent(title)}`)
  }

  return (
    <div className="overview-layout">
      {/* ─────────────────────────────────────────────────────────────
          SIDEBAR
          ───────────────────────────────────────────────────────────── */}
      <aside className="overview-sidebar">
        {/* Brand */}
        <Link to="/" className="overview-brand">
          <div className="overview-brand__left">
            <img src="/logo.png" alt="Buildly" className="overview-brand__logo" />
            <span className="overview-brand__name">
              buildly<span className="overview-brand__dot">.</span>
            </span>
          </div>
          <span className="overview-brand__chevron">⌄</span>
        </Link>

        {/* Workspace Selector Pill */}
        <div className="workspace-selector">
          <div className="workspace-selector__info">
            <div className="workspace-selector__avatar">N</div>
            <span className="workspace-selector__name">Northstar Studio</span>
          </div>
          <span className="workspace-selector__icon">⚙</span>
        </div>

        {/* Section: Workspace */}
        <div className="sidebar-section">
          <div className="sidebar-section__title">WORKSPACE</div>
          <div className="sidebar-menu">
            <button className="sidebar-item sidebar-item--active">
              <div className="sidebar-item__left">
                <span className="sidebar-item__icon">⊞</span>
                <span>Overview</span>
              </div>
            </button>
            <button
              className="sidebar-item"
              onClick={() => handleOpenBoard('My Projects')}
            >
              <div className="sidebar-item__left">
                <span className="sidebar-item__icon">📁</span>
                <span>My projects</span>
              </div>
              <span className="sidebar-item__badge">3</span>
            </button>
          </div>
        </div>

        {/* Section: Collaborate */}
        <div className="sidebar-section">
          <div className="sidebar-section__title">COLLABORATE</div>
          <div className="sidebar-menu">
            <button className="sidebar-item">
              <div className="sidebar-item__left">
                <span className="sidebar-item__icon">📹</span>
                <span>Connect</span>
              </div>
              <span className="sidebar-item__badge sidebar-item__badge--soon">
                SOON
              </span>
            </button>
            <button className="sidebar-item">
              <div className="sidebar-item__left">
                <span className="sidebar-item__icon">🎮</span>
                <span>Play mode</span>
              </div>
              <span className="sidebar-item__badge sidebar-item__badge--soon">
                SOON
              </span>
            </button>
            <button className="sidebar-item">
              <div className="sidebar-item__left">
                <span className="sidebar-item__icon">👥</span>
                <span>Team members</span>
              </div>
            </button>
          </div>
        </div>

        {/* Section: Recent Boards */}
        <div className="sidebar-section">
          <div className="sidebar-section__title">
            <span>RECENT BOARDS</span>
            <button
              className="sidebar-section__action"
              title="Create board"
              onClick={() => handleOpenBoard('New Board')}
            >
              +
            </button>
          </div>
          <div className="sidebar-menu">
            {recentBoards.map((board) => (
              <button
                key={board.id}
                className="sidebar-item"
                onClick={() => handleOpenBoard(board.title)}
              >
                <div className="sidebar-item__left">
                  <span
                    className={`recent-board-dot recent-board-dot--${board.color}`}
                  />
                  <span>{board.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Buildly Pro Card */}
        <div className="pro-card">
          <div className="pro-card__header">
            <span>✨</span>
            <span>BUILDLY PRO</span>
          </div>
          <p className="pro-card__desc">One space for every big idea.</p>
          <a href="#plans" className="pro-card__link">
            Explore plans ↗
          </a>
        </div>

        {/* User Profile Bar */}
        <div className="user-profile-bar">
          <div className="user-profile-bar__left">
            <div className="user-avatar-pill">AM</div>
            <div className="user-meta">
              <span className="user-meta__name">Alex Morgan</span>
              <span className="user-meta__role">Workspace admin</span>
            </div>
          </div>
          <span className="user-profile-bar__icon">⌄</span>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT AREA
          ───────────────────────────────────────────────────────────── */}
      <main className="overview-main">
        {/* Top Navbar */}
        <header className="overview-topbar">
          <div className="breadcrumbs">
            <span className="breadcrumb-root">Northstar Studio</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Overview</span>
          </div>

          <div className="topbar-actions">
            {/* Team avatar stack */}
            <div className="avatar-stack">
              <div
                className="avatar-stack__img"
                style={{ backgroundColor: '#bfdbfe' }}
                title="Aarav"
              />
              <div
                className="avatar-stack__img"
                style={{ backgroundColor: '#fbcfe8' }}
                title="Yashasvi"
              />
              <div
                className="avatar-stack__img"
                style={{ backgroundColor: '#fed7aa' }}
                title="Rohan"
              />
              <div className="avatar-stack__count">+2</div>
            </div>

            {/* Quick action buttons */}
            <button className="topbar-icon-btn" title="Search">
              🔍
            </button>
            <button className="topbar-icon-btn" title="Notifications">
              🔔
              <span className="topbar-indicator-dot" />
            </button>
            <button className="topbar-icon-btn" title="Help">
              ❔
            </button>
            <div className="topbar-profile-pill">AM</div>
          </div>
        </header>

        {/* Scrollable Container */}
        <div className="overview-content">
          {/* Header Row */}
          <div className="pulse-badge">
            <span className="pulse-badge__dot" />
            <span>TUESDAY, WORKSPACE PULSE</span>
          </div>

          <div className="greeting-row">
            <div>
              <h1 className="greeting-heading">Good morning, Alex.</h1>
              <p className="greeting-subtitle">
                Your team has been building brilliant things together.
              </p>
            </div>

            <div className="greeting-actions">
              <div className="search-boards-input">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="Search boards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link to="/board" className="btn-new-board">
                <span>+</span> New board
              </Link>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              STATS ROW (3 CARDS)
              ───────────────────────────────────────────────────────────── */}
          <section className="stats-grid">
            <div className="stat-card">
              <div>
                <div className="stat-card__label">Boards in motion</div>
                <div className="stat-card__value">03</div>
                <div className="stat-card__trend">+2 this week</div>
              </div>
              <div className="stat-card__icon stat-card__icon--blue">
                <span>⚡</span>
              </div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-card__label">People creating</div>
                <div className="stat-card__value">08</div>
                <div className="stat-card__trend">4 active right now</div>
              </div>
              <div className="stat-card__icon stat-card__icon--purple">
                <span>👥</span>
              </div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-card__label">Ideas connected</div>
                <div className="stat-card__value">124</div>
                <div className="stat-card__trend">+18% this month</div>
              </div>
              <div className="stat-card__icon stat-card__icon--green">
                <span>🔗</span>
              </div>
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────────
              MODE CARDS (CONNECT & PLAY)
              ───────────────────────────────────────────────────────────── */}
          <section className="modes-row">
            <div
              className="mode-banner"
              onClick={() => alert('Connect Mode (audio, video & screen sharing via WebRTC) is scheduled for Phase 6!')}
            >
              <div className="mode-banner__left">
                <div className="mode-banner__icon mode-banner__icon--blue">
                  <span>📹</span>
                </div>
                <div>
                  <div className="mode-banner__title-row">
                    <span className="mode-banner__title">Connect mode</span>
                    <span className="mode-banner__badge mode-banner__badge--blue">
                      PLANNED
                    </span>
                  </div>
                  <p className="mode-banner__desc">
                    Bring your team into the room around the board.
                  </p>
                </div>
              </div>
              <span className="mode-banner__arrow">↗</span>
            </div>

            <div
              className="mode-banner"
              onClick={() => alert('Play Mode (lightweight multiplayer games & team quizzes) is scheduled for Phase 7!')}
            >
              <div className="mode-banner__left">
                <div className="mode-banner__icon mode-banner__icon--purple">
                  <span>🎮</span>
                </div>
                <div>
                  <div className="mode-banner__title-row">
                    <span className="mode-banner__title">Play mode</span>
                    <span className="mode-banner__badge mode-banner__badge--purple">
                      PLANNED
                    </span>
                  </div>
                  <p className="mode-banner__desc">
                    Make space for the people behind the projects.
                  </p>
                </div>
              </div>
              <span className="mode-banner__arrow">↗</span>
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────────
              BLUEPRINTS / TEMPLATES
              ───────────────────────────────────────────────────────────── */}
          <section>
            <div className="section-header">
              <div>
                <div className="section-tag">A HEAD START</div>
                <h2 className="section-title">Start with a blueprint</h2>
              </div>
              <span className="section-link">
                <span>✨</span> Curated for engineering teams
              </span>
            </div>

            <div className="blueprints-grid">
              <div
                className="blueprint-card"
                onClick={() => handleOpenBoard('E-commerce Cloud Architecture')}
                style={{ cursor: 'pointer' }}
              >
                <div className="blueprint-icon blueprint-icon--blue">☁️</div>
                <div className="blueprint-info">
                  <div className="blueprint-title">E-commerce cl...</div>
                  <div className="blueprint-subtitle">AWS architecture</div>
                </div>
                <span className="blueprint-arrow">↗</span>
              </div>

              <div
                className="blueprint-card"
                onClick={() => handleOpenBoard('Payment Pipeline Architecture')}
                style={{ cursor: 'pointer' }}
              >
                <div className="blueprint-icon blueprint-icon--purple">⚡</div>
                <div className="blueprint-info">
                  <div className="blueprint-title">Payment pipeline</div>
                  <div className="blueprint-subtitle">Event-driven syste...</div>
                </div>
                <span className="blueprint-arrow">↗</span>
              </div>

              <div
                className="blueprint-card"
                onClick={() => handleOpenBoard('Multi-tenant Database ERD')}
                style={{ cursor: 'pointer' }}
              >
                <div className="blueprint-icon blueprint-icon--green">🗄️</div>
                <div className="blueprint-info">
                  <div className="blueprint-title">Multi-tenant ERD</div>
                  <div className="blueprint-subtitle">PostgreSQL schema</div>
                </div>
                <span className="blueprint-arrow">↗</span>
              </div>

              <div
                className="blueprint-card"
                onClick={() => handleOpenBoard('Microservices Stack')}
                style={{ cursor: 'pointer' }}
              >
                <div className="blueprint-icon blueprint-icon--amber">🥞</div>
                <div className="blueprint-info">
                  <div className="blueprint-title">Microservices st...</div>
                  <div className="blueprint-subtitle">Auth + API gateway</div>
                </div>
                <span className="blueprint-arrow">↗</span>
              </div>
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────────
              DUAL SECTION: RECENT BOARDS & TEAM ACTIVITY
              ───────────────────────────────────────────────────────────── */}
          <section className="dual-section">
            <div>
              <div className="section-header">
                <div>
                  <div className="section-tag">PICK UP WHERE YOU LEFT OFF</div>
                  <h2 className="section-title">Recent boards</h2>
                </div>
                <Link to="/board" className="section-link section-link--blue">
                  View all →
                </Link>
              </div>

              <div className="recent-boards-list">
                {filteredBoards.map((board) => (
                  <div
                    key={board.id}
                    className="recent-board-card"
                    onClick={() => handleOpenBoard(board.title)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="recent-board-card__left">
                      <span
                        className={`recent-board-dot recent-board-dot--${board.color}`}
                      />
                      <div>
                        <div className="recent-board-card__title">
                          {board.title}
                        </div>
                        <div className="recent-board-card__meta">
                          {board.meta}
                        </div>
                      </div>
                    </div>
                    <div className="recent-board-card__right">
                      <div className="member-avatars">
                        {board.members.map((m, i) => (
                          <div key={i} className="member-avatar">
                            {m}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="section-header">
                <div>
                  <div className="section-tag">AROUND THE WORKSPACE</div>
                  <h2 className="section-title">Team activity ✨</h2>
                </div>
              </div>

              <div className="activity-card">
                <div className="activity-item">
                  <div className="activity-avatar">AM</div>
                  <div className="activity-body">
                    <span className="activity-user">Alex Morgan</span>{' '}
                    <span className="activity-action">created blueprint</span>{' '}
                    <span className="activity-target">Multi-tenant ERD</span>
                    <div className="activity-time">12 minutes ago</div>
                  </div>
                </div>

                <div className="activity-item">
                  <div
                    className="activity-avatar"
                    style={{ background: '#f5f3ff', color: '#7c3aed' }}
                  >
                    AR
                  </div>
                  <div className="activity-body">
                    <span className="activity-user">Aarav</span>{' '}
                    <span className="activity-action">drew architecture in</span>{' '}
                    <span className="activity-target">Commerce platform</span>
                    <div className="activity-time">45 minutes ago</div>
                  </div>
                </div>

                <div className="activity-item">
                  <div
                    className="activity-avatar"
                    style={{ background: '#ecfdf5', color: '#059669' }}
                  >
                    YS
                  </div>
                  <div className="activity-body">
                    <span className="activity-user">Yashasvi</span>{' '}
                    <span className="activity-action">connected 3 services in</span>{' '}
                    <span className="activity-target">Event-driven payments</span>
                    <div className="activity-time">2 hours ago</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
