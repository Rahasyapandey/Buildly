"""
routers/elements.py — CRUD endpoints for BoardElement resources.

Endpoints:
  GET    /api/boards/{board_id}/elements              → list elements (ordered)
  POST   /api/boards/{board_id}/elements              → add a single element
  PUT    /api/boards/{board_id}/elements/batch        → replace ALL elements
  DELETE /api/boards/{board_id}/elements/{element_id} → delete one element
"""

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Board, BoardElement
from app.schemas import (
    BoardElementBatchReplace,
    BoardElementCreate,
    BoardElementRead,
)

router = APIRouter(
    prefix="/api/boards/{board_id}/elements",
    tags=["elements"],
)


def _get_board_or_404(board_id: uuid.UUID, db: Session) -> Board:
    """Fetch a Board by PK or raise HTTP 404."""
    board = db.get(Board, board_id)
    if board is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Board {board_id} not found.",
        )
    return board


def _get_element_or_404(
    board_id: uuid.UUID, element_id: uuid.UUID, db: Session
) -> BoardElement:
    """Fetch a BoardElement that belongs to the given board, or raise 404."""
    element = (
        db.query(BoardElement)
        .filter(
            BoardElement.id == element_id,
            BoardElement.board_id == board_id,
        )
        .first()
    )
    if element is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Element {element_id} not found on board {board_id}.",
        )
    return element


# ---------------------------------------------------------------------------
# List
# ---------------------------------------------------------------------------
@router.get("/", response_model=list[BoardElementRead])
def list_elements(
    board_id: uuid.UUID, db: Session = Depends(get_db)
) -> list[BoardElement]:
    """
    Return all elements for a board, ordered by ``position`` (ascending).
    Raises HTTP 404 if the board does not exist.
    """
    _get_board_or_404(board_id, db)
    return (
        db.query(BoardElement)
        .filter(BoardElement.board_id == board_id)
        .order_by(BoardElement.position)
        .all()
    )


# ---------------------------------------------------------------------------
# Create (single element)
# ---------------------------------------------------------------------------
@router.post("/", response_model=BoardElementRead, status_code=status.HTTP_201_CREATED)
def add_element(
    board_id: uuid.UUID,
    payload: BoardElementCreate,
    db: Session = Depends(get_db),
) -> BoardElement:
    """
    Add a single element to the board.

    The ``id`` must be provided by the client (UUID) so element identity is
    stable across WebSocket events and REST saves.
    """
    board = _get_board_or_404(board_id, db)

    element = BoardElement(
        id=payload.id,
        board_id=board_id,
        type=payload.type,
        data=payload.data,
        color=payload.color,
        stroke_width=payload.stroke_width,
        position=payload.position,
    )
    db.add(element)

    # Bump board's updated_at so clients can detect staleness
    board.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(element)
    return element


# ---------------------------------------------------------------------------
# Batch replace (whole-board save)
# ---------------------------------------------------------------------------
@router.put("/batch", response_model=list[BoardElementRead])
def batch_replace_elements(
    board_id: uuid.UUID,
    payload: BoardElementBatchReplace,
    db: Session = Depends(get_db),
) -> list[BoardElement]:
    """
    Replace **all** elements on a board atomically.

    1. Delete every existing element on the board.
    2. Insert the new set provided in the request body.
    3. Return the newly inserted elements.

    This is the canonical "save the whole canvas" operation used after the
    user stops drawing or explicitly saves.
    """
    board = _get_board_or_404(board_id, db)

    # Delete existing elements
    db.query(BoardElement).filter(BoardElement.board_id == board_id).delete(
        synchronize_session="fetch"
    )

    # Insert new elements
    new_elements: list[BoardElement] = []
    for elem_data in payload.elements:
        elem = BoardElement(
            id=elem_data.id,
            board_id=board_id,
            type=elem_data.type,
            data=elem_data.data,
            color=elem_data.color,
            stroke_width=elem_data.stroke_width,
            position=elem_data.position,
        )
        db.add(elem)
        new_elements.append(elem)

    board.updated_at = datetime.now(timezone.utc)
    db.commit()

    for elem in new_elements:
        db.refresh(elem)

    return new_elements


# ---------------------------------------------------------------------------
# Delete (single element)
# ---------------------------------------------------------------------------
@router.delete(
    "/{element_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_element(
    board_id: uuid.UUID,
    element_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> None:
    """
    Delete a single element from a board.
    Returns HTTP 204 on success, HTTP 404 if board or element is not found.
    """
    element = _get_element_or_404(board_id, element_id, db)
    db.delete(element)
    db.commit()
