"""
models.py — SQLAlchemy ORM models for Buildly.

Tables:
  - User          → registered users (currently identity only; auth is future)
  - Board         → collaborative whiteboard
  - BoardElement  → a single drawn element on a board (pen, line, rect, circle)
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, Uuid, JSON
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

JSON_TYPE = JSON().with_variant(JSONB, "postgresql")
UUID_TYPE = Uuid(as_uuid=True).with_variant(PG_UUID(as_uuid=True), "postgresql")


def _utcnow() -> datetime:
    """Return the current UTC datetime (timezone-aware)."""
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# User
# ---------------------------------------------------------------------------
class User(Base):
    """A Buildly user account authenticated via Google OAuth."""

    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID_TYPE,
        primary_key=True,
        default=uuid.uuid4,
    )
    email: Mapped[str] = mapped_column(Text, unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(Text, nullable=False, default="")
    avatar_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    google_id: Mapped[Optional[str]] = mapped_column(Text, unique=True, nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=_utcnow,
    )
    last_login: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=_utcnow,
    )

    # One-to-many: a user owns many boards
    boards: Mapped[list["Board"]] = relationship(
        "Board",
        back_populates="owner",
    )


# ---------------------------------------------------------------------------
# Board
# ---------------------------------------------------------------------------
class Board(Base):
    """A collaborative whiteboard session."""

    __tablename__ = "boards"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID_TYPE,
        primary_key=True,
        default=uuid.uuid4,
    )
    title: Mapped[str] = mapped_column(
        Text, nullable=False, default="Untitled Board"
    )
    owner_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID_TYPE,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=_utcnow,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=_utcnow,
        onupdate=_utcnow,
    )

    # Owner back-reference
    owner: Mapped[Optional[User]] = relationship("User", back_populates="boards")

    # One-to-many: a board owns many elements
    elements: Mapped[list["BoardElement"]] = relationship(
        "BoardElement",
        back_populates="board",
        cascade="all, delete-orphan",
        order_by="BoardElement.position",
    )


# ---------------------------------------------------------------------------
# BoardElement
# ---------------------------------------------------------------------------
class BoardElement(Base):
    """
    A single drawn element on a board.

    The ``id`` is set by the frontend so element identity is stable across
    WebSocket events and REST saves — the server never generates it.

    ``data`` holds the full element JSON:
      pen       → { points: [{x,y}…], color, strokeWidth }
      line      → { x1, y1, x2, y2, color, strokeWidth }
      rectangle → { x, y, width, height, color, strokeWidth, fill }
      circle    → { cx, cy, radius, color, strokeWidth, fill }
      sticky    → { x, y, width, height, color, strokeWidth, noteColor, text }
      text      → { x, y, color, strokeWidth, text, fontSize }
    """

    __tablename__ = "board_elements"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID_TYPE,
        primary_key=True,
        # No default — the frontend always provides the ID
    )
    board_id: Mapped[uuid.UUID] = mapped_column(
        UUID_TYPE,
        ForeignKey("boards.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    type: Mapped[str] = mapped_column(
        String(32), nullable=False
    )
    data: Mapped[dict] = mapped_column(JSON_TYPE, nullable=False)
    color: Mapped[str] = mapped_column(Text, nullable=False)
    stroke_width: Mapped[float] = mapped_column(
        Float, nullable=False, default=2.0
    )
    position: Mapped[int] = mapped_column(
        Integer, nullable=False, default=0
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=_utcnow,
    )

    # Many-to-one back-reference
    board: Mapped["Board"] = relationship("Board", back_populates="elements")
