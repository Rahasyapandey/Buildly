import type { HexColor, Tool } from '../../types/canvas'
import './Toolbar.css'

// ============================================================
// Toolbar
// The horizontal bar at the top of the Board workspace.
// Contains tool selection, colour picker, stroke width, and
// undo/redo/clear actions.
//
// All state (selected tool, colour, strokeWidth) lives in the
// parent (Board.tsx) — Toolbar is fully controlled.
// ============================================================

// Colour palette — the preset swatches shown in the toolbar.
const PALETTE: HexColor[] = [
  '#ffffff', // white
  '#f87171', // red
  '#fb923c', // orange
  '#facc15', // yellow
  '#4ade80', // green
  '#60a5fa', // blue
  '#c084fc', // purple
  '#f472b6', // pink
  '#94a3b8', // slate
  '#0f1117', // near-black
]

// Stroke width options: [display size in px (for the dot), actual stroke value]
const WIDTHS: Array<{ dot: number; value: number; label: string }> = [
  { dot: 4,  value: 2,  label: 'Thin'   },
  { dot: 7,  value: 5,  label: 'Medium' },
  { dot: 11, value: 10, label: 'Thick'  },
  { dot: 16, value: 20, label: 'Bold'   },
]

// Tool definitions: icon, label, tooltip
const TOOLS: Array<{ id: Tool; icon: string; label: string; title: string }> = [
  { id: 'pen',       icon: '✏️', label: 'Pen',    title: 'Freehand pen (P)' },
  { id: 'line',      icon: '╱',  label: 'Line',   title: 'Straight line (L)' },
  { id: 'rectangle', icon: '▭',  label: 'Rect',   title: 'Rectangle (R)' },
  { id: 'circle',    icon: '○',  label: 'Circle', title: 'Circle (C)' },
  { id: 'select',    icon: '↖',  label: 'Select', title: 'Select element (S)' },
  { id: 'eraser',    icon: '⌫',  label: 'Erase',  title: 'Eraser (E)' },
]

interface ToolbarProps {
  tool: Tool
  color: HexColor
  strokeWidth: number
  canUndo: boolean
  canRedo: boolean
  boardName: string
  onToolChange: (tool: Tool) => void
  onColorChange: (color: HexColor) => void
  onStrokeWidthChange: (w: number) => void
  onUndo: () => void
  onRedo: () => void
  onClear: () => void
}

export default function Toolbar({
  tool,
  color,
  strokeWidth,
  canUndo,
  canRedo,
  boardName,
  onToolChange,
  onColorChange,
  onStrokeWidthChange,
  onUndo,
  onRedo,
  onClear,
}: ToolbarProps) {
  return (
    <header className="toolbar" role="toolbar" aria-label="Drawing tools">

      {/* ── Drawing tools ─────────────────────────────────── */}
      {TOOLS.map((t) => (
        <button
          key={t.id}
          className={`toolbar__tool${tool === t.id ? ' toolbar__tool--active' : ''}`}
          onClick={() => onToolChange(t.id)}
          title={t.title}
          aria-pressed={tool === t.id}
        >
          <span aria-hidden="true">{t.icon}</span>
          <span className="toolbar__tool-label">{t.label}</span>
        </button>
      ))}

      <div className="toolbar__divider" />

      {/* ── Colour palette ────────────────────────────────── */}
      <div className="toolbar__colors" role="group" aria-label="Colour">
        {PALETTE.map((c) => (
          <button
            key={c}
            className={`toolbar__swatch${color === c ? ' toolbar__swatch--active' : ''}`}
            style={{ background: c }}
            onClick={() => onColorChange(c)}
            title={c}
            aria-label={`Colour ${c}`}
            aria-pressed={color === c}
          />
        ))}
        {/* Native colour picker for custom colours */}
        <input
          type="color"
          className="toolbar__color-input"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          title="Custom colour"
          aria-label="Custom colour"
        />
      </div>

      <div className="toolbar__divider" />

      {/* ── Stroke width ──────────────────────────────────── */}
      <div className="toolbar__widths" role="group" aria-label="Stroke width">
        {WIDTHS.map(({ dot, value, label }) => (
          <button
            key={value}
            className={`toolbar__width-btn${strokeWidth === value ? ' toolbar__width-btn--active' : ''}`}
            onClick={() => onStrokeWidthChange(value)}
            title={label}
            aria-label={`Stroke width: ${label}`}
            aria-pressed={strokeWidth === value}
          >
            <span
              className="toolbar__width-dot"
              style={{ width: dot, height: dot }}
            />
          </button>
        ))}
      </div>

      <div className="toolbar__divider" />

      {/* ── History actions ───────────────────────────────── */}
      <button
        className="toolbar__action"
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        aria-label="Undo"
      >
        ↩
      </button>
      <button
        className="toolbar__action"
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Shift+Z)"
        aria-label="Redo"
      >
        ↪
      </button>

      <div className="toolbar__divider" />

      {/* ── Clear all ────────────────────────────────────── */}
      <button
        className="toolbar__action toolbar__action--danger"
        onClick={onClear}
        title="Clear canvas"
        aria-label="Clear all"
      >
        🗑
      </button>

      {/* ── Board name ───────────────────────────────────── */}
      <span className="toolbar__board-name">{boardName}</span>
    </header>
  )
}
