"""
schemas.py — Pydantic v2 request / response schemas for the Buildly API.

Naming convention:
  <Model>Base       → shared fields
  <Model>Create     → fields accepted on POST / PUT
  <Model>Update     → fields accepted on PATCH (all optional)
  <Model>Read / <Model>Detail  → shapes returned to the client
"""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field


# ---------------------------------------------------------------------------
# Shared config mixin — enables ORM mode on all read schemas
# ---------------------------------------------------------------------------
class _ORMBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# ===========================================================================
# User & Auth
# ===========================================================================
class UserRead(_ORMBase):
    id: uuid.UUID
    email: str
    name: str
    avatar_url: Optional[str] = None
    google_id: Optional[str] = None
    created_at: datetime
    last_login: Optional[datetime] = None


class GoogleAuthRequest(BaseModel):
    """Payload received from Google Sign-In on client."""
    credential: str
    client_id: Optional[str] = None


class DemoLoginRequest(BaseModel):
    """Payload for instant 1-click test/dev login."""
    email: Optional[str] = None
    name: Optional[str] = None
    avatar_url: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead


# ===========================================================================
# Board
# ===========================================================================
class BoardBase(BaseModel):
    title: str = Field(default="Untitled Board", min_length=1, max_length=255)


class BoardCreate(BoardBase):
    """Body for POST /api/boards."""
    pass


class BoardUpdate(BaseModel):
    """Body for PATCH /api/boards/{id} — every field is optional."""
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)


class BoardRead(_ORMBase):
    """Lightweight board representation (no elements) used in list responses."""
    id: uuid.UUID
    title: str
    owner_id: Optional[uuid.UUID] = None
    created_at: datetime
    updated_at: datetime


class BoardDetail(BoardRead):
    """Full board representation including its elements (GET single board)."""
    elements: list["BoardElementRead"] = []


# ===========================================================================
# BoardElement
# ===========================================================================
class BoardElementBase(BaseModel):
    """Fields shared between create and read schemas."""
    id: uuid.UUID  # provided by the frontend
    type: str = Field(..., pattern=r"^(pen|line|rectangle|circle|sticky|text)$")
    data: dict[str, Any]
    color: str
    stroke_width: float = Field(default=2.0, ge=0.1, le=100.0)
    position: int = Field(default=0, ge=0)


class BoardElementCreate(BoardElementBase):
    """Body for POST /api/boards/{board_id}/elements."""
    pass


class BoardElementRead(_ORMBase):
    """Element shape returned to the client."""
    id: uuid.UUID
    board_id: uuid.UUID
    type: str
    data: dict[str, Any]
    color: str
    stroke_width: float
    position: int
    created_at: datetime


class BoardElementBatchReplace(BaseModel):
    """Body for PUT /api/boards/{board_id}/elements/batch."""
    elements: list[BoardElementCreate]
