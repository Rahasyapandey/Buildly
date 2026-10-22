"""Initial schema — create users, boards, and board_elements tables.

Revision ID: 001
Revises:
Create Date: 2026-10-19

Tables created (in dependency order):
  1. users
  2. boards
  3. board_elements  (FK → boards.id ON DELETE CASCADE)
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# ---------------------------------------------------------------------------
# Revision identifiers
# ---------------------------------------------------------------------------
revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create all Buildly tables."""

    # ------------------------------------------------------------------
    # 1. users
    # ------------------------------------------------------------------
    op.create_table(
        "users",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("email", sa.Text(), unique=True, nullable=False),
        sa.Column("name", sa.Text(), nullable=False, server_default=""),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("NOW()"),
            nullable=False,
        ),
    )

    # ------------------------------------------------------------------
    # 2. boards
    # ------------------------------------------------------------------
    op.create_table(
        "boards",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column(
            "title",
            sa.Text(),
            nullable=False,
            server_default="Untitled Board",
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("NOW()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("NOW()"),
            nullable=False,
        ),
    )

    # ------------------------------------------------------------------
    # 3. board_elements
    # ------------------------------------------------------------------
    op.create_table(
        "board_elements",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            nullable=False,
            # No server_default — ID is always provided by the client
        ),
        sa.Column(
            "board_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("boards.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column("type", sa.String(32), nullable=False),
        sa.Column("data", postgresql.JSONB(), nullable=False),
        sa.Column("color", sa.Text(), nullable=False),
        sa.Column(
            "stroke_width",
            sa.Float(),
            nullable=False,
            server_default="2",
        ),
        sa.Column(
            "position",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("NOW()"),
            nullable=False,
        ),
    )

    # Explicit index on board_id for fast element lookups per board
    op.create_index(
        "ix_board_elements_board_id",
        "board_elements",
        ["board_id"],
    )


def downgrade() -> None:
    """Drop all Buildly tables in reverse dependency order."""
    op.drop_index("ix_board_elements_board_id", table_name="board_elements")
    op.drop_table("board_elements")
    op.drop_table("boards")
    op.drop_table("users")
