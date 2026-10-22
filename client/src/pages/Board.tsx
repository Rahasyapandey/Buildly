import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Canvas from '../components/Canvas/Canvas'
import Toolbar from '../components/Toolbar/Toolbar'
import ExportModal from '../components/ExportModal/ExportModal'
import VoiceHuddle from '../components/VoiceHuddle/VoiceHuddle'
import { useBoardState } from '../hooks/useBoardState'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useTheme } from '../context/useTheme'
import { useAuth } from '../hooks/useAuth'
import { useCollaboration } from '../hooks/useCollaboration'
import { api, toCanvasElement } from '../utils/api'
import { nanoid } from '../utils/nanoid'
import { getTemplateElements } from '../utils/boardTemplates'
import type { CanvasElement, HexColor, NewCanvasElement, Tool } from '../types/canvas'
import './Board.css'

// ============================================================
// Board — the main workspace page (/board)
// Fully integrated with FastAPI PostgreSQL backend + WebSockets
// ============================================================

export default function Board() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const boardName = searchParams.get('title') || 'Untitled Board'
  const initialBoardId = searchParams.get('id')

  // ── Cloud Database & Real-Time Sync State ─────────────────
  const [cloudBoardId, setCloudBoardId] = useState<string | null>(initialBoardId)
  const [isSaving, setIsSaving] = useState(false)
  const isInitialLoad = useRef(true)
  const [anonymousUserId] = useState(() => `dev-${nanoid(5)}`)
  const currentUserId = user?.id || anonymousUserId

  // ── Active mode (Build vs Connect Voice) ──────────────────
  const [activeMode, setActiveMode] = useState<'build' | 'connect'>('build')

  // ── Export Modal state ───────────────────────────────────
  const [isExportOpen, setIsExportOpen] = useState(false)

  // ── Toolbar state ─────────────────────────────────────────
  const [tool, setTool] = useState<Tool>('pen')
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
    updateElement,
    removeElement,
    clearAll,
    undo,
    redo,
    loadElements,
    setSelected,
  } = useBoardState()

  // 1. Load board from cloud if board ID is in URL
  useEffect(() => {
    if (!cloudBoardId) return
    api.boards
      .get(cloudBoardId)
      .then((detail) => {
        if (detail.elements && detail.elements.length > 0) {
          loadElements(detail.elements.map(toCanvasElement))
        }
      })
      .catch((err) => {
        console.warn('Could not load board from backend, staying in local mode:', err)
      })
  }, [cloudBoardId, loadElements])

  // 2. Load template if specified in query params (and no cloud ID)
  useEffect(() => {
    if (cloudBoardId) return

    const templateParam = searchParams.get('template')
    if (templateParam) {
      const templateData = getTemplateElements(templateParam)
      if (templateData.length > 0) {
        loadElements(templateData)
      }
      return
    }

    const lowerTitle = boardName.toLowerCase()
    if (lowerTitle.includes('system architecture') || lowerTitle.includes('architecture map')) {
      loadElements(getTemplateElements('system-architecture'))
    } else if (lowerTitle.includes('uml')) {
      loadElements(getTemplateElements('uml-class'))
    } else if (lowerTitle.includes('erd') || lowerTitle.includes('database')) {
      loadElements(getTemplateElements('erd'))
    } else if (lowerTitle.includes('flowchart')) {
      loadElements(getTemplateElements('flowchart'))
    }
  }, [searchParams, boardName, cloudBoardId, loadElements])

  // 3. WebSocket Real-Time Collaboration
  const {
    connected: isLiveConnected,
    cursors,
    broadcastAdd,
    broadcastRemove,
    broadcastClear,
    broadcastCursor,
  } = useCollaboration({
    boardId: cloudBoardId,
    userId: currentUserId,
    onRemoteAdd: (el) => addElement(el),
    onRemoteRemove: (id) => removeElement(id),
    onRemoteClear: () => clearAll(),
  })

  // 4. Wrapped Element Actions for WebSocket broadcast
  const handleAdd = useCallback(
    (el: NewCanvasElement) => {
      addElement(el)
      if (cloudBoardId) {
        broadcastAdd(el as CanvasElement)
      }
    },
    [addElement, cloudBoardId, broadcastAdd],
  )

  const handleUpdate = useCallback(
    (id: string, updates: Partial<CanvasElement>) => {
      updateElement(id, updates)
    },
    [updateElement],
  )

  const handleRemove = useCallback(
    (id: string) => {
      removeElement(id)
      if (cloudBoardId) {
        broadcastRemove(id)
      }
    },
    [removeElement, cloudBoardId, broadcastRemove],
  )

  const handleClear = useCallback(() => {
    clearAll()
    if (cloudBoardId) {
      broadcastClear()
    }
  }, [clearAll, cloudBoardId, broadcastClear])

  // 5. Debounced auto-save to PostgreSQL REST API
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false
      return
    }
    if (!cloudBoardId) return

    const timer = setTimeout(() => {
      setIsSaving(true)
      api.elements
        .saveAll(cloudBoardId, elements)
        .then(() => setIsSaving(false))
        .catch(() => setIsSaving(false))
    }, 1200)

    return () => clearTimeout(timer)
  }, [elements, cloudBoardId])

  // 6. Save to cloud handler
  const handleSaveToCloud = async () => {
    try {
      setIsSaving(true)
      const newBoard = await api.boards.create(boardName)
      setCloudBoardId(newBoard.id)
      navigate(`/board?id=${newBoard.id}&title=${encodeURIComponent(newBoard.title)}`, {
        replace: true,
      })
      if (elements.length > 0) {
        await api.elements.saveAll(newBoard.id, elements)
      }
      setIsSaving(false)
    } catch (e) {
      setIsSaving(false)
      console.error('Error saving board to cloud:', e)
    }
  }

  // ── Keyboard shortcuts ────────────────────────────────────
  useKeyboardShortcuts({ onToolChange: setTool, onUndo: undo, onRedo: redo })

  interface ModeItem {
    id: string
    icon: string
    label: string
    active: boolean
    subtitle?: string
    comingSoon?: boolean
  }

  const modes: ModeItem[] = [
    { id: 'build',   icon: '🏗️', label: 'Build',   active: activeMode === 'build'   },
    { id: 'connect', icon: '🎙️', label: 'Connect', active: activeMode === 'connect', subtitle: 'Voice Only' },
    { id: 'play',    icon: '🎮', label: 'Play',    active: false, subtitle: 'Game Room' },
  ]

  return (
    <div
      className="board-layout"
      onPointerMove={(e) => {
        if (cloudBoardId && isLiveConnected) {
          const rect = e.currentTarget.getBoundingClientRect()
          broadcastCursor(e.clientX - rect.left, e.clientY - rect.top)
        }
      }}
    >
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
                } else if (m.id === 'play') {
                  navigate('/play')
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

        {/* Current Board & Cloud sync info */}
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
            {cloudBoardId ? (
              <span>☁️ Cloud Board: <strong>Active</strong></span>
            ) : (
              <span>💾 Local Workspace</span>
            )}
            <br />
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
          isCloudSynced={!!cloudBoardId}
          isSaving={isSaving}
          isLiveConnected={isLiveConnected}
          onSaveToCloud={handleSaveToCloud}
          onToolChange={setTool}
          onColorChange={setUserColor}
          onStrokeWidthChange={setStrokeWidth}
          onUndo={undo}
          onRedo={redo}
          onClear={handleClear}
          onOpenExport={() => setIsExportOpen(true)}
          onLoadTemplate={(id) => loadElements(getTemplateElements(id))}
        />

        {/* Canvas */}
        <Canvas
          elements={elements}
          selectedId={selectedId}
          tool={tool}
          color={color}
          strokeWidth={strokeWidth}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onRemove={handleRemove}
          onSelect={setSelected}
        />

        {/* Remote Cursors Overlay */}
        {Object.values(cursors).map((c) => (
          <div
            key={c.userId}
            className="remote-cursor-tag"
            style={{ left: c.x, top: c.y }}
          >
            <span className="remote-cursor-dot" />
            <span className="remote-cursor-label">
              {c.userId.slice(0, 8)}
            </span>
          </div>
        ))}

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
