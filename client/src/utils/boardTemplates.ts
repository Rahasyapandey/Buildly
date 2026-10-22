import type { CanvasElement } from '../types/canvas'
import { nanoid } from './nanoid'

export type TemplateId =
  | 'system-architecture'
  | 'uml-class'
  | 'erd'
  | 'flowchart'

export interface BoardTemplateMeta {
  id: TemplateId
  title: string
  subtitle: string
  category: 'architecture' | 'uml' | 'database' | 'workflow'
  description: string
  badge: string
}

export const BOARD_TEMPLATES: BoardTemplateMeta[] = [
  {
    id: 'system-architecture',
    title: 'Cloud Microservices Architecture',
    subtitle: 'Scalable distributed system topology',
    category: 'architecture',
    description: 'React client, API Gateway, Auth/Core microservices, Redis cache, and Postgres cluster.',
    badge: 'ARCHITECTURE',
  },
  {
    id: 'uml-class',
    title: 'UML Object-Oriented Domain Model',
    subtitle: 'Clean class architecture & relationships',
    category: 'uml',
    description: 'User, Workspace, Board, and Element domain entities with typed attributes and methods.',
    badge: 'UML',
  },
  {
    id: 'erd',
    title: 'Relational Database Schema (ERD)',
    subtitle: 'Normalized multi-tenant database design',
    category: 'database',
    description: 'Primary keys, foreign keys, UUID indices, and relation connector paths.',
    badge: 'ERD',
  },
  {
    id: 'flowchart',
    title: 'Production Auth & Sync Flowchart',
    subtitle: 'Full user session & real-time sync lifecycle',
    category: 'workflow',
    description: 'Input validation, OAuth handshake, token refresh, and socket subscription logic.',
    badge: 'FLOWCHART',
  },
]

