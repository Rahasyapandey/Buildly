"""
routers/ws.py — WebSocket endpoint for Phase 4 real-time collaboration.

Endpoint:
  ws://localhost:8000/ws/{board_id}

Protocol (JSON messages):

  Client → Server:
    { "type": "join",           "boardId": "<uuid>" }
    { "type": "add_element",    "element": { … } }
    { "type": "delete_element", "id": "<uuid>" }
    { "type": "clear_board" }
    { "type": "cursor_move",    "x": <float>, "y": <float>, "userId": "<str>" }

  Server → Other clients in room:
    Same JSON forwarded verbatim.

The server does NOT persist WebSocket messages.  Persistence is handled by
the REST API.  WebSocket is purely for live, low-latency broadcasting.
"""

import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.ws_manager import manager

logger = logging.getLogger(__name__)

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/{board_id}")
async def websocket_endpoint(websocket: WebSocket, board_id: str) -> None:
    """
    WebSocket connection handler for a single board room.

    1. Accepts the connection and registers it in the board room.
    2. Enters a receive loop — every message received is broadcast to all
       other connections in the same room.
    3. On disconnect (normal or abnormal), removes the connection from the room.

    The ``board_id`` path parameter doubles as the room identifier.  The
    optional ``{ type: 'join' }`` message from the client is accepted but has
    no server-side effect (the room is already known from the URL).
    """
    await manager.connect(board_id, websocket)
    try:
        while True:
            raw = await websocket.receive_text()
            # Broadcast verbatim to all other peers in the room
            await manager.broadcast(board_id, raw, sender=websocket)
    except WebSocketDisconnect:
        logger.info("WS normal disconnect  board=%s", board_id)
    except Exception as exc:
        logger.warning("WS error  board=%s  error=%s", board_id, exc)
    finally:
        manager.disconnect(board_id, websocket)
