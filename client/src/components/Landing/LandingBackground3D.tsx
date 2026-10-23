import './LandingBackground3D.css'

export default function LandingBackground3D() {
  return (
    <div className="landing-bg-3d" aria-hidden="true">
      {/* ── Layer 1: Ambient Mesh Light Glows ───────────────────── */}
      <div className="bg-glow-orb bg-glow-orb--top-left" />
      <div className="bg-glow-orb bg-glow-orb--top-right" />
      <div className="bg-glow-orb bg-glow-orb--center" />
      <div className="bg-glow-orb bg-glow-orb--bottom-right" />

      {/* ── Layer 2: 3D Flowing Silky Ribbon Waves SVG ───────────── */}
      <svg
        className="bg-ribbon-svg"
        viewBox="0 0 1600 1100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Ribbon Wave 1 Main Gradient */}
          <linearGradient id="ribbonGrad1" x1="0%" y1="10%" x2="100%" y2="90%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.32" />
            <stop offset="28%" stopColor="#a78bfa" stopOpacity="0.24" />
            <stop offset="55%" stopColor="#c084fc" stopOpacity="0.18" />
            <stop offset="78%" stopColor="#93c5fd" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.04" />
          </linearGradient>

          {/* Ribbon Wave 1 Edge Specular Ridge */}
          <linearGradient id="ribbonEdge1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#e0e7ff" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#ede9fe" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>

          {/* Ribbon Wave 2 Secondary Accent Gradient */}
          <linearGradient id="ribbonGrad2" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.22" />
            <stop offset="40%" stopColor="#818cf8" stopOpacity="0.16" />
            <stop offset="75%" stopColor="#c4b5fd" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.02" />
          </linearGradient>

          {/* Subtle Back Flow Gradient */}
          <linearGradient id="ribbonBackdrop" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#c7d2fe" stopOpacity="0.28" />
            <stop offset="50%" stopColor="#e0e7ff" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#ede9fe" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Back sweep wave layer */}
        <path
          d="M -120 180 C 180 80, 480 320, 820 280 C 1140 240, 1420 110, 1720 180 L 1720 480 C 1380 410, 1080 520, 740 500 C 420 480, 140 380, -120 450 Z"
          fill="url(#ribbonBackdrop)"
        />

        {/* Main Ribbon 1: Sweeps from top-left, dips behind hero, curves under canvas */}
        <path
          d="M -140 20 C 140 80, 360 380, 720 410 C 1100 440, 1380 280, 1720 380 L 1720 540 C 1360 440, 1080 590, 680 560 C 320 530, 100 240, -140 180 Z"
          fill="url(#ribbonGrad1)"
        />
        {/* Crisp specular highlight along the top folded ridge of Ribbon 1 */}
        <path
          d="M -140 20 C 140 80, 360 380, 720 410 C 1100 440, 1380 280, 1720 380"
          stroke="url(#ribbonEdge1)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Secondary Ribbon 2: Curves around the lower canvas area */}
        <path
          d="M -100 420 C 160 360, 420 620, 840 640 C 1220 660, 1480 520, 1740 620 L 1740 760 C 1440 670, 1180 790, 790 770 C 390 750, 140 540, -100 560 Z"
          fill="url(#ribbonGrad2)"
        />
        <path
          d="M -100 420 C 160 360, 420 620, 840 640 C 1220 660, 1480 520, 1740 620"
          stroke="url(#ribbonEdge1)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {/* ── Layer 3: 3D Floating Frosted Glass Cube with </> (Top Left) */}
      <div className="bg-float-element bg-cube-code-wrap">
        <svg
          className="bg-3d-cube-svg bg-3d-cube-svg--code"
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cubeTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#e0e7ff" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="cubeLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.65" />
            </linearGradient>
            <linearGradient id="cubeRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.55" />
            </linearGradient>
            <filter id="cubeShadow" x="-20%" y="-20%" width="150%" height="160%">
              <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#4338ca" floodOpacity="0.28" />
            </filter>
          </defs>

          <g filter="url(#cubeShadow)">
            {/* Left face */}
            <path
              d="M 28 62 L 80 92 L 80 142 L 28 112 Z"
              fill="url(#cubeLeftGrad)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.2"
            />
            {/* Right face */}
            <path
              d="M 80 92 L 132 62 L 132 112 L 80 142 Z"
              fill="url(#cubeRightGrad)"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.2"
            />
            {/* Top face (rounded bevel isometric rhombus) */}
            <path
              d="M 80 20 L 132 50 L 80 80 L 28 50 Z"
              fill="url(#cubeTopGrad)"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="1.5"
            />
            {/* Subtle inner glass highlight */}
            <path
              d="M 80 24 L 126 50 L 80 76 L 34 50 Z"
              fill="none"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="0.8"
            />

            {/* Embossed </> Code Icon on the top face */}
            <g transform="translate(80, 50) skewX(-26) scale(1, 0.6) translate(-80, -50)">
              <path
                d="M 68 44 L 58 50 L 68 56"
                stroke="#ffffff"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 77 41 L 83 59"
                stroke="#ffffff"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M 92 44 L 102 50 L 92 56"
                stroke="#ffffff"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </svg>
      </div>

      {/* ── Layer 4: 3D Floating Frosted Glass Cube with Diagram Tree (Right Side) */}
      <div className="bg-float-element bg-cube-tree-wrap">
        <svg
          className="bg-3d-cube-svg bg-3d-cube-svg--tree"
          viewBox="0 0 170 170"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="treeCubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.88" />
              <stop offset="50%" stopColor="#dbeafe" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="treeCubeLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="treeCubeRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.5" />
            </linearGradient>
            <filter id="treeCubeShadow" x="-20%" y="-20%" width="150%" height="160%">
              <feDropShadow dx="0" dy="20" stdDeviation="15" floodColor="#2563eb" floodOpacity="0.22" />
            </filter>
          </defs>

          <g filter="url(#treeCubeShadow)">
            <path
              d="M 32 68 L 85 98 L 85 150 L 32 120 Z"
              fill="url(#treeCubeLeft)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.2"
            />
            <path
              d="M 85 98 L 138 68 L 138 120 L 85 150 Z"
              fill="url(#treeCubeRight)"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.2"
            />
            <path
              d="M 85 24 L 138 54 L 85 86 L 32 54 Z"
              fill="url(#treeCubeTop)"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="1.5"
            />

            {/* Embossed Architecture Flowchart Tree on top face */}
            <g transform="translate(85, 54) skewX(-24) scale(1, 0.62) translate(-85, -54)">
              {/* Root node */}
              <rect x="75" y="34" width="20" height="12" rx="3" fill="#ffffff" fillOpacity="0.9" />
              {/* Stem down */}
              <line x1="85" y1="46" x2="85" y2="54" stroke="#ffffff" strokeWidth="2.4" />
              {/* Horizontal bar */}
              <line x1="68" y1="54" x2="102" y2="54" stroke="#ffffff" strokeWidth="2.4" />
              {/* Branches down */}
              <line x1="68" y1="54" x2="68" y2="60" stroke="#ffffff" strokeWidth="2.4" />
              <line x1="102" y1="54" x2="102" y2="60" stroke="#ffffff" strokeWidth="2.4" />
              {/* Left child node */}
              <rect x="58" y="60" width="20" height="12" rx="3" fill="#ffffff" fillOpacity="0.9" />
              {/* Right child node */}
              <rect x="92" y="60" width="20" height="12" rx="3" fill="#ffffff" fillOpacity="0.9" />
            </g>
          </g>
        </svg>
      </div>

      {/* ── Layer 5: Floating Glossy 3D Purple/Violet Spheres ─────── */}
      {/* Large right glossy purple sphere */}
      <div className="bg-float-element bg-sphere bg-sphere--right" />
      {/* Small left soft lavender sphere */}
      <div className="bg-float-element bg-sphere bg-sphere--left" />

      {/* ── Layer 6: Smaller Floating Crystal Cubes ────────────────── */}
      <div className="bg-float-element bg-mini-cube bg-mini-cube--1" />
      <div className="bg-float-element bg-mini-cube bg-mini-cube--2" />
    </div>
  )
}
