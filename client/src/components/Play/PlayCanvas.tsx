import { useRef, useState, useEffect, useCallback } from 'react'
import type { DrawStroke } from '../../types/play'
import './PlayCanvas.css'

interface PlayCanvasProps {
  isDrawer: boolean
  drawerName: string
  secretWord?: string
  wordHint: string
  timeLeft: number
  totalTime: number
  roundNumber: number
  totalRounds: number
  strokes: DrawStroke[]
  onAddStroke: (stroke: DrawStroke) => void
  onClear: () => void
  onUndo: () => void
}

const PALETTE = [
  '#000000', // Black
  '#64748b', // Slate
  '#ffffff', // White
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#10b981', // Green
  '#06b6d4', // Cyan
  '#2563eb', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#78350f', // Brown
]

const BRUSH_SIZES = [3, 6, 12, 24]

export default function PlayCanvas({
  isDrawer,
  drawerName,
  secretWord,
  wordHint,
  timeLeft,
  totalTime,
  roundNumber,
  totalRounds,
  strokes,
  onAddStroke,
  onClear,
  onUndo,
}: PlayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isDrawingRef = useRef(false)
  const currentPointsRef = useRef<{ x: number; y: number }[]>([])

  const [activeTool, setActiveTool] = useState<'pen' | 'eraser'>('pen')
  const [selectedColor, setSelectedColor] = useState<string>('#000000')
  const [selectedSize, setSelectedSize] = useState<number>(6)

  // Re-draw all strokes onto the canvas
  const redrawAll = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Fill canvas background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw strokes
    strokes.forEach((stroke) => {
      if (stroke.points.length === 0) return
      ctx.beginPath()
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = stroke.size
      ctx.strokeStyle = stroke.tool === 'eraser' ? '#ffffff' : stroke.color

      const start = stroke.points[0]
      ctx.moveTo(start.x, start.y)

      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
      }
      ctx.stroke()
    })
  }, [strokes])

  // Resize canvas according to display width/height with 2x DPI sharpness
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    redrawAll()
  }, [redrawAll])

  // Redraw when strokes change
  useEffect(() => {
    redrawAll()
  }, [redrawAll])

  // Mouse & Touch events
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawer) return
    isDrawingRef.current = true
    const pt = getCanvasCoords(e)
    currentPointsRef.current = [pt]

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.beginPath()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = selectedSize
    ctx.strokeStyle = activeTool === 'eraser' ? '#ffffff' : selectedColor
    ctx.moveTo(pt.x, pt.y)
  }

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !isDrawer) return
    const pt = getCanvasCoords(e)
    currentPointsRef.current.push(pt)

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.lineTo(pt.x, pt.y)
    ctx.stroke()
  }

  const handlePointerUp = () => {
    if (!isDrawingRef.current || !isDrawer) return
    isDrawingRef.current = false

    if (currentPointsRef.current.length > 0) {
      onAddStroke({
        tool: activeTool,
        color: selectedColor,
        size: selectedSize,
        points: [...currentPointsRef.current],
      })
    }
    currentPointsRef.current = []
  }

  const progressFraction = Math.max(0, Math.min(1, timeLeft / totalTime))

  return (
    <div className="play-canvas-wrapper">
      {/* Top Game Bar: Round, Word Hint, and Timer */}
      <div className="play-canvas-topbar">
        {/* Round Badge */}
        <div className="play-topbar-round">
          <span className="play-topbar-round__label">ROUND</span>
          <span className="play-topbar-round__val">
            {roundNumber} / {totalRounds}
          </span>
        </div>

        {/* Word Display (Secret for drawer, or blanks for guesser) */}
        <div className="play-topbar-word">
          {isDrawer ? (
            <div className="play-drawer-word-pill">
              <span className="play-drawer-word-label">YOU ARE DRAWING:</span>
              <span className="play-drawer-word-text">{secretWord?.toUpperCase()}</span>
            </div>
          ) : (
            <div className="play-guesser-word-pill">
              <span className="play-guesser-hint-text">{wordHint}</span>
              <span className="play-guesser-len-text">
                ({secretWord ? secretWord.replace(/\s+/g, '').length : wordHint.split(' ').filter(c => c !== '').length} letters)
              </span>
            </div>
          )}
        </div>

        {/* Turn Timer */}
        <div className="play-topbar-timer">
          <div className="play-timer-circle">
            <span className={`play-timer-number ${timeLeft <= 10 ? 'play-timer-number--urgent' : ''}`}>
              {timeLeft}
            </span>
          </div>
          <div className="play-timer-progress">
            <div
              className={`play-timer-progress-fill ${timeLeft <= 10 ? 'play-timer-progress-fill--urgent' : ''}`}
              style={{ width: `${progressFraction * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Drawing Canvas Board */}
      <div className="play-canvas-board-container">
        <canvas
          ref={canvasRef}
          className={`play-canvas-element ${!isDrawer ? 'play-canvas-element--guesser' : ''}`}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        />

        {/* Guesser Overlay Banner */}
        {!isDrawer && (
          <div className="play-guesser-badge">
            <span className="play-guesser-badge__dot" />
            <span>{drawerName} is drawing... Guess in the chat!</span>
          </div>
        )}
      </div>

      {/* Bottom Drawing Toolbar (Only enabled for active drawer) */}
      <div className={`play-drawing-tools ${!isDrawer ? 'play-drawing-tools--disabled' : ''}`}>
        {/* Tool Selectors: Pen, Eraser */}
        <div className="play-tool-btn-group">
          <button
            className={`play-tool-btn ${activeTool === 'pen' ? 'play-tool-btn--active' : ''}`}
            onClick={() => setActiveTool('pen')}
            disabled={!isDrawer}
            title="Brush / Pen"
          >
            ✏️
          </button>
          <button
            className={`play-tool-btn ${activeTool === 'eraser' ? 'play-tool-btn--active' : ''}`}
            onClick={() => setActiveTool('eraser')}
            disabled={!isDrawer}
            title="Eraser"
          >
            🧹
          </button>
        </div>

        {/* Brush Sizes */}
        <div className="play-sizes-group">
          {BRUSH_SIZES.map((size) => (
            <button
              key={size}
              className={`play-size-btn ${selectedSize === size ? 'play-size-btn--active' : ''}`}
              onClick={() => setSelectedSize(size)}
              disabled={!isDrawer}
              title={`Size ${size}px`}
            >
              <span
                className="play-size-dot"
                style={{
                  width: `${Math.min(18, Math.max(5, size))}px`,
                  height: `${Math.min(18, Math.max(5, size))}px`,
                }}
              />
            </button>
          ))}
        </div>

        {/* Color Palette */}
        <div className="play-colors-group">
          {PALETTE.map((color) => (
            <button
              key={color}
              className={`play-color-swatch ${selectedColor === color && activeTool === 'pen' ? 'play-color-swatch--active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => {
                setSelectedColor(color)
                setActiveTool('pen')
              }}
              disabled={!isDrawer}
              title={color}
            />
          ))}

          {/* Native Color Picker */}
          <label className="play-color-custom-btn" title="Custom color picker">
            🎨
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => {
                setSelectedColor(e.target.value)
                setActiveTool('pen')
              }}
              disabled={!isDrawer}
              className="play-color-input-hidden"
            />
          </label>
        </div>

        {/* Action buttons: Undo & Clear */}
        <div className="play-actions-group">
          <button
            className="play-action-btn"
            onClick={onUndo}
            disabled={!isDrawer || strokes.length === 0}
            title="Undo last stroke"
          >
            ↩ Undo
          </button>
          <button
            className="play-action-btn play-action-btn--clear"
            onClick={onClear}
            disabled={!isDrawer || strokes.length === 0}
            title="Clear canvas"
          >
            🗑️ Clear
          </button>
        </div>
      </div>
    </div>
  )
}
