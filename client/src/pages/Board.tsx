import { useState } from 'react'
import { Link } from 'react-router-dom'
import Canvas from '../components/Canvas/Canvas'
import Toolbar from '../components/Toolbar/Toolbar'
import { useBoardState } from '../hooks/useBoardState'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import type { HexColor, Tool } from '../types/canvas'
import './Board.css'

// ============================================================
// Board — the main workspace page (/board)
//
// This component:
//  1. Owns all drawing state (elements, history, selection) via
//     the useBoardState hook.
//  2. Owns toolbar state (active tool, colour, strokeWidth).
//  3. Renders the sidebar, toolbar, and canvas in the correct layout.
//  4. Will connect to the REST API (Phase 3) and WebSockets (Phase 4)
//     from this component via additional hooks.
// ============================================================

const MODES = [
  { id: 'build',   icon: '🏗️', label: 'Build',   active: true  },
  { id: 'connect', icon: '📡', label: 'Connect', active: false },
  { id: 'play',    icon: '🎮', label: 'Play',    active: false },
]

export default function Board() {
  // ── Toolbar state ─────────────────────────────────────────
  const [tool, setTool] = useState<Tool>('pen')
  const [color, setColor] = useState<HexColor>('#ffffff')
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

  return (
    <div className="board-layout">
      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside className="sidebar">
        {/* Logo / home link */}
        <Link to="/" className="sidebar__header">
          <img src="/logo.png" alt="Buildly logo" className="sidebar__logo-img" />
          <span className="sidebar__logo-name">Buildly</span>
        </Link>

        {/* Mode switcher */}
        <span className="sidebar__section-label">Modes</span>
        <nav className="sidebar__modes">
          {MODES.map((m) => (
            <button
              key={m.id}
              className={`sidebar__mode${m.active ? ' sidebar__mode--active' : ''}`}
              disabled={!m.active}
              title={!m.active ? 'Coming soon' : m.label}
            >
              <span className="sidebar__mode-icon">{m.icon}</span>
              {m.label}
              {!m.active && <span className="sidebar__mode-soon">Soon</span>}
            </button>
          ))}
        </nav>

        {/* Boards */}
        <span className="sidebar__section-label">Boards</span>
        <div className="sidebar__boards">
          <button className="sidebar__board-item">
            📄 Untitled Board
          </button>
        </div>

        <div className="sidebar__footer">
          <p className="sidebar__footer-text">
            Phase 2 — Drawing Canvas<br />
            <span style={{ opacity: 0.6 }}>Phase 3: Save to DB →</span>
          </p>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────── */}
      <div className="board-main">
        {/* Toolbar */}
        <Toolbar
          tool={tool}
          color={color}
          strokeWidth={strokeWidth}
          canUndo={canUndo}
          canRedo={canRedo}
          boardName="Untitled Board"
          onToolChange={setTool}
          onColorChange={setColor}
          onStrokeWidthChange={setStrokeWidth}
          onUndo={undo}
          onRedo={redo}
          onClear={clearAll}
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
      </div>
    </div>
  )
}
