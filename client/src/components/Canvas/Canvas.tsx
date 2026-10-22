import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { CanvasElement, HexColor, NewCanvasElement, Point, StickyElement, TextElement, Tool } from '../../types/canvas'
import { hitTest, renderElement, getElementBounds } from '../../utils/renderElement'
import { nanoid } from '../../utils/nanoid'
import './Canvas.css'

// ============================================================
// Canvas
// Interactive Whiteboard Surface
// ============================================================

interface CanvasProps {
  elements: CanvasElement[]
  selectedId: string | null
  tool: Tool
  color: HexColor
  strokeWidth: number
  onAdd: (el: NewCanvasElement) => void
  onUpdate?: (id: string, updates: Partial<CanvasElement>) => void
  onRemove: (id: string) => void
  onSelect: (id: string | null) => void
}

type DraftElement = CanvasElement | null

const TOOL_CURSOR: Record<Tool, string> = {
  pen: 'crosshair',
  line: 'crosshair',
  rectangle: 'crosshair',
  circle: 'crosshair',
  sticky: 'copy',
  text: 'text',
  select: 'default',
  eraser: 'cell',
}

const STICKY_PALETTES = [
  { name: 'Amber', noteColor: '#fef3c7', stroke: '#f59e0b' },
  { name: 'Blue', noteColor: '#dbeafe', stroke: '#3b82f6' },
  { name: 'Emerald', noteColor: '#d1fae5', stroke: '#10b981' },
  { name: 'Purple', noteColor: '#ede9fe', stroke: '#8b5cf6' },
  { name: 'Rose', noteColor: '#ffe4e6', stroke: '#f43f5e' },
]

