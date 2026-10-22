// ============================================================
// api.ts — Typed HTTP client for the Buildly REST API.
//
// All fetch calls go through these functions. This means:
//  - The base URL is configured in one place (BASE_URL).
//  - Every endpoint is typed — TypeScript will catch mismatches.
//  - Error handling is consistent.
//
// Phase 3: boards are saved/loaded here.
// ============================================================

import type { CanvasElement } from '../types/canvas'
import type { AuthResponse, User } from '../types/auth'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export function getAuthToken(): string | null {
  return localStorage.getItem('buildly_auth_token')
}

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem('buildly_auth_token', token)
  } else {
    localStorage.removeItem('buildly_auth_token')
  }
}

// ── Generic fetch wrapper ─────────────────────────────────────

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers as Record<string, string> | undefined),
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error')
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`)
  }
  // 204 No Content has no body
  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

// ── Types (mirrors the backend Pydantic schemas) ──────────────

export interface BoardRead {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export interface BoardElementRead {
  id: string
  board_id: string
  type: string
  data: Record<string, unknown>
  color: string
  stroke_width: number
  position: number
  created_at: string
}

export interface BoardDetail extends BoardRead {
  elements: BoardElementRead[]
}

// ── Board endpoints ───────────────────────────────────────────

export const api = {
  boards: {
    /** List all boards (no elements). */
    list(): Promise<BoardRead[]> {
      return request('/api/boards/')
    },

    /** Create a new board. */
    create(title = 'Untitled Board'): Promise<BoardRead> {
      return request('/api/boards/', {
        method: 'POST',
        body: JSON.stringify({ title }),
      })
    },

    /** Get a board including all its elements. */
    get(id: string): Promise<BoardDetail> {
      return request(`/api/boards/${id}`)
    },

    /** Update the board title. */
    rename(id: string, title: string): Promise<BoardRead> {
      return request(`/api/boards/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title }),
      })
    },

    /** Delete a board and all its elements. */
    delete(id: string): Promise<void> {
      return request(`/api/boards/${id}`, { method: 'DELETE' })
    },
  },

  elements: {
    /**
     * Save (replace) all elements on a board.
     * This is the "Ctrl+S" / auto-save operation.
     */
    saveAll(boardId: string, elements: CanvasElement[]): Promise<BoardElementRead[]> {
      const payload = elements.map((el, index) => ({
        id: el.id,
        type: el.type,
        data: el,           // save the full element as JSONB
        color: el.color,
        stroke_width: el.strokeWidth,
        position: index,
      }))
      return request(`/api/boards/${boardId}/elements/batch`, {
        method: 'PUT',
        body: JSON.stringify({ elements: payload }),
      })
    },

    /** Delete a single element from a board. */
    delete(boardId: string, elementId: string): Promise<void> {
      return request(`/api/boards/${boardId}/elements/${elementId}`, {
        method: 'DELETE',
      })
    },
  },

  auth: {
    /** Authenticate with Google ID credential token */
    google(credential: string, clientId?: string): Promise<AuthResponse> {
      return request('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential, client_id: clientId }),
      })
    },

    /** Instant developer/guest login for quick testing */
    demoLogin(email?: string, name?: string, avatarUrl?: string): Promise<AuthResponse> {
      return request('/api/auth/demo-login', {
        method: 'POST',
        body: JSON.stringify({ email, name, avatar_url: avatarUrl }),
      })
    },

    /** Fetch profile of currently authenticated user */
    async me(): Promise<User> {
      const res = await request<{
        id: string
        email: string
        name: string
        avatar_url?: string
        google_id?: string
        created_at?: string
        last_login?: string
      }>('/api/auth/me')
      return {
        id: res.id,
        email: res.email,
        name: res.name,
        avatarUrl: res.avatar_url,
        googleId: res.google_id,
        createdAt: res.created_at,
        lastLogin: res.last_login,
      }
    },

    /** Log out */
    logout(): Promise<{ message: string }> {
      return request('/api/auth/logout', { method: 'POST' })
    },
  },
}

/**
 * Convert a BoardElementRead (from API) back to a CanvasElement.
 * The full element data is stored in the `data` JSONB field.
 */
export function toCanvasElement(el: BoardElementRead): CanvasElement {
  return el.data as unknown as CanvasElement
}
