// ============================================================
// diagramTypes.ts — Structured diagram element types (Phase 5)
//
// These extend the canvas with structured nodes that have
// text, sections, and connectors — unlike raw drawing elements.
// Diagram nodes are rendered as SVG overlays so they support
// proper text rendering, click-to-edit, and port connections.
// ============================================================

// ── UML Class Diagram ─────────────────────────────────────────

export interface UMLAttribute {
  visibility: '+' | '-' | '#' | '~' // public, private, protected, package
  name: string
  type: string
}

export interface UMLMethod {
  visibility: '+' | '-' | '#' | '~'
  name: string
  params: string   // e.g. "id: number, name: string"
  returnType: string
}

export interface UMLClassNode {
  id: string
  type: 'uml_class'
  x: number
  y: number
  width: number
  name: string
  isAbstract: boolean
  attributes: UMLAttribute[]
  methods: UMLMethod[]
}

// ── ERD Entity ────────────────────────────────────────────────

export type ERDColumnType =
  | 'UUID' | 'TEXT' | 'VARCHAR' | 'INTEGER' | 'BIGINT'
  | 'FLOAT' | 'BOOLEAN' | 'TIMESTAMPTZ' | 'JSONB' | 'DATE'

export interface ERDColumn {
  name: string
  dataType: ERDColumnType
  isPrimaryKey: boolean
  isForeignKey: boolean
  isNullable: boolean
  isUnique: boolean
}

export interface ERDEntityNode {
  id: string
  type: 'erd_entity'
  x: number
  y: number
  width: number
  name: string
  columns: ERDColumn[]
}

// ── Flowchart ─────────────────────────────────────────────────

export type FlowchartNodeShape =
  | 'process'    // rectangle
  | 'decision'   // diamond
  | 'terminal'   // rounded rectangle (start/end)
  | 'io'         // parallelogram (input/output)
  | 'connector'  // circle (jump point)

export interface FlowchartNode {
  id: string
  type: 'flowchart_node'
  x: number
  y: number
  width: number
  height: number
  shape: FlowchartNodeShape
  label: string
}

// ── Connector (arrow between nodes) ──────────────────────────

export type ConnectorLineStyle = 'solid' | 'dashed'
export type ConnectorArrowStyle = 'arrow' | 'open' | 'none'

export interface ConnectorEdge {
  id: string
  type: 'connector'
  fromNodeId: string
  fromPort: 'top' | 'right' | 'bottom' | 'left'
  toNodeId: string
  toPort: 'top' | 'right' | 'bottom' | 'left'
  label: string
  lineStyle: ConnectorLineStyle
  arrowStart: ConnectorArrowStyle
  arrowEnd: ConnectorArrowStyle
}

// ── Union ─────────────────────────────────────────────────────

export type DiagramElement =
  | UMLClassNode
  | ERDEntityNode
  | FlowchartNode
  | ConnectorEdge
