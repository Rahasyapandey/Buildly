// ============================================================
// Canvas element types — the single source of truth for every
// shape that can be drawn on a Buildly board.
//
// These types are serialised to JSON when saved to the backend
// (Phase 3), so the shape of the data here must match the
// JSONB column in the board_elements table.
// ============================================================

/** A 2D point in canvas-space (not screen-space). */
export interface Point {
  x: number
  y: number
}

/** Tools the user can select in the toolbar. */
export type Tool =
  | 'pen'        // freehand path
  | 'line'       // straight line between two points
  | 'rectangle'  // axis-aligned rectangle
  | 'circle'     // circle defined by centre + radius
  | 'sticky'     // interactive sticky note with text
  | 'text'       // text annotation
  | 'select'     // click to select / drag to move
  | 'eraser'     // click element to remove it

/** Colour as a CSS hex string e.g. "#7c6af7". */
export type HexColor = string

// ── Individual element types ──────────────────────────────────

interface BaseElement {
  id: string          // UUID generated on the client
  color: HexColor     // stroke colour
  strokeWidth: number // stroke width in px
}

export interface PenElement extends BaseElement {
  type: 'pen'
  points: Point[]   // ordered list of mouse positions
}

export interface LineElement extends BaseElement {
  type: 'line'
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface RectElement extends BaseElement {
  type: 'rectangle'
  x: number
  y: number
  width: number    // can be negative if drawn right-to-left
  height: number   // can be negative if drawn bottom-to-top
  fill: HexColor | null
}

export interface CircleElement extends BaseElement {
  type: 'circle'
  cx: number
  cy: number
  radius: number
  fill: HexColor | null
}

export interface StickyElement extends BaseElement {
  type: 'sticky'
  x: number
  y: number
  width: number
  height: number
  text: string
  noteColor: string
}

export interface TextElement extends BaseElement {
  type: 'text'
  x: number
  y: number
  text: string
  fontSize: number
}

/** Union of all concrete element types. */
export type CanvasElement =
  | PenElement
  | LineElement
  | RectElement
  | CircleElement
  | StickyElement
  | TextElement

/** Element without id for creating new elements */
export type NewCanvasElement =
  | Omit<PenElement, 'id'>
  | Omit<LineElement, 'id'>
  | Omit<RectElement, 'id'>
  | Omit<CircleElement, 'id'>
  | Omit<StickyElement, 'id'>
  | Omit<TextElement, 'id'>

// ── Board state ───────────────────────────────────────────────

export interface BoardState {
  elements: CanvasElement[]
  /** Stack of past element arrays — for undo. */
  history: CanvasElement[][]
  /** Current position in the history stack. */
  historyIndex: number
  selectedId: string | null
}
