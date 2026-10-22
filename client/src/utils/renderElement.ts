import type { CanvasElement } from '../types/canvas'

// ============================================================
// renderElement
// Draws a single CanvasElement onto a 2D canvas context.
// Called by the Canvas component on every frame for every element.
// ============================================================

export function renderElement(
  ctx: CanvasRenderingContext2D,
  el: CanvasElement,
  isSelected = false,
): void {
  ctx.save()
  ctx.strokeStyle = el.color
  ctx.lineWidth = el.strokeWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  switch (el.type) {
    case 'pen': {
      if (el.points.length < 2) {
        // Single dot — draw a filled circle
        const [p] = el.points
        if (!p) break
        ctx.beginPath()
        ctx.arc(p.x, p.y, el.strokeWidth / 2, 0, Math.PI * 2)
        ctx.fillStyle = el.color
        ctx.fill()
        break
      }
      ctx.beginPath()
      ctx.moveTo(el.points[0].x, el.points[0].y)
      for (let i = 1; i < el.points.length; i++) {
        // Smooth curve through points using quadratic bezier
        const prev = el.points[i - 1]
        const curr = el.points[i]
        const midX = (prev.x + curr.x) / 2
        const midY = (prev.y + curr.y) / 2
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY)
      }
      ctx.stroke()
      break
    }

    case 'line': {
      ctx.beginPath()
      ctx.moveTo(el.x1, el.y1)
      ctx.lineTo(el.x2, el.y2)
      ctx.stroke()
      break
    }

    case 'rectangle': {
      ctx.beginPath()
      ctx.rect(el.x, el.y, el.width, el.height)
      if (el.fill) {
        ctx.fillStyle = el.fill
        ctx.fill()
      }
      ctx.stroke()
      break
    }

    case 'circle': {
      ctx.beginPath()
      ctx.arc(el.cx, el.cy, Math.abs(el.radius), 0, Math.PI * 2)
      if (el.fill) {
        ctx.fillStyle = el.fill
        ctx.fill()
      }
      ctx.stroke()
      break
    }
  }

  // ── Selection highlight ─────────────────────────────────────
  if (isSelected) {
    const bounds = getElementBounds(el)
    if (bounds) {
      ctx.strokeStyle = '#7c6af7'
      ctx.lineWidth = 2
      ctx.setLineDash([6, 3])
      const pad = 6
      ctx.strokeRect(
        bounds.x - pad,
        bounds.y - pad,
        bounds.width + pad * 2,
        bounds.height + pad * 2,
      )
      ctx.setLineDash([])
    }
  }

  ctx.restore()
}

// ============================================================
// getElementBounds
// Returns the axis-aligned bounding box of an element.
// Used for selection highlight and hit-testing.
// ============================================================
export function getElementBounds(el: CanvasElement): {
  x: number
  y: number
  width: number
  height: number
} | null {
  switch (el.type) {
    case 'pen': {
      if (el.points.length === 0) return null
      const xs = el.points.map((p) => p.x)
      const ys = el.points.map((p) => p.y)
      const minX = Math.min(...xs)
      const minY = Math.min(...ys)
      return {
        x: minX,
        y: minY,
        width: Math.max(...xs) - minX,
        height: Math.max(...ys) - minY,
      }
    }
    case 'line': {
      const minX = Math.min(el.x1, el.x2)
      const minY = Math.min(el.y1, el.y2)
      return {
        x: minX,
        y: minY,
        width: Math.abs(el.x2 - el.x1),
        height: Math.abs(el.y2 - el.y1),
      }
    }
    case 'rectangle': {
      return {
        x: Math.min(el.x, el.x + el.width),
        y: Math.min(el.y, el.y + el.height),
        width: Math.abs(el.width),
        height: Math.abs(el.height),
      }
    }
    case 'circle': {
      const r = Math.abs(el.radius)
      return { x: el.cx - r, y: el.cy - r, width: r * 2, height: r * 2 }
    }
  }
}

// ============================================================
// hitTest
// Returns true if the point (px, py) is inside / near the element.
// Used for the Select and Eraser tools.
// ============================================================
export function hitTest(
  el: CanvasElement,
  px: number,
  py: number,
  threshold = 8,
): boolean {
  switch (el.type) {
    case 'pen': {
      // Check proximity to any line segment in the path
      for (let i = 1; i < el.points.length; i++) {
        const a = el.points[i - 1]
        const b = el.points[i]
        if (distToSegment(px, py, a.x, a.y, b.x, b.y) <= threshold) {
          return true
        }
      }
      // Single-point dot
      if (el.points.length === 1) {
        const d = Math.hypot(px - el.points[0].x, py - el.points[0].y)
        return d <= threshold
      }
      return false
    }
    case 'line': {
      return distToSegment(px, py, el.x1, el.y1, el.x2, el.y2) <= threshold
    }
    case 'rectangle': {
      const x = Math.min(el.x, el.x + el.width)
      const y = Math.min(el.y, el.y + el.height)
      const w = Math.abs(el.width)
      const h = Math.abs(el.height)
      // If filled, check interior; otherwise check stroke proximity
      if (el.fill) {
        return px >= x && px <= x + w && py >= y && py <= y + h
      }
      return (
        (Math.abs(px - x) <= threshold && py >= y && py <= y + h) ||
        (Math.abs(px - (x + w)) <= threshold && py >= y && py <= y + h) ||
        (Math.abs(py - y) <= threshold && px >= x && px <= x + w) ||
        (Math.abs(py - (y + h)) <= threshold && px >= x && px <= x + w)
      )
    }
    case 'circle': {
      const r = Math.abs(el.radius)
      const dist = Math.hypot(px - el.cx, py - el.cy)
      if (el.fill) return dist <= r
      return Math.abs(dist - r) <= threshold
    }
  }
}

// ── Geometry helpers ──────────────────────────────────────────

/** Distance from point (px,py) to line segment (ax,ay)→(bx,by). */
function distToSegment(
  px: number, py: number,
  ax: number, ay: number,
  bx: number, by: number,
): number {
  const dx = bx - ax
  const dy = by - ay
  const lenSq = dx * dx + dy * dy
  if (lenSq === 0) return Math.hypot(px - ax, py - ay)
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq))
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}