export default function Canvas({
  elements,
  selectedId,
  tool,
  color,
  strokeWidth,
  onAdd,
  onUpdate,
  onRemove,
  onSelect,
}: CanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [draft, setDraft] = useState<DraftElement>(null)
  const isDrawing = useRef(false)
  const startPoint = useRef<Point>({ x: 0, y: 0 })

  // Dragging elements state
  const isDraggingElement = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  const activeDragId = useRef<string | null>(null)
  const dragStartPt = useRef<Point>({ x: 0, y: 0 })
  const [isHoveringElement, setIsHoveringElement] = useState(false)

  // Direct Inline Editing state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  // ── Canvas resize ─────────────────────────────────────────
  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrapper || !canvas) return

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return
      const { width, height } = entry.contentRect
      canvas.width = Math.floor(width)
      canvas.height = Math.floor(height)
    })

    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [])

  // ── Render loop ───────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const el of elements) {
      renderElement(ctx, el, el.id === selectedId)
    }
    if (draft) {
      renderElement(ctx, draft, false)
    }
  }, [elements, draft, selectedId])

  // ── Coordinate helper ─────────────────────────────────────
  const getPoint = useCallback((e: React.PointerEvent): Point => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  // ── Keyboard: Delete selected element ────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && !editingId) {
        onRemove(selectedId)
        onSelect(null)
      }
      if (e.key === 'Escape') {
        if (editingId) {
          setEditingId(null)
        } else {
          onSelect(null)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, editingId, onRemove, onSelect])

  // Commit inline text edits
  const handleCommitEdit = useCallback(() => {
    if (editingId && onUpdate) {
      onUpdate(editingId, { text: editingText })
    }
    setEditingId(null)
  }, [editingId, editingText, onUpdate])

  // ── Double-click to edit sticky or text ───────────────────
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current!.getBoundingClientRect()
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top

      const hit = [...elements].reverse().find((el) => hitTest(el, px, py))
      if (hit && (hit.type === 'sticky' || hit.type === 'text')) {
        setEditingId(hit.id)
        setEditingText(hit.text || '')
      }
    },
    [elements],
  )

  // ── Pointer down: start drawing or dragging ───────────────
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return
      e.currentTarget.setPointerCapture(e.pointerId)

      // Commit any active inline edit before starting new interaction
      if (editingId) {
        handleCommitEdit()
      }

      const pt = getPoint(e)
      isDrawing.current = true
      startPoint.current = pt

      // ── Select tool: select and initiate drag ─────────────
      if (tool === 'select') {
        const hit = [...elements].reverse().find((el) => hitTest(el, pt.x, pt.y))
        if (hit) {
          onSelect(hit.id)
          isDraggingElement.current = true
          setIsDragging(true)
          activeDragId.current = hit.id
          dragStartPt.current = pt
        } else {
          onSelect(null)
          isDraggingElement.current = false
          setIsDragging(false)
          activeDragId.current = null
        }
        return
      }

      // ── Eraser tool ───────────────────────────────────────
      if (tool === 'eraser') {
        const hit = [...elements].reverse().find((el) => hitTest(el, pt.x, pt.y))
        if (hit) onRemove(hit.id)
        return
      }

      // ── Drawing tools: create draft ───────────────────────
      const base = { id: nanoid(), color, strokeWidth }

      switch (tool) {
        case 'pen':
          setDraft({ ...base, type: 'pen', points: [pt] })
          break
        case 'line':
          setDraft({ ...base, type: 'line', x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y })
          break
        case 'rectangle':
          setDraft({ ...base, type: 'rectangle', x: pt.x, y: pt.y, width: 0, height: 0, fill: null })
          break
        case 'circle':
          setDraft({ ...base, type: 'circle', cx: pt.x, cy: pt.y, radius: 0, fill: null })
          break
        case 'sticky': {
          isDrawing.current = false
          onAdd({
            type: 'sticky',
            color: '#f59e0b',
            strokeWidth: 1.5,
            x: pt.x,
            y: pt.y,
            width: 200,
            height: 124,
            noteColor: '#fef3c7',
            text: '💡 Architecture Note\n• High cohesion\n• Async messaging\n• Low coupling',
          })
          break
        }
        case 'text': {
          isDrawing.current = false
          const newId = nanoid()
          onAdd({
            type: 'text',
            color,
            strokeWidth: 1,
            x: pt.x,
            y: pt.y,
            text: 'Service Endpoint',
            fontSize: 16,
          })
          // Auto-trigger editing on the newly placed text
          setEditingId(newId)
          setEditingText('Service Endpoint')
          break
        }
      }
    },
    [tool, color, strokeWidth, elements, editingId, handleCommitEdit, onSelect, onRemove, onAdd, getPoint],
  )

  // ── Pointer move: update draft or drag element ────────────
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const pt = getPoint(e)

      // Hover check for cursor in select mode
      if (tool === 'select' && !isDraggingElement.current) {
        const hit = elements.some((el) => hitTest(el, pt.x, pt.y))
        setIsHoveringElement(hit)
      }

      // Dragging active element
      if (isDraggingElement.current && activeDragId.current && onUpdate) {
        const dx = pt.x - dragStartPt.current.x
        const dy = pt.y - dragStartPt.current.y

        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          const el = elements.find((item) => item.id === activeDragId.current)
          if (el) {
            let updates: Partial<CanvasElement> = {}
            if (el.type === 'sticky' || el.type === 'text') {
              updates = { x: el.x + dx, y: el.y + dy }
            } else if (el.type === 'rectangle') {
              updates = { x: el.x + dx, y: el.y + dy }
            } else if (el.type === 'circle') {
              updates = { cx: el.cx + dx, cy: el.cy + dy }
            } else if (el.type === 'line') {
              updates = {
                x1: el.x1 + dx,
                y1: el.y1 + dy,
                x2: el.x2 + dx,
                y2: el.y2 + dy,
              }
            } else if (el.type === 'pen') {
              updates = {
                points: el.points.map((p) => ({ x: p.x + dx, y: p.y + dy })),
              }
            }
            onUpdate(el.id, updates)
            dragStartPt.current = pt
          }
        }
        return
      }

      if (!isDrawing.current) return

      // Erase-on-paint
      if (tool === 'eraser') {
        const hit = [...elements].reverse().find((el) => hitTest(el, pt.x, pt.y))
        if (hit) onRemove(hit.id)
        return
      }

      // Drawing drafts
      setDraft((prev) => {
        if (!prev) return prev
        switch (prev.type) {
          case 'pen':
            return { ...prev, points: [...prev.points, pt] }
          case 'line':
            return { ...prev, x2: pt.x, y2: pt.y }
          case 'rectangle':
            return {
              ...prev,
              width: pt.x - startPoint.current.x,
              height: pt.y - startPoint.current.y,
            }
          case 'circle': {
            const dx = pt.x - startPoint.current.x
            const dy = pt.y - startPoint.current.y
            return { ...prev, radius: Math.hypot(dx, dy) }
          }
          default:
            return prev
        }
      })
    },
    [tool, elements, onRemove, onUpdate, getPoint],
  )

  // ── Pointer up: commit draft or end drag ──────────────────
  const handlePointerUp = useCallback(() => {
    isDraggingElement.current = false
    setIsDragging(false)
    activeDragId.current = null

    if (!isDrawing.current) return
    isDrawing.current = false

    if (draft) {
      const isTrivial =
        (draft.type === 'pen' && draft.points.length < 2) ||
        (draft.type === 'rectangle' && Math.abs(draft.width) < 2 && Math.abs(draft.height) < 2) ||
        (draft.type === 'circle' && draft.radius < 2) ||
        (draft.type === 'line' &&
          Math.abs(draft.x2 - draft.x1) < 2 &&
          Math.abs(draft.y2 - draft.y1) < 2)

      if (!isTrivial) {
        const { id: _id, ...rest } = draft
        onAdd(rest as NewCanvasElement)
      }
    }
    setDraft(null)
  }, [draft, onAdd])

  // Find currently selected element and editing element
  const selectedElement = elements.find((el) => el.id === selectedId)
  const editingElement = elements.find((el) => el.id === editingId)

  // Bounds for floating toolbar and inline editor
  const selectedBounds = selectedElement ? getElementBounds(selectedElement) : null
  const editingBounds = editingElement ? getElementBounds(editingElement) : null

  // Active cursor
  let activeCursor = TOOL_CURSOR[tool]
  if (tool === 'select') {
    if (isDragging) activeCursor = 'grabbing'
    else if (isHoveringElement) activeCursor = 'grab'
  }

  return (
    <div ref={wrapperRef} className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        className="canvas-wrapper__canvas"
        style={{ cursor: activeCursor }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onDoubleClick={handleDoubleClick}
      />

      {/* Floating Action Bar for Selected Elements */}
      {selectedElement && selectedBounds && !editingId && (
        <div
          className="canvas-floating-bar"
          style={{
            left: Math.max(10, selectedBounds.x),
            top: Math.max(10, selectedBounds.y - 42),
          }}
        >
          {selectedElement.type === 'sticky' && (
            <div className="canvas-color-swatches">
              {STICKY_PALETTES.map((pal) => (
                <button
                  key={pal.name}
                  className="canvas-color-swatch-dot"
                  style={{
                    backgroundColor: pal.noteColor,
                    borderColor: pal.stroke,
                  }}
                  title={`Color: ${pal.name}`}
                  onClick={() => {
                    onUpdate?.(selectedElement.id, {
                      noteColor: pal.noteColor,
                      color: pal.stroke,
                    })
                  }}
                />
              ))}
              <div className="canvas-bar-divider" />
            </div>
          )}

          {(selectedElement.type === 'sticky' || selectedElement.type === 'text') && (
            <button
              className="canvas-bar-btn"
              onClick={() => {
                setEditingId(selectedElement.id)
                setEditingText(selectedElement.text || '')
              }}
              title="Edit text content"
            >
              ✏️ Edit
            </button>
          )}

          <button
            className="canvas-bar-btn canvas-bar-btn--delete"
            onClick={() => {
              onRemove(selectedElement.id)
              onSelect(null)
            }}
            title="Delete element"
          >
            🗑️ Delete
          </button>
        </div>
      )}

      {/* Direct Inline Editor for Sticky / Text */}
      {editingElement && editingBounds && (
        <div
          className="canvas-inline-editor-wrap"
          style={{
            left: editingBounds.x,
            top: editingBounds.y,
            width: Math.max(editingBounds.width, 160),
            height: Math.max(editingBounds.height, 60),
          }}
        >
          {editingElement.type === 'sticky' ? (
            <textarea
              className="canvas-inline-textarea"
              style={{
                backgroundColor: (editingElement as StickyElement).noteColor || '#fef3c7',
                color: '#0f172a',
              }}
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              onBlur={handleCommitEdit}
              autoFocus
              placeholder="Type note text..."
            />
          ) : (
            <input
              type="text"
              className="canvas-inline-input"
              style={{
                color: editingElement.color || '#0f172a',
                fontSize: `${(editingElement as TextElement).fontSize || 16}px`,
              }}
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              onBlur={handleCommitEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCommitEdit()
              }}
              autoFocus
            />
          )}
          <div className="canvas-inline-editor-footer">
            <span>Press Esc or click outside to save</span>
            <button className="canvas-inline-done-btn" onClick={handleCommitEdit}>
              Done ✓
            </button>
          </div>
        </div>
      )}

      {/* Empty-state hint */}
      {elements.length === 0 && !draft && (
        <div className="canvas-wrapper__empty">
          <div className="canvas-empty-hint">
            <div className="canvas-empty-hint__icon">✏️</div>
            <p className="canvas-empty-hint__text">
              Select a tool or template and start drawing
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
