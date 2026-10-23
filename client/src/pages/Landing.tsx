import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from '../components/ThemeToggle/ThemeToggle'
import UserMenu from '../components/Auth/UserMenu'
import LandingBackground3D from '../components/Landing/LandingBackground3D'
import {
  IconCloud,
  IconDiagram,
  IconDownload,
  IconGamepad,
  IconPen,
  IconShare,
  IconShield,
  IconSticky,
  IconUsers,
  IconZap,
} from '../components/Icons/Icons'
import './Landing.css'

export default function Landing() {
  const { isAuthenticated, user, openAuthModal } = useAuth()
  const [activeCanvasTool, setActiveCanvasTool] = useState<string>('select')
  const [selectedNode, setSelectedNode] = useState<string>('backend')

  return (
    <div className="landing-container">
      {/* ── 3D Flowing Ribbons & Frosted Elements Background ──── */}
      <LandingBackground3D />

      {/* ─────────────────────────────────────────────────────────────
          A. MINIMAL NAVIGATION BAR
          ───────────────────────────────────────────────────────────── */}
      <header className="landing-nav-header">
        <nav className="landing-nav-minimal" aria-label="Main Navigation">
          {/* Brand Logo & Name */}
          <Link to="/" className="landing-brand" aria-label="Buildly Home">
            <div className="landing-brand__icon-wrap">
              <img src="/logo.png" alt="Buildly Logo" className="landing-brand__logo" />
            </div>
            <span className="landing-brand__text">
              Buildly<span className="landing-brand__dot">.</span>
            </span>
          </Link>

          {/* Minimal Links */}
          <div className="landing-nav__links">
            <Link to="/workspace" className="landing-nav__link">
              Workspace
            </Link>
            <a href="#features" className="landing-nav__link">
              Features
            </a>
            <a href="#about" className="landing-nav__link">
              About
            </a>
          </div>

          {/* Actions: Theme Toggle, Sign In, Get Started CTA */}
          <div className="landing-nav__actions">
            <ThemeToggle variant="pill" className="landing-theme-pill" />

            {isAuthenticated && user ? (
              <UserMenu variant="compact" />
            ) : (
              <button
                type="button"
                className="landing-signin-btn"
                onClick={openAuthModal}
                title="Sign in with Google or demo"
              >
                Sign in
              </button>
            )}

            <Link to="/workspace" className="landing-nav-cta">
              Get started →
            </Link>
          </div>
        </nav>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          B & C. HERO SECTION WITH SPLIT WORKSPACE PREVIEW
          ───────────────────────────────────────────────────────────── */}
      <main className="landing-main">
        <section className="landing-hero-section">
          <div className="landing-hero-split">
            {/* Left Hero Content */}
            <div className="hero-content-col">
              {/* Badge */}
              <div className="hero-announcement-pill">
                <span className="hero-pill-sparkle">✦</span>
                <span>Build Better. Together.</span>
              </div>

              {/* Headline */}
              <h1 className="hero-headline">
                Think together.
                <span className="hero-headline__accent">Build together.</span>
              </h1>

              {/* Supporting Text */}
              <p className="hero-subtitle">
                Plan your software, map your ideas, and build with your team — all in one
                collaborative workspace.
              </p>

              {/* Single Primary CTA */}
              <div className="hero-cta-wrapper">
                <Link to="/workspace" className="hero-primary-cta">
                  Get started — It's free →
                </Link>
              </div>

              {/* Micro Trust & Feature Highlights */}
              <div className="hero-trust-bar">
                <div className="trust-item">
                  <span className="trust-indicator" />
                  <span>Real-time sync</span>
                </div>
                <span className="trust-separator">•</span>
                <div className="trust-item">
                  <span>No credit card required</span>
                </div>
                <span className="trust-separator">•</span>
                <div className="trust-item">
                  <span>Free cloud storage</span>
                </div>
              </div>
            </div>

            {/* Right Workspace Preview Column */}
            <div className="hero-preview-col">
              {/* Playful Handwritten Sketch Callout */}
              <div className="hero-sketch-note" aria-hidden="true">
                <div className="sketch-text">
                  Your ideas
                  <span className="sketch-symbol">+</span>
                  Our workspace
                  <span className="sketch-symbol">=</span>
                  <strong>Something great</strong>
                </div>
                <svg
                  className="sketch-arrow-svg"
                  width="44"
                  height="44"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 10 C 26 12, 38 20, 36 34" />
                  <path d="M26 34 L 36 35 L 38 25" />
                </svg>
              </div>

              {/* Polished SaaS Workspace Preview Card */}
              <div className="workspace-preview-window">
                {/* Window Titlebar */}
                <div className="preview-window__header">
                  <div className="preview-window__traffic-lights">
                    <span className="traffic-dot traffic-dot--red" />
                    <span className="traffic-dot traffic-dot--yellow" />
                    <span className="traffic-dot traffic-dot--green" />
                  </div>

                  <div className="preview-window__project-title">
                    <span className="preview-project-icon">⬡</span>
                    <span className="preview-project-name">E-commerce Platform</span>
                    <span className="preview-chevron">▾</span>
                  </div>

                  <div className="preview-window__header-actions">
                    {/* Collaborator Avatars */}
                    <div className="preview-collaborators">
                      <span className="preview-avatar preview-avatar--1" title="Alex">A</span>
                      <span className="preview-avatar preview-avatar--2" title="Priya">P</span>
                      <span className="preview-avatar preview-avatar--3" title="David">D</span>
                      <span className="preview-avatar preview-avatar--more">+3</span>
                    </div>

                    <button type="button" className="preview-share-btn">
                      <IconShare size={12} />
                      <span>Share</span>
                    </button>
                    <span className="preview-menu-dots">•••</span>
                  </div>
                </div>

                {/* Window Body: Mini Sidebar + Canvas + Inspector */}
                <div className="preview-window__body">
                  {/* Mini Sidebar */}
                  <aside className="preview-sidebar" aria-label="Mock Workspace Navigation">
                    <div className="preview-sidebar__brand">
                      <img src="/logo.png" alt="Buildly" className="preview-sidebar__logo" />
                      <span className="preview-sidebar__name">Buildly.</span>
                    </div>

                    <div className="preview-sidebar__nav">
                      <div className="preview-sidebar__item">
                        <span className="sidebar-icon">📁</span>
                        <span>Home</span>
                      </div>
                      <div className="preview-sidebar__item preview-sidebar__item--active">
                        <span className="sidebar-icon">📐</span>
                        <span>Workspace</span>
                      </div>
                      <div className="preview-sidebar__item">
                        <span className="sidebar-icon">⚙️</span>
                        <span>Settings</span>
                      </div>
                    </div>
                  </aside>

                  {/* Main Architecture Canvas Area */}
                  <div className="preview-canvas-wrapper">
                    {/* Left Canvas Mini-Toolstrip */}
                    <div className="preview-canvas-tools" role="toolbar" aria-label="Drawing Tools">
                      <button
                        type="button"
                        className={`canvas-tool-btn ${activeCanvasTool === 'select' ? 'active' : ''}`}
                        onClick={() => setActiveCanvasTool('select')}
                        title="Select"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M4 2l16 11-7 2-4 7-2-1 4-6-7-2z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className={`canvas-tool-btn ${activeCanvasTool === 'pan' ? 'active' : ''}`}
                        onClick={() => setActiveCanvasTool('pan')}
                        title="Pan"
                      >
                        ✋
                      </button>
                      <button
                        type="button"
                        className={`canvas-tool-btn ${activeCanvasTool === 'pen' ? 'active' : ''}`}
                        onClick={() => setActiveCanvasTool('pen')}
                        title="Pen"
                      >
                        <IconPen size={13} />
                      </button>
                      <button
                        type="button"
                        className={`canvas-tool-btn ${activeCanvasTool === 'sticky' ? 'active' : ''}`}
                        onClick={() => setActiveCanvasTool('sticky')}
                        title="Sticky Note"
                      >
                        <IconSticky size={13} />
                      </button>
                      <button
                        type="button"
                        className={`canvas-tool-btn ${activeCanvasTool === 'box' ? 'active' : ''}`}
                        onClick={() => setActiveCanvasTool('box')}
                        title="Architecture Box"
                      >
                        <span style={{ fontSize: 13 }}>▢</span>
                      </button>
                    </div>

                    {/* Canvas Stage with Architecture Diagram */}
                    <div className="preview-canvas-stage">
                      {/* Top Tier: User Client */}
                      <div className="diagram-row diagram-row--top">
                        <div
                          className={`arch-card arch-card--user ${selectedNode === 'user' ? 'selected' : ''}`}
                          onClick={() => setSelectedNode('user')}
                        >
                          <div className="arch-card__badge arch-card__badge--purple">
                            <span className="badge-icon">👤</span>
                            <span>User Client</span>
                          </div>
                          <div className="arch-card__meta">Web Browser &amp; Mobile App</div>
                        </div>
                      </div>

                      {/* SVG Connectors: User to Microservices */}
                      <svg className="arch-connector-svg arch-connector-svg--top" viewBox="0 0 540 40" preserveAspectRatio="none">
                        <path
                          d="M 270 0 L 270 20 L 90 20 L 90 40"
                          stroke="rgba(99, 102, 241, 0.45)"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                          fill="none"
                        />
                        <path
                          d="M 270 0 L 270 40"
                          stroke="rgba(99, 102, 241, 0.6)"
                          strokeWidth="2"
                          fill="none"
                        />
                        <path
                          d="M 270 20 L 450 20 L 450 40"
                          stroke="rgba(99, 102, 241, 0.45)"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                          fill="none"
                        />
                      </svg>

                      {/* Middle Tier: Core Microservices */}
                      <div className="diagram-row diagram-row--middle">
                        {/* Frontend */}
                        <div
                          className={`arch-card arch-card--frontend ${selectedNode === 'frontend' ? 'selected' : ''}`}
                          onClick={() => setSelectedNode('frontend')}
                        >
                          <div className="arch-card__header">
                            <span className="arch-node-icon blue">💻</span>
                            <div>
                              <div className="arch-node-title">Frontend</div>
                              <div className="arch-node-tech">React 19 / Vite</div>
                            </div>
                          </div>
                        </div>

                        {/* Bidirectional Sync Indicator */}
                        <div className="arch-h-connector">
                          <span className="connector-arrow">⟷</span>
                        </div>

                        {/* Backend */}
                        <div
                          className={`arch-card arch-card--backend ${selectedNode === 'backend' ? 'selected' : ''}`}
                          onClick={() => setSelectedNode('backend')}
                        >
                          <div className="arch-card__header">
                            <span className="arch-node-icon green">⚡</span>
                            <div>
                              <div className="arch-node-title">Backend</div>
                              <div className="arch-node-tech">FastAPI (Python)</div>
                            </div>
                          </div>
                        </div>

                        {/* Bidirectional Sync Indicator */}
                        <div className="arch-h-connector">
                          <span className="connector-arrow">⟷</span>
                        </div>

                        {/* Database */}
                        <div
                          className={`arch-card arch-card--db ${selectedNode === 'db' ? 'selected' : ''}`}
                          onClick={() => setSelectedNode('db')}
                        >
                          <div className="arch-card__header">
                            <span className="arch-node-icon purple">🗄️</span>
                            <div>
                              <div className="arch-node-title">Database</div>
                              <div className="arch-node-tech">PostgreSQL 16</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SVG Connectors: Backend to Subservices */}
                      <svg className="arch-connector-svg arch-connector-svg--bottom" viewBox="0 0 540 40" preserveAspectRatio="none">
                        <path
                          d="M 270 0 L 270 20 L 90 20 L 90 40"
                          stroke="rgba(99, 102, 241, 0.45)"
                          strokeWidth="2"
                          fill="none"
                        />
                        <path
                          d="M 270 0 L 270 40"
                          stroke="rgba(99, 102, 241, 0.6)"
                          strokeWidth="2"
                          fill="none"
                        />
                        <path
                          d="M 270 20 L 450 20 L 450 40"
                          stroke="rgba(99, 102, 241, 0.45)"
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>

                      {/* Bottom Tier: Subservices */}
                      <div className="diagram-row diagram-row--bottom">
                        <div
                          className={`arch-card arch-card--sub arch-card--sub-amber ${selectedNode === 'payment' ? 'selected' : ''}`}
                          onClick={() => setSelectedNode('payment')}
                        >
                          <span className="arch-sub-icon">💳</span>
                          <div>
                            <div className="arch-sub-title">Payment Service</div>
                            <div className="arch-sub-desc">Stripe API</div>
                          </div>
                        </div>

                        <div
                          className={`arch-card arch-card--sub arch-card--sub-cyan ${selectedNode === 'auth' ? 'selected' : ''}`}
                          onClick={() => setSelectedNode('auth')}
                        >
                          <span className="arch-sub-icon">🛡️</span>
                          <div>
                            <div className="arch-sub-title">Auth Service</div>
                            <div className="arch-sub-desc">JWT / OAuth 2.0</div>
                          </div>
                        </div>

                        <div
                          className={`arch-card arch-card--sub arch-card--sub-pink ${selectedNode === 'notify' ? 'selected' : ''}`}
                          onClick={() => setSelectedNode('notify')}
                        >
                          <span className="arch-sub-icon">🔔</span>
                          <div>
                            <div className="arch-sub-title">Notification</div>
                            <div className="arch-sub-desc">Email / SMS Events</div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Overlays: Minimap & Zoom Control */}
                      <div className="preview-canvas__overlays">
                        <div className="preview-minimap" title="Minimap Radar">
                          <div className="minimap-grid">
                            <span className="minimap-node minimap-node--top" />
                            <span className="minimap-node minimap-node--mid-1" />
                            <span className="minimap-node minimap-node--mid-2" />
                            <span className="minimap-node minimap-node--mid-3" />
                          </div>
                        </div>

                        <div className="preview-zoom-pill">
                          <button type="button" className="zoom-btn">−</button>
                          <span className="zoom-value">100%</span>
                          <button type="button" className="zoom-btn">+</button>
                          <span className="zoom-sep">|</span>
                          <button type="button" className="zoom-btn" title="Fit to Screen">⤢</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Inspector Panel */}
                  <aside className="preview-inspector">
                    <div className="preview-inspector__header">
                      <span className="inspector-title">System Architecture</span>
                    </div>

                    <div className="preview-inspector__tabs">
                      <button type="button" className="inspector-tab inspector-tab--active">
                        Properties
                      </button>
                      <button type="button" className="inspector-tab">
                        Settings
                      </button>
                    </div>

                    <div className="preview-inspector__fields">
                      <div className="inspector-field">
                        <label className="inspector-label">Title</label>
                        <div className="inspector-static-input">System Architecture</div>
                      </div>

                      <div className="inspector-field">
                        <label className="inspector-label">Description</label>
                        <div className="inspector-static-textarea">
                          High-level architecture of our e-commerce platform with microservices.
                        </div>
                      </div>

                      <div className="inspector-field">
                        <label className="inspector-label">Theme</label>
                        <div className="inspector-static-select">
                          <span>Light</span>
                          <span className="select-chevron">▾</span>
                        </div>
                      </div>

                      <div className="inspector-actions">
                        <button type="button" className="inspector-export-btn">
                          <IconDownload size={13} />
                          <span>Export</span>
                        </button>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Telemetry Metric Ribbon (Directly under preview) */}
          <div className="landing-telemetry-ribbon">
            <div className="telemetry-item">
              <div className="telemetry-icon-wrap zap">
                <IconZap size={16} />
              </div>
              <div className="telemetry-text">
                <div className="telemetry-value">&lt;15ms</div>
                <div className="telemetry-label">WebSocket Sync Latency</div>
              </div>
            </div>

            <div className="telemetry-item">
              <div className="telemetry-icon-wrap shield">
                <IconShield size={16} />
              </div>
              <div className="telemetry-text">
                <div className="telemetry-value">100%</div>
                <div className="telemetry-label">Vector PDF &amp; SVG Fidelity</div>
              </div>
            </div>

            <div className="telemetry-item">
              <div className="telemetry-icon-wrap game">
                <IconGamepad size={16} />
              </div>
              <div className="telemetry-text">
                <div className="telemetry-value">WebRTC</div>
                <div className="telemetry-label">Integrated Voice Huddle</div>
              </div>
            </div>

            <div className="telemetry-item">
              <div className="telemetry-icon-wrap cloud">
                <IconCloud size={16} />
              </div>
              <div className="telemetry-text">
                <div className="telemetry-value">Infinite</div>
                <div className="telemetry-label">Spatial Multi-user Canvas</div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            D. KEY FEATURES SECTION
            Highlighted benefits: PDF Export, Play Mode, Real-time Collaboration,
            Save & Load, Diagrams & Templates
            ───────────────────────────────────────────────────────────── */}
        <section id="features" className="landing-features-section">
          <div className="features-header">
            <span className="features-eyebrow">BUILT FOR SPEED &amp; RIGOR</span>
            <h2 className="features-title">Engineered for modern software development</h2>
            <p className="features-subtitle">
              From high-level architectural blueprints to multiplayer team camaraderie, Buildly gives
              you the essential developer toolkit.
            </p>
          </div>

          <div className="landing-features-grid">
            {/* Feature 1: PDF Export */}
            <div className="feature-card">
              <div className="feature-card__icon-wrap feature-card__icon-wrap--blue">
                <IconDownload size={22} />
              </div>
              <span className="feature-card__tag">Publication Ready</span>
              <h3 className="feature-card__title">PDF Export</h3>
              <p className="feature-card__desc">
                Export publication-grade vector PDFs and SVG diagrams with crystal clarity. Share architecture
                specs, RFC documents, and system designs with your stakeholders.
              </p>
            </div>

            {/* Feature 2: Play Mode */}
            <div className="feature-card">
              <div className="feature-card__icon-wrap feature-card__icon-wrap--purple">
                <IconGamepad size={22} />
              </div>
              <span className="feature-card__tag">Multiplayer Party</span>
              <h3 className="feature-card__title">Play Mode</h3>
              <p className="feature-card__desc">
                Unwind with your team through interactive drawing games, prompt guessing, and multiplayer
                rooms powered by low-latency WebRTC stereo voice chat.
              </p>
            </div>

            {/* Feature 3: Real-time Collaboration */}
            <div className="feature-card">
              <div className="feature-card__icon-wrap feature-card__icon-wrap--indigo">
                <IconUsers size={22} />
              </div>
              <span className="feature-card__tag">Sub-15ms Latency</span>
              <h3 className="feature-card__title">Real-time Collaboration</h3>
              <p className="feature-card__desc">
                Collaborate simultaneously with live multi-cursor presence, instant state synchronization,
                and conflict-free updates across team members anywhere.
              </p>
            </div>

            {/* Feature 4: Save & Load */}
            <div className="feature-card">
              <div className="feature-card__icon-wrap feature-card__icon-wrap--emerald">
                <IconCloud size={22} />
              </div>
              <span className="feature-card__tag">Cloud Persistence</span>
              <h3 className="feature-card__title">Save &amp; Load</h3>
              <p className="feature-card__desc">
                Persist and reopen projects instantly with cloud PostgreSQL database storage and local
                resilient caching. Never lose a diagram or whiteboard brainstorming session.
              </p>
            </div>

            {/* Feature 5: Diagrams & Templates */}
            <div className="feature-card feature-card--span-2">
              <div className="feature-card__icon-wrap feature-card__icon-wrap--amber">
                <IconDiagram size={22} />
              </div>
              <span className="feature-card__tag">Ready-Made Blueprint Library</span>
              <h3 className="feature-card__title">Diagrams &amp; Templates</h3>
              <p className="feature-card__desc">
                Jumpstart your systems with pre-crafted templates: System Architecture microservices, UML class
                diagrams, PostgreSQL relational ERDs, and asynchronous WebSocket flowcharts.
              </p>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            ABOUT / CALLOUT BANNER SECTION
            ───────────────────────────────────────────────────────────── */}
        <section id="about" className="landing-about-section">
          <div className="about-card">
            <div className="about-card__content">
              <span className="about-card__eyebrow">READY TO BUILD?</span>
              <h2 className="about-card__title">Think together. Build together.</h2>
              <p className="about-card__desc">
                Buildly combines the fluid freedom of an infinite digital whiteboard with the precision of
                software architecture tooling. Free to start, instant to launch.
              </p>
              <div className="about-card__actions">
                <Link to="/workspace" className="about-primary-btn">
                  Get started — It's free →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          MINIMAL FOOTER
          ───────────────────────────────────────────────────────────── */}
      <footer className="landing-footer-minimal">
        <div className="landing-footer-inner">
          <div className="footer-brand">
            <Link to="/" className="footer-brand-link">
              <img src="/logo.png" alt="Buildly" className="footer-logo" />
              <span className="footer-name">Buildly.</span>
            </Link>
            <p className="footer-copy">© 2026 Buildly, Inc. All rights reserved.</p>
          </div>

          <div className="footer-links">
            <Link to="/workspace" className="footer-link">
              Workspace
            </Link>
            <Link to="/board" className="footer-link">
              Whiteboard
            </Link>
            <Link to="/play" className="footer-link">
              Play Mode
            </Link>
            <a
              href="https://github.com/Rahasyapandey/Buildly"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
