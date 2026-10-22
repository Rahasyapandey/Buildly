// Clean SVG vector icons for Buildly Overview matching design system

export function IconHome({ className = '', size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  )
}

export function IconFolder({ className = '', size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
}

export function IconGamepad({ className = '', size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <line x1="15" y1="13" x2="15.01" y2="13" />
      <line x1="18" y1="11" x2="18.01" y2="11" />
      <rect x="2" y="6" width="20" height="12" rx="6" />
    </svg>
  )
}

export function IconWaveform({ className = '', size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 10v4M7 6v12M11 3v18M15 8v8M19 5v14M22 10v4" />
    </svg>
  )
}

export function IconTeam({ className = '', size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export function IconTemplates({ className = '', size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

// 4 Metric Card Icons
export function IconMetricBoard({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
      <line x1="3" y1="9" x2="21" y2="9" />
    </svg>
  )
}

export function IconMetricPeople({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export function IconMetricLightbulb({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6M10 22h4M15 2a6 6 0 0 0-6 6c0 2.5 1.5 4 2 5h2c.5-1 2-2.5 2-5a6 6 0 0 0-6-6z" />
    </svg>
  )
}

export function IconMetricBolt({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

// 4 Template Icons
export function IconCloudArch({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      <line x1="8" y1="14" x2="16" y2="14" />
    </svg>
  )
}

export function IconUML({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="7" rx="1.5" />
      <rect x="4" y="14" width="7" height="7" rx="1.5" />
      <rect x="13" y="14" width="7" height="7" rx="1.5" />
      <path d="M12 10v4M7.5 14v-2h9v2" />
    </svg>
  )
}

export function IconERD({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </svg>
  )
}

export function IconFlowchart({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="3" width="6" height="5" rx="1" />
      <rect x="3" y="16" width="6" height="5" rx="1" />
      <rect x="15" y="16" width="6" height="5" rx="1" />
      <path d="M12 8v4M6 16v-2h12v2M12 12v2" />
    </svg>
  )
}

// Right Panel Icons
export function IconWorkspaceBoard({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="12" y1="10" x2="12" y2="20" />
    </svg>
  )
}

export function IconVideoCall({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  )
}

export function IconSparkle({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
    </svg>
  )
}

// Vector Cat Sketch for Play Mode Card
export function CatSketchSvg({ className = '' }: { className?: string }) {
  return (
    <svg width="100" height="85" viewBox="0 0 100 85" fill="none" className={className}>
      {/* Cat head outline */}
      <circle cx="50" cy="50" r="28" stroke="#1e293b" strokeWidth="2.5" />
      {/* Left ear */}
      <polygon points="27,33 18,12 39,24" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" fill="#eff6ff" />
      {/* Right ear */}
      <polygon points="73,33 82,12 61,24" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" fill="#eff6ff" />
      {/* Eyes */}
      <circle cx="41" cy="46" r="3" fill="#1e293b" />
      <circle cx="59" cy="46" r="3" fill="#1e293b" />
      {/* Nose */}
      <polygon points="48,54 52,54 50,57" fill="#ec4899" />
      {/* Mouth */}
      <path d="M46 58 Q50 62 54 58" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Whiskers left */}
      <line x1="24" y1="48" x2="36" y2="50" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="23" y1="56" x2="35" y2="54" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />
      {/* Whiskers right */}
      <line x1="64" y1="50" x2="76" y2="48" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="65" y1="54" x2="77" y2="56" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />
      {/* Confused Question mark */}
      <text x="82" y="32" fill="#2563eb" fontSize="22" fontWeight="900" fontFamily="sans-serif">?</text>
    </svg>
  )
}

// Floating Whiteboard 3D Isometric Card + "Better Together"
export function HeroIllustrationSvg({ className = '' }: { className?: string }) {
  return (
    <div className={`ov-hero-gfx ${className}`}>
      {/* Decorative ambient rays & sparkle crosses */}
      <svg className="ov-hero-sparkles" viewBox="0 0 320 180" fill="none">
        {/* Curved background swoosh line */}
        <path d="M20 110 C 80 40, 160 30, 290 80" stroke="rgba(37,99,235,0.18)" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M50 140 C 130 90, 200 80, 310 130" stroke="rgba(139,92,246,0.15)" strokeWidth="1.5" />
        {/* Sparkles */}
        <path d="M260 20 L262 26 L268 28 L262 30 L260 36 L258 30 L252 28 L258 26 Z" fill="#3b82f6" opacity="0.7" />
        <path d="M40 50 L41 54 L45 55 L41 56 L40 60 L39 56 L35 55 L39 54 Z" fill="#8b5cf6" opacity="0.6" />
        <circle cx="280" cy="110" r="3" fill="#60a5fa" opacity="0.5" />
      </svg>

      {/* 3D Angled Canvas Card */}
      <div className="ov-hero-card-3d">
        <div className="ov-3d-board">
          {/* Top toolbar strip */}
          <div className="ov-3d-bar">
            <span className="ov-3d-dot" style={{ backgroundColor: '#ef4444' }} />
            <span className="ov-3d-dot" style={{ backgroundColor: '#f59e0b' }} />
            <span className="ov-3d-dot" style={{ backgroundColor: '#10b981' }} />
          </div>

          {/* Diagram nodes and connectors */}
          <div className="ov-3d-content">
            {/* Node 1 */}
            <div className="ov-3d-node ov-3d-node--blue">
              <span className="ov-3d-node-icon">☁️</span>
              <span className="ov-3d-node-text">API Gateway</span>
            </div>

            {/* Connecting curve */}
            <svg className="ov-3d-connector" viewBox="0 0 100 40">
              <path d="M 10 20 C 50 10, 50 30, 90 20" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="3 3" />
            </svg>

            {/* Node 2 */}
            <div className="ov-3d-node ov-3d-node--purple">
              <span className="ov-3d-node-icon">⚡</span>
              <span className="ov-3d-node-text">Auth Service</span>
            </div>

            {/* Sticky notes */}
            <div className="ov-3d-sticky ov-3d-sticky--yellow">
              <span>Sprint goal 🚀</span>
            </div>
            <div className="ov-3d-sticky ov-3d-sticky--cyan">
              <span>PostgreSQL ✓</span>
            </div>

            {/* Microservice DB node */}
            <div className="ov-3d-node ov-3d-node--green">
              <span className="ov-3d-node-icon">🗄️</span>
              <span className="ov-3d-node-text">Cluster DB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cursive "Better Together" scribble with hand-drawn arrow */}
      <div className="ov-hero-better-together">
        <span className="ov-cursive-brand">Better Together</span>
        <svg width="46" height="34" viewBox="0 0 46 34" fill="none" className="ov-curved-arrow-svg">
          <path d="M 6 4 C 18 10, 28 20, 36 28 M 36 28 L 26 26 M 36 28 L 34 18" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}
