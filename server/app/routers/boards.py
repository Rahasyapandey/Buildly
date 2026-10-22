"""
routers/boards.py — CRUD endpoints for Board resources.

Endpoints:
  GET    /api/boards           → list all boards (no elements)
  POST   /api/boards           → create a new board
  GET    /api/boards/{id}      → get board + its elements
  PATCH  /api/boards/{id}      → update board title
  DELETE /api/boards/{id}      → delete board and cascade its elements
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.auth import get_optional_current_user
from app.database import get_db
from app.models import Board, User
from app.schemas import BoardCreate, BoardDetail, BoardRead, BoardUpdate

router = APIRouter(prefix="/api/boards", tags=["boards"])


def _get_board_or_404(board_id: uuid.UUID, db: Session) -> Board:
    """Fetch a Board by PK or raise HTTP 404."""
    board = db.get(Board, board_id)
    if board is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Board {board_id} not found.",
        )
    return board


# ---------------------------------------------------------------------------
# List
# ---------------------------------------------------------------------------
@router.get("", response_model=list[BoardRead])
@router.get("/", response_model=list[BoardRead])
def list_boards(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
) -> list[Board]:
    """
    Return boards ordered by creation time (newest first).
    If authenticated, returns boards owned by the user or shared boards.
    """
    if current_user:
        return (
            db.query(Board)
            .filter((Board.owner_id == current_user.id) | (Board.owner_id.is_(None)))
            .order_by(Board.created_at.desc())
            .all()
        )
    return db.query(Board).order_by(Board.created_at.desc()).all()


# ---------------------------------------------------------------------------
# Create
# ---------------------------------------------------------------------------
@router.post("", response_model=BoardRead, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=BoardRead, status_code=status.HTTP_201_CREATED)
def create_board(
    payload: BoardCreate,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
) -> Board:
    """
    Create a new board.
    - **title**: optional; defaults to ``"Untitled Board"``
    - Associates board with authenticated user if logged in.
    """
    board = Board(
        title=payload.title,
        owner_id=current_user.id if current_user else None,
    )
    db.add(board)
    db.commit()
    db.refresh(board)
    return board


# ---------------------------------------------------------------------------
# Read (with elements)
# ---------------------------------------------------------------------------
@router.get("/{board_id}", response_model=BoardDetail)
def get_board(board_id: uuid.UUID, db: Session = Depends(get_db)) -> Board:
    """
    Fetch a single board including all of its elements, ordered by position.
    Returns HTTP 404 if the board does not exist.
    """
    return _get_board_or_404(board_id, db)


# ---------------------------------------------------------------------------
# Update
# ---------------------------------------------------------------------------
@router.patch("/{board_id}", response_model=BoardRead)
def update_board(
    board_id: uuid.UUID,
    payload: BoardUpdate,
    db: Session = Depends(get_db),
) -> Board:
    """
    Update mutable board fields.  Only fields present in the request body
    are changed (partial update semantics).
    """
    board = _get_board_or_404(board_id, db)
    if payload.title is not None:
        board.title = payload.title
    board.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(board)
    return board


# ---------------------------------------------------------------------------
# Delete
# ---------------------------------------------------------------------------
@router.delete("/{board_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
def delete_board(board_id: uuid.UUID, db: Session = Depends(get_db)) -> Response:
    """
    Permanently delete a board.  All associated elements are deleted via the
    ``ON DELETE CASCADE`` foreign-key constraint.
    """
    board = _get_board_or_404(board_id, db)
    db.delete(board)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
