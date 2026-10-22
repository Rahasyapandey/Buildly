import { useCallback, useEffect, useRef, useState } from 'react'
import type { CanvasElement } from '../types/canvas'

// ============================================================
// useCollaboration — Phase 4 WebSocket real-time hook
//
// Connects to ws://localhost:8000/ws/{boardId} and:
//  - Broadcasts element additions / deletions / clears to peers
//  - Receives the same events from peers and calls the provided handlers
//  - Tracks other users' cursor positions
//  - Reconnects automatically on disconnect (with exponential backoff)
// ============================================================

const WS_BASE = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000'

export interface RemoteCursor {
  userId: string
  x: number
  y: number
}

// Message shapes sent over WebSocket
type WsMessage =
  | { type: 'add_element';    element: CanvasElement }
  | { type: 'delete_element'; id: string }
  | { type: 'clear_board' }
  | { type: 'cursor_move';    x: number; y: number; userId: string }

interface UseCollaborationOptions {
  boardId: string | null          // null = not connected
  userId: string                  // local user's anonymous ID
  onRemoteAdd:    (el: CanvasElement) => void
  onRemoteRemove: (id: string) => void
  onRemoteClear:  () => void
}

export function useCollaboration({
  boardId,
  userId,
  onRemoteAdd,
  onRemoteRemove,
  onRemoteClear,
}: UseCollaborationOptions) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectDelay = useRef(1000) // ms; doubles on each failure

  const [connected, setConnected] = useState(false)
  const [cursors, setCursors] = useState<Record<string, RemoteCursor>>({})

  // Store connect in a ref so the onclose handler can call it without
  // capturing it during its own initialisation (fixes the lint warning).
  const connectRef = useRef<() => void>(() => { /* placeholder */ })

  // ── Connect / reconnect ───────────────────────────────────
  const connect = useCallback(() => {
    if (!boardId) return
    const ws = new WebSocket(`${WS_BASE}/ws/${boardId}`)
    wsRef.current = ws

    ws.onopen = () => {
      setConnected(true)
      reconnectDelay.current = 1000 // reset backoff
    }

    ws.onclose = () => {
      setConnected(false)
      // Auto-reconnect with exponential backoff (max 30 s)
      const delay = Math.min(reconnectDelay.current, 30_000)
      reconnectDelay.current = delay * 2
      reconnectTimer.current = setTimeout(() => connectRef.current(), delay)
    }

    ws.onerror = () => {
      ws.close()
    }

    ws.onmessage = (event: MessageEvent<string>) => {
      let msg: WsMessage
      try {
        msg = JSON.parse(event.data) as WsMessage
      } catch {
        return
      }

      switch (msg.type) {
        case 'add_element':
          onRemoteAdd(msg.element)
          break
        case 'delete_element':
          onRemoteRemove(msg.id)
          break
        case 'clear_board':
          onRemoteClear()
          break
        case 'cursor_move':
          if (msg.userId !== userId) {
            setCursors((prev) => ({
              ...prev,
              [msg.userId]: { userId: msg.userId, x: msg.x, y: msg.y },
            }))
          }
          break
      }
    }
  }, [boardId, userId, onRemoteAdd, onRemoteRemove, onRemoteClear])

  // Keep connectRef in sync so the setTimeout callback always calls the latest version
  useEffect(() => {
    connectRef.current = connect
  }, [connect])

  // Connect on mount / boardId change; clean up on unmount
  useEffect(() => {
    connect()
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
    }
  }, [connect])

  // ── Outbound helpers ──────────────────────────────────────

  const send = useCallback((msg: WsMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg))
    }
  }, [])

  const broadcastAdd = useCallback(
    (el: CanvasElement) => send({ type: 'add_element', element: el }),
    [send],
  )

  const broadcastRemove = useCallback(
    (id: string) => send({ type: 'delete_element', id }),
    [send],
  )

  const broadcastClear = useCallback(
    () => send({ type: 'clear_board' }),
    [send],
  )

  const broadcastCursor = useCallback(
    (x: number, y: number) => send({ type: 'cursor_move', x, y, userId }),
    [send, userId],
  )

  return {
    connected,
    cursors,
    broadcastAdd,
    broadcastRemove,
    broadcastClear,
    broadcastCursor,
  }
}
