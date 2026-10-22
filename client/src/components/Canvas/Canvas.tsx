import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { CanvasElement, HexColor, Point, Tool } from '../../types/canvas'
import { hitTest, renderElement } from '../../utils/renderElement'
import { nanoid } from '../../utils/nanoid'
import './Canvas.css'

// ============================================================
// Canvas
// The drawing surface. Handles:
//  - Rendering all committed elements + the in-progress draft
//  - Mouse/pointer events for every tool
//  - Automatic resize when the container changes size
//
// Props:
//  elements    — the committed element list (owned by parent)
//  selectedId  — which element is selected (owned by parent)
//  tool        — active tool
//  color       — current stroke/fill colour
//  strokeWidth — current stroke width
//  onAdd       — called when user finishes drawing a new element
//  onRemove    — called when eraser or Delete key removes an element
//  onSelect    — called when user clicks to select an element
// ============================================================

interface CanvasProps {
  elements: CanvasElement[]
  selectedId: string | null
  tool: Tool
  color: HexColor
  strokeWidth: number
  onAdd: (el: Omit<CanvasElement, 'id'>) => void
  onRemove: (id: string) => void
  onSelect: (id: string | null) => void
}

// Draft element — in-progress drawing, not yet committed.
type DraftElement = CanvasElement | null

// Maps each tool to the CSS cursor style to show.
const TOOL_CURSOR: Record<Tool, string> = {
  pen: 'crosshair',
  line: 'crosshair',
  rectangle: 'crosshair',
  circle: 'crosshair',
  select: 'default',
  eraser: 'cell',
}

export default function Canvas({
  elements,
  selectedId,
  tool,
  color,
  strokeWidth,
  onAdd,
  onRemove,
  onSelect,
}: CanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // The element currently being drawn (not yet added to elements[])
  const [draft, setDraft] = useState<DraftElement>(null)
  const isDrawing = useRef(false)
  const startPoint = useRef<Point>({ x: 0, y: 0 })

  // ── Canvas resize ─────────────────────────────────────────
  // The canvas pixel dimensions must match its CSS display size.
  // If they don't, drawings will appear scaled/stretched.
  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrapper || !canvas) return

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return
      const { width, height } = entry.contentRect
      canvas.width = Math.floor(width)
      canvas.height = Math.floor(height)
      // Resize clears the canvas, so we redraw on the next render cycle.
    })

    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [])

  // ── Render loop ───────────────────────────────────────────
  // Every time elements, draft, or selectedId changes, clear the
  // canvas and redraw from scratch. This is correct and performant
  // for this scale — optimisation (dirty regions, layers) can come later.
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
  // Mouse events give positions relative to the viewport.
  // We need positions relative to the canvas element.
  const getPoint = useCallback((e: React.PointerEvent): Point => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  // ── Keyboard: Delete selected element ────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        onRemove(selectedId)
        onSelect(null)
      }
      // Escape clears selection
      if (e.key === 'Escape') {
        onSelect(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, onRemove, onSelect])

  // ── Pointer down: start drawing ───────────────────────────
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      // Only handle left mouse button / single touch
      if (e.button !== 0 && e.pointerType === 'mouse') return
      e.currentTarget.setPointerCapture(e.pointerId)

      const pt = getPoint(e)
      isDrawing.current = true
      startPoint.current = pt

      // ── Select tool ───────────────────────────────────────
      if (tool === 'select') {
        // Walk elements in reverse (top-most first)
        const hit = [...elements].reverse().find((el) => hitTest(el, pt.x, pt.y))
        onSelect(hit ? hit.id : null)
        return
      }

      // ── Eraser tool ───────────────────────────────────────
      if (tool === 'eraser') {
        const hit = [...elements].reverse().find((el) => hitTest(el, pt.x, pt.y))
        if (hit) onRemove(hit.id)
        return
      }

      // ── Drawing tools: create the initial draft element ───
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
      }
    },
    [tool, color, strokeWidth, elements, onSelect, onRemove, getPoint],
  )

  // ── Pointer move: update the draft element ────────────────
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing.current) return

      const pt = getPoint(e)

      // Erase-on-paint: while eraser is held down, remove elements under cursor
      if (tool === 'eraser') {
        const hit = [...elements].reverse().find((el) => hitTest(el, pt.x, pt.y))
        if (hit) onRemove(hit.id)
        return
      }

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
    [tool, elements, onRemove, getPoint],
  )

  // ── Pointer up: commit the draft ──────────────────────────
  const handlePointerUp = useCallback(() => {
    if (!isDrawing.current) return
    isDrawing.current = false

    if (draft) {
      // Discard tiny accidental marks
      const isTrivial =
        (draft.type === 'pen' && draft.points.length < 2) ||
        (draft.type === 'rectangle' && Math.abs(draft.width) < 2 && Math.abs(draft.height) < 2) ||
        (draft.type === 'circle' && draft.radius < 2) ||
        (draft.type === 'line' &&
          Math.abs(draft.x2 - draft.x1) < 2 &&
          Math.abs(draft.y2 - draft.y1) < 2)

      if (!isTrivial) {
        // Remove the id from the draft before passing to onAdd
        // (onAdd will assign a stable id via the reducer)
        const { id: _id, ...rest } = draft
        onAdd(rest as Omit<CanvasElement, 'id'>)
      }
    }
    setDraft(null)
  }, [draft, onAdd])

  return (
    <div ref={wrapperRef} className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        className="canvas-wrapper__canvas"
        style={{ cursor: TOOL_CURSOR[tool] }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      {/* Empty-state hint */}
      {elements.length === 0 && !draft && (
        <div className="canvas-wrapper__empty">
          <div className="canvas-empty-hint">
            <div className="canvas-empty-hint__icon">✏️</div>
            <p className="canvas-empty-hint__text">
              Select a tool and start drawing
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
