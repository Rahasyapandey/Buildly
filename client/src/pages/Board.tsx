import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Canvas from '../components/Canvas/Canvas'
import Toolbar from '../components/Toolbar/Toolbar'
import ExportModal from '../components/ExportModal/ExportModal'
import VoiceHuddle from '../components/VoiceHuddle/VoiceHuddle'
import { useBoardState } from '../hooks/useBoardState'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useTheme } from '../context/useTheme'
import type { HexColor, Tool } from '../types/canvas'
import './Board.css'

// ============================================================
// Board — the main workspace page (/board)
// ============================================================

export default function Board() {
  const { theme } = useTheme()
  const [searchParams] = useSearchParams()
  const boardName = searchParams.get('title') || 'Untitled Board'

  // ── Active mode (Build vs Connect Voice) ──────────────────
  const [activeMode, setActiveMode] = useState<'build' | 'connect'>('build')

  // ── Export Modal state ───────────────────────────────────
  const [isExportOpen, setIsExportOpen] = useState(false)

  // ── Toolbar state ─────────────────────────────────────────
  const [tool, setTool] = useState<Tool>('pen')
  // userColor is null if using theme default, or a specific hex chosen by the user
  const [userColor, setUserColor] = useState<HexColor | null>(null)
  const color = userColor ?? (theme === 'light' ? '#0f172a' : '#ffffff')
  const [strokeWidth, setStrokeWidth] = useState(2)

  // ── Board / elements state ────────────────────────────────
  const {
    elements,
    selectedId,
    canUndo,
    canRedo,
    addElement,
    removeElement,
    clearAll,
    undo,
    redo,
    setSelected,
  } = useBoardState()

  // ── Keyboard shortcuts ────────────────────────────────────
  useKeyboardShortcuts({ onToolChange: setTool, onUndo: undo, onRedo: redo })

  const modes = [
    { id: 'build',   icon: '🏗️', label: 'Build',   active: activeMode === 'build'   },
    { id: 'connect', icon: '🎙️', label: 'Connect', active: activeMode === 'connect', subtitle: 'Voice Only' },
    { id: 'play',    icon: '🎮', label: 'Play',    active: false, comingSoon: true },
  ]

  return (
    <div className="board-layout">
      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside className="sidebar">
        {/* Logo / home link back to Workspace Overview */}
        <Link to="/overview" className="sidebar__header" title="Back to Workspace Overview">
          <img src="/logo.png" alt="Buildly logo" className="sidebar__logo-img" />
          <span className="sidebar__logo-name">Buildly</span>
        </Link>

        {/* Mode switcher */}
        <span className="sidebar__section-label">Modes</span>
        <nav className="sidebar__modes">
          {modes.map((m) => (
            <button
              key={m.id}
              className={`sidebar__mode${m.active ? ' sidebar__mode--active' : ''}`}
              disabled={m.comingSoon}
              onClick={() => {
                if (m.id === 'build' || m.id === 'connect') {
                  setActiveMode(m.id)
                }
              }}
              title={m.comingSoon ? 'Coming soon' : m.label}
            >
              <span className="sidebar__mode-icon">{m.icon}</span>
              <span>{m.label}</span>
              {m.comingSoon && <span className="sidebar__mode-soon">Soon</span>}
              {m.subtitle && !m.comingSoon && (
                <span className="sidebar__mode-soon" style={{ color: '#10b981', opacity: 0.9 }}>
                  LIVE
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Boards */}
        <span className="sidebar__section-label">Current Board</span>
        <div className="sidebar__boards">
          <button className="sidebar__board-item">
            📄 {boardName}
          </button>
          <button
            className="sidebar__mode"
            style={{ marginTop: '8px', cursor: 'pointer' }}
            onClick={() => setIsExportOpen(true)}
          >
            <span className="sidebar__mode-icon">📥</span>
            <span>Export Board (PDF)</span>
          </button>
          <Link
            to="/overview"
            className="sidebar__mode"
            style={{ marginTop: '4px', textDecoration: 'none' }}
          >
            <span className="sidebar__mode-icon">←</span>
            <span>All Boards</span>
          </Link>
        </div>

        <div className="sidebar__footer">
          <p className="sidebar__footer-text">
            Connect Mode: 🎙️ Voice Huddle active<br />
            <span style={{ opacity: 0.7 }}>Audio-only low latency</span>
          </p>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────── */}
      <div className="board-main" style={{ position: 'relative' }}>
        {/* Toolbar */}
        <Toolbar
          tool={tool}
          color={color}
          strokeWidth={strokeWidth}
          canUndo={canUndo}
          canRedo={canRedo}
          boardName={boardName}
          onToolChange={setTool}
          onColorChange={setUserColor}
          onStrokeWidthChange={setStrokeWidth}
          onUndo={undo}
          onRedo={redo}
          onClear={clearAll}
          onOpenExport={() => setIsExportOpen(true)}
        />

        {/* Canvas */}
        <Canvas
          elements={elements}
          selectedId={selectedId}
          tool={tool}
          color={color}
          strokeWidth={strokeWidth}
          onAdd={addElement}
          onRemove={removeElement}
          onSelect={setSelected}
        />

        {/* Floating Voice Huddle (Connect Mode - Voice Only) */}
        <VoiceHuddle />

        {/* Export Diagram Modal (PDF, PNG, SVG, JSON) */}
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          boardName={boardName}
          elements={elements}
          theme={theme}
        />
      </div>
    </div>
  )
}
