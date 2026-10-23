import { useState, useRef, useEffect } from 'react'
import type { HexColor, Tool } from '../../types/canvas'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import UserMenu from '../Auth/UserMenu'
import {
  IconCloud,
  IconCloudUpload,
  IconDatabase,
  IconDiagram,
  IconDownload,
  IconPackage,
  IconPen,
  IconSticky,
  IconTrash,
  IconZap,
  StatusDot,
} from '../Icons/Icons'
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
  '#0f172a', // near-black / dark slate
  '#ffffff', // white
  '#2563eb', // blue
  '#7c3aed', // purple
  '#f87171', // red
  '#fb923c', // orange
  '#facc15', // yellow
  '#10b981', // green
  '#f472b6', // pink
  '#94a3b8', // slate
]

// Stroke width options: [display size in px (for the dot), actual stroke value]
const WIDTHS: Array<{ dot: number; value: number; label: string }> = [
  { dot: 4,  value: 2,  label: 'Thin'   },
  { dot: 7,  value: 5,  label: 'Medium' },
  { dot: 11, value: 10, label: 'Thick'  },
  { dot: 16, value: 20, label: 'Bold'   },
]

// Tool definitions: icon, label, tooltip
const TOOLS: Array<{ id: Tool; icon: React.ReactNode; label: string; title: string }> = [
  { id: 'select',    icon: '↖',  label: 'Select', title: 'Select element (S)' },
  { id: 'pen',       icon: <IconPen size={15} />, label: 'Pen',    title: 'Freehand pen (P)' },
  { id: 'line',      icon: '╱',  label: 'Line',   title: 'Straight line (L)' },
  { id: 'rectangle', icon: '▭',  label: 'Rect',   title: 'Rectangle (R)' },
  { id: 'circle',    icon: '○',  label: 'Circle', title: 'Circle (C)' },
  { id: 'sticky',    icon: <IconSticky size={15} />, label: 'Sticky', title: 'Sticky Note (K)' },
  { id: 'text',      icon: 'T',  label: 'Text',   title: 'Text Annotation (T)' },
  { id: 'eraser',    icon: '⌫',  label: 'Erase',  title: 'Eraser (E)' },
]

interface ToolbarProps {
  tool: Tool
  color: HexColor
  strokeWidth: number
  canUndo: boolean
  canRedo: boolean
  boardName: string
  isCloudSynced?: boolean
  isSaving?: boolean
  isLiveConnected?: boolean
  onSaveToCloud?: () => void
  onToolChange: (tool: Tool) => void
  onColorChange: (color: HexColor) => void
  onStrokeWidthChange: (w: number) => void
  onUndo: () => void
  onRedo: () => void
  onClear: () => void
  onOpenExport?: () => void
  onLoadTemplate?: (templateId: string) => void
}

export default function Toolbar({
  tool,
  color,
  strokeWidth,
  canUndo,
  canRedo,
  boardName,
  isCloudSynced = false,
  isSaving = false,
  isLiveConnected = false,
  onSaveToCloud,
  onToolChange,
  onColorChange,
  onStrokeWidthChange,
  onUndo,
  onRedo,
  onClear,
  onOpenExport,
  onLoadTemplate,
}: ToolbarProps) {
  const [showTemplates, setShowTemplates] = useState(false)
  const templateMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (templateMenuRef.current && !templateMenuRef.current.contains(e.target as Node)) {
        setShowTemplates(false)
      }
    }
    if (showTemplates) {
      document.addEventListener('mousedown', handleOutside)
    }
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [showTemplates])
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
        <IconTrash size={15} />
      </button>

      <div className="toolbar__divider" />

      {/* ── Diagram Templates Dropdown ────────────────────── */}
      <div className="toolbar__template-wrap" ref={templateMenuRef}>
        <button
          className={`toolbar__action toolbar__template-btn ${showTemplates ? 'toolbar__action--active' : ''}`}
          onClick={() => setShowTemplates((prev) => !prev)}
          title="Insert Engineering Diagram Template"
          aria-expanded={showTemplates}
        >
          <IconDiagram size={15} />
          <span>Templates</span>
          <span style={{ fontSize: '12px', opacity: 0.7 }}>▾</span>
        </button>

        {showTemplates && (
          <div className="toolbar__template-menu" role="menu">
            <div className="toolbar__template-menu-title">Diagram Presets</div>
            <button
              className="toolbar__template-menu-item"
              onClick={() => {
                onLoadTemplate?.('system-architecture')
                setShowTemplates(false)
              }}
            >
              <span className="tb-menu-icon"><IconCloud size={17} /></span>
              <div>
                <div className="tb-menu-label">System Architecture</div>
                <div className="tb-menu-sub">Client, Gateway, FastAPI, DB</div>
              </div>
            </button>
            <button
              className="toolbar__template-menu-item"
              onClick={() => {
                onLoadTemplate?.('uml-class')
                setShowTemplates(false)
              }}
            >
              <span className="tb-menu-icon"><IconPackage size={17} /></span>
              <div>
                <div className="tb-menu-label">UML Domain Model</div>
                <div className="tb-menu-sub">User, Board, Classes</div>
              </div>
            </button>
            <button
              className="toolbar__template-menu-item"
              onClick={() => {
                onLoadTemplate?.('erd')
                setShowTemplates(false)
              }}
            >
              <span className="tb-menu-icon"><IconDatabase size={17} /></span>
              <div>
                <div className="tb-menu-label">Database Schema (ERD)</div>
                <div className="tb-menu-sub">Postgres Relational Tables</div>
              </div>
            </button>
            <button
              className="toolbar__template-menu-item"
              onClick={() => {
                onLoadTemplate?.('flowchart')
                setShowTemplates(false)
              }}
            >
              <span className="tb-menu-icon"><IconZap size={17} /></span>
              <div>
                <div className="tb-menu-label">Auth & Sync Flowchart</div>
                <div className="tb-menu-sub">Session & Socket Pipeline</div>
              </div>
            </button>
          </div>
        )}
      </div>

      <div className="toolbar__divider" />

      {/* ── Cloud Sync Status / Action ───────────────────── */}
      {isCloudSynced ? (
        <div className={`toolbar__sync-badge ${isSaving ? 'toolbar__sync-badge--saving' : 'toolbar__sync-badge--synced'}`} title={isLiveConnected ? "Real-time WebSocket & Cloud DB Connected" : "PostgreSQL Cloud DB Synced"}>
          <StatusDot status={isSaving ? 'syncing' : 'online'} pulse={true} />
          <span>{isSaving ? 'Saving...' : (isLiveConnected ? 'Live Sync' : 'Cloud Synced')}</span>
        </div>
      ) : (
        onSaveToCloud && (
          <button
            className="toolbar__save-btn"
            onClick={onSaveToCloud}
            title="Save board to cloud database for cross-device access"
          >
            <IconCloudUpload size={14} />
            <span>Save Cloud</span>
          </button>
        )
      )}

      {/* ── Export Button ─────────────────────────────────── */}
      <button
        className="toolbar__action"
        onClick={onOpenExport}
        title="Download Diagram (PDF, PNG, SVG, JSON)"
        aria-label="Export Diagram"
        style={{ width: 'auto', padding: '0 10px', gap: '6px', fontSize: '13px', fontWeight: 600 }}
      >
        <IconDownload size={14} />
        <span>Export</span>
      </button>

      {/* ── Board name, Theme Toggle & User Menu ─────────── */}
      <span className="toolbar__board-name">{boardName}</span>
      <div className="toolbar__divider" />
      <ThemeToggle variant="icon" />
      <UserMenu variant="compact" />
    </header>
  )
}
