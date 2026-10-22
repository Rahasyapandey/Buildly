"""
ws_manager.py — WebSocket ConnectionManager for Phase 4 real-time collaboration.

Architecture:
  - One "room" per board_id (UUID string key)
  - A room is simply a set of active WebSocket connections
  - On any message, the server broadcasts it to every OTHER connection in the room
  - No persistence — the REST API handles saving; WS is purely for live sync
"""

import logging
from collections import defaultdict

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ConnectionManager:
    """
    Manages WebSocket connections grouped by board room.

    Usage::

        manager = ConnectionManager()

        # On connect
        await manager.connect(board_id, websocket)

        # On message
        await manager.broadcast(board_id, data, sender=websocket)

        # On disconnect
        manager.disconnect(board_id, websocket)
    """

    def __init__(self) -> None:
        # board_id (str) → set of active WebSocket connections
        self._rooms: dict[str, set[WebSocket]] = defaultdict(set)

    async def connect(self, board_id: str, websocket: WebSocket) -> None:
        """
        Accept the WebSocket handshake and add the connection to the room.
        """
        await websocket.accept()
        self._rooms[board_id].add(websocket)
        logger.info(
            "WS connect  board=%s  total_in_room=%d",
            board_id,
            len(self._rooms[board_id]),
        )

    def disconnect(self, board_id: str, websocket: WebSocket) -> None:
        """
        Remove a connection from its room.  Cleans up empty rooms.
        """
        self._rooms[board_id].discard(websocket)
        if not self._rooms[board_id]:
            del self._rooms[board_id]
        logger.info(
            "WS disconnect  board=%s  remaining=%d",
            board_id,
            len(self._rooms.get(board_id, set())),
        )

    async def broadcast(
        self,
        board_id: str,
        message: str,
        sender: WebSocket,
    ) -> None:
        """
        Send a raw text message to every connection in the room *except* the sender.

        Disconnected clients that raise an exception during send are silently
        removed so they don't block the broadcast.
        """
        dead: list[WebSocket] = []
        for connection in list(self._rooms.get(board_id, set())):
            if connection is sender:
                continue
            try:
                await connection.send_text(message)
            except Exception:
                # Connection died mid-broadcast — mark for cleanup
                dead.append(connection)

        for ws in dead:
            self.disconnect(board_id, ws)

    def room_size(self, board_id: str) -> int:
        """Return the number of active connections in a room."""
        return len(self._rooms.get(board_id, set()))


# Module-level singleton shared across the app
manager = ConnectionManager()
