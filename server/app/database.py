"""
database.py — SQLAlchemy engine and session factory.

Provides:
  - engine        → SQLAlchemy Engine connected to PostgreSQL
  - SessionLocal  → sessionmaker factory
  - Base          → declarative base for ORM models
  - get_db()      → FastAPI dependency that yields a DB session
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings


# ---------------------------------------------------------------------------
# Engine
# ---------------------------------------------------------------------------
engine = create_engine(
    settings.database_url,
    echo=settings.debug,  # log SQL when DEBUG=true
    pool_pre_ping=True,   # recycle stale connections automatically
)

# ---------------------------------------------------------------------------
# Session factory
# ---------------------------------------------------------------------------
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


# ---------------------------------------------------------------------------
# Declarative base — all ORM models inherit from this
# ---------------------------------------------------------------------------
class Base(DeclarativeBase):
    """Shared declarative base for all Buildly ORM models."""
    pass


# ---------------------------------------------------------------------------
# Dependency
# ---------------------------------------------------------------------------
def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that opens a database session for the duration of a
    request and guarantees it is closed afterwards, even on exception.
    """
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