export function getTemplateElements(templateId: string): CanvasElement[] {
  const now = nanoid

  if (templateId === 'system-architecture' || templateId.includes('arch')) {
    return [
      // Frontend Client Node
      {
        id: now(),
        type: 'rectangle',
        x: 80,
        y: 180,
        width: 170,
        height: 100,
        color: '#2563eb',
        strokeWidth: 2,
        fill: 'rgba(37, 99, 235, 0.08)',
      },
      {
        id: now(),
        type: 'text',
        x: 105,
        y: 205,
        text: 'React 19 Client\n• Vite SPA\n• WebRTC / WS',
        fontSize: 14,
        color: '#1d4ed8',
        strokeWidth: 1,
      },

      // Arrow Client -> API Gateway
      {
        id: now(),
        type: 'line',
        x1: 250,
        y1: 230,
        x2: 330,
        y2: 230,
        color: '#3b82f6',
        strokeWidth: 3,
      },

      // API Gateway
      {
        id: now(),
        type: 'rectangle',
        x: 330,
        y: 150,
        width: 170,
        height: 160,
        color: '#7c3aed',
        strokeWidth: 2,
        fill: 'rgba(124, 58, 237, 0.08)',
      },
      {
        id: now(),
        type: 'text',
        x: 350,
        y: 180,
        text: 'API Gateway\n• Reverse Proxy\n• Rate Limiting\n• SSL Termination\n• Auth Guard',
        fontSize: 14,
        color: '#6d28d9',
        strokeWidth: 1,
      },

      // Line Gateway -> Microservice
      {
        id: now(),
        type: 'line',
        x1: 500,
        y1: 230,
        x2: 580,
        y2: 230,
        color: '#8b5cf6',
        strokeWidth: 3,
      },

      // Core Backend Service
      {
        id: now(),
        type: 'rectangle',
        x: 580,
        y: 160,
        width: 180,
        height: 140,
        color: '#059669',
        strokeWidth: 2,
        fill: 'rgba(5, 150, 105, 0.08)',
      },
      {
        id: now(),
        type: 'text',
        x: 600,
        y: 190,
        text: 'FastAPI Core Service\n• WebSocket Hub\n• Session Manager\n• Alembic Migrations',
        fontSize: 14,
        color: '#047857',
        strokeWidth: 1,
      },

      // Line Backend -> Redis
      {
        id: now(),
        type: 'line',
        x1: 670,
        y1: 160,
        x2: 670,
        y2: 90,
        color: '#ef4444',
        strokeWidth: 2,
      },

      // Redis Cache Node
      {
        id: now(),
        type: 'rectangle',
        x: 590,
        y: 20,
        width: 160,
        height: 70,
        color: '#dc2626',
        strokeWidth: 2,
        fill: 'rgba(220, 38, 38, 0.08)',
      },
      {
        id: now(),
        type: 'text',
        x: 610,
        y: 40,
        text: 'Redis Pub/Sub\n• Presence & Cache',
        fontSize: 14,
        color: '#b91c1c',
        strokeWidth: 1,
      },

      // Line Backend -> Postgres
      {
        id: now(),
        type: 'line',
        x1: 670,
        y1: 300,
        x2: 670,
        y2: 370,
        color: '#2563eb',
        strokeWidth: 2,
      },

      // Postgres DB Node
      {
        id: now(),
        type: 'rectangle',
        x: 580,
        y: 370,
        width: 180,
        height: 90,
        color: '#2563eb',
        strokeWidth: 2,
        fill: 'rgba(37, 99, 235, 0.08)',
      },
      {
        id: now(),
        type: 'text',
        x: 600,
        y: 395,
        text: 'PostgreSQL 16 DB\n• Workspace & Boards\n• Row Level Security',
        fontSize: 14,
        color: '#1d4ed8',
        strokeWidth: 1,
      },

      // Architectural Sticky Note
      {
        id: now(),
        type: 'sticky',
        x: 100,
        y: 360,
        width: 220,
        height: 120,
        color: '#f59e0b',
        strokeWidth: 1,
        noteColor: '#fef3c7',
        text: 'Architecture Specs:\n✓ Zero-downtime rolling deploys\n✓ Sub-15ms WebSocket heartbeat\n✓ Auto-scaling Redis worker tier',
      },
    ]
  }

  if (templateId === 'uml-class' || templateId.includes('uml')) {
    return [
      // Class: User
      {
        id: now(),
        type: 'rectangle',
        x: 100,
        y: 120,
        width: 200,
        height: 170,
        color: '#2563eb',
        strokeWidth: 2,
        fill: 'rgba(37, 99, 235, 0.05)',
      },
      {
        id: now(),
        type: 'line',
        x1: 100,
        y1: 160,
        x2: 300,
        y2: 160,
        color: '#2563eb',
        strokeWidth: 1.5,
      },
      {
        id: now(),
        type: 'line',
        x1: 100,
        y1: 225,
        x2: 300,
        y2: 225,
        color: '#2563eb',
        strokeWidth: 1.5,
      },
      {
        id: now(),
        type: 'text',
        x: 155,
        y: 132,
        text: '«User»',
        fontSize: 16,
        color: '#1e40af',
        strokeWidth: 1,
      },
      {
        id: now(),
        type: 'text',
        x: 110,
        y: 170,
        text: '+ id: UUID\n+ name: string\n+ email: string',
        fontSize: 13,
        color: '#334155',
        strokeWidth: 1,
      },
      {
        id: now(),
        type: 'text',
        x: 110,
        y: 235,
        text: '+ login(): Token\n+ createBoard(): Board',
        fontSize: 13,
        color: '#334155',
        strokeWidth: 1,
      },

      // Relationship line
      {
        id: now(),
        type: 'line',
        x1: 300,
        y1: 200,
        x2: 440,
        y2: 200,
        color: '#64748b',
        strokeWidth: 2,
      },
      {
        id: now(),
        type: 'text',
        x: 340,
        y: 180,
        text: '1 ──── * owns',
        fontSize: 12,
        color: '#64748b',
        strokeWidth: 1,
      },

      // Class: Board
      {
        id: now(),
        type: 'rectangle',
        x: 440,
        y: 120,
        width: 220,
        height: 190,
        color: '#7c3aed',
        strokeWidth: 2,
        fill: 'rgba(124, 58, 237, 0.05)',
      },
      {
        id: now(),
        type: 'line',
        x1: 440,
        y1: 160,
        x2: 660,
        y2: 160,
        color: '#7c3aed',
        strokeWidth: 1.5,
      },
      {
        id: now(),
        type: 'line',
        x1: 440,
        y1: 235,
        x2: 660,
        y2: 235,
        color: '#7c3aed',
        strokeWidth: 1.5,
      },
      {
        id: now(),
        type: 'text',
        x: 510,
        y: 132,
        text: '«Board»',
        fontSize: 16,
        color: '#5b21b6',
        strokeWidth: 1,
      },
      {
        id: now(),
        type: 'text',
        x: 450,
        y: 170,
        text: '+ id: UUID\n+ title: string\n+ elements: Element[]\n+ isPublic: boolean',
        fontSize: 13,
        color: '#334155',
        strokeWidth: 1,
      },
      {
        id: now(),
        type: 'text',
        x: 450,
        y: 245,
        text: '+ exportPdf(): Promise\n+ syncDelta(op: Op): void',
        fontSize: 13,
        color: '#334155',
        strokeWidth: 1,
      },

      // Sticky Note
      {
        id: now(),
        type: 'sticky',
        x: 180,
        y: 350,
        width: 240,
        height: 100,
        color: '#10b981',
        strokeWidth: 1,
        noteColor: '#d1fae5',
        text: 'Domain Guidelines:\n• Strict encapsulation\n• Immutable element state\n• Event-driven undo/redo stack',
      },
    ]
  }

  if (templateId === 'erd' || templateId.includes('database')) {
    return [
      // Entity: users
      {
        id: now(),
        type: 'rectangle',
        x: 90,
        y: 130,
        width: 190,
        height: 160,
        color: '#2563eb',
        strokeWidth: 2,
        fill: 'rgba(37, 99, 235, 0.05)',
      },
      {
        id: now(),
        type: 'text',
        x: 105,
        y: 145,
        text: 'users (PK)\n───────\nid: uuid (PK)\nemail: varchar(255)\nname: text\ncreated_at: timestamp',
        fontSize: 13,
        color: '#1e3a8a',
        strokeWidth: 1,
      },

      // Line users -> boards
      {
        id: now(),
        type: 'line',
        x1: 280,
        y1: 200,
        x2: 380,
        y2: 200,
        color: '#475569',
        strokeWidth: 2,
      },
      {
        id: now(),
        type: 'text',
        x: 295,
        y: 180,
        text: '1:N',
        fontSize: 12,
        color: '#475569',
        strokeWidth: 1,
      },

      // Entity: boards
      {
        id: now(),
        type: 'rectangle',
        x: 380,
        y: 110,
        width: 210,
        height: 190,
        color: '#059669',
        strokeWidth: 2,
        fill: 'rgba(5, 150, 105, 0.05)',
      },
      {
        id: now(),
        type: 'text',
        x: 395,
        y: 125,
        text: 'boards\n───────────────\nid: uuid (PK)\nowner_id: uuid (FK)\ntitle: varchar(120)\nelements: jsonb\nupdated_at: timestamp',
        fontSize: 13,
        color: '#065f46',
        strokeWidth: 1,
      },

      // Line boards -> board_collaborators
      {
        id: now(),
        type: 'line',
        x1: 480,
        y1: 300,
        x2: 480,
        y2: 370,
        color: '#475569',
        strokeWidth: 2,
      },

      // Entity: collaborators
      {
        id: now(),
        type: 'rectangle',
        x: 380,
        y: 370,
        width: 210,
        height: 140,
        color: '#d97706',
        strokeWidth: 2,
        fill: 'rgba(217, 119, 6, 0.05)',
      },
      {
        id: now(),
        type: 'text',
        x: 395,
        y: 385,
        text: 'board_collaborators\n───────────────\nboard_id: uuid (FK)\nuser_id: uuid (FK)\nrole: varchar(30)\njoined_at: timestamp',
        fontSize: 13,
        color: '#92400e',
        strokeWidth: 1,
      },
    ]
  }

  // Default: Flowchart
  return [
    // Terminal: Start
    {
      id: now(),
      type: 'circle',
      cx: 160,
      cy: 160,
      radius: 45,
      color: '#10b981',
      strokeWidth: 2,
      fill: 'rgba(16, 185, 129, 0.1)',
    },
    {
      id: now(),
      type: 'text',
      x: 140,
      y: 150,
      text: 'Start',
      fontSize: 15,
      color: '#065f46',
      strokeWidth: 1,
    },

    // Line Start -> Decision
    {
      id: now(),
      type: 'line',
      x1: 205,
      y1: 160,
      x2: 300,
      y2: 160,
      color: '#475569',
      strokeWidth: 2,
    },

    // Process: Validate Session
    {
      id: now(),
      type: 'rectangle',
      x: 300,
      y: 120,
      width: 160,
      height: 80,
      color: '#2563eb',
      strokeWidth: 2,
      fill: 'rgba(37, 99, 235, 0.08)',
    },
    {
      id: now(),
      type: 'text',
      x: 320,
      y: 140,
      text: 'Validate JWT &\nPermissions',
      fontSize: 14,
      color: '#1e40af',
      strokeWidth: 1,
    },

    // Line Validate -> Sync
    {
      id: now(),
      type: 'line',
      x1: 460,
      y1: 160,
      x2: 550,
      y2: 160,
      color: '#475569',
      strokeWidth: 2,
    },

    // Terminal: Live Board Ready
    {
      id: now(),
      type: 'rectangle',
      x: 550,
      y: 110,
      width: 180,
      height: 100,
      color: '#7c3aed',
      strokeWidth: 2,
      fill: 'rgba(124, 58, 237, 0.08)',
    },
    {
      id: now(),
      type: 'text',
      x: 565,
      y: 135,
      text: 'Mount WebRTC &\nConnect Canvas\n(Latency <15ms)',
      fontSize: 14,
      color: '#5b21b6',
      strokeWidth: 1,
    },

    // Sticky Note
    {
      id: now(),
      type: 'sticky',
      x: 240,
      y: 260,
      width: 250,
      height: 110,
      color: '#8b5cf6',
      strokeWidth: 1,
      noteColor: '#ede9fe',
      text: 'Real-time Sync Pipeline:\n1. JWT validated against Redis\n2. Delta broadcasts over WebSocket\n3. Client computes local undo stack',
    },
  ]
}
