"""
database.py — SQLAlchemy engine and session factory.

Provides:
  - engine        → SQLAlchemy Engine connected to PostgreSQL
  - SessionLocal  → sessionmaker factory
  - Base          → declarative base for ORM models
  - get_db()      → FastAPI dependency that yields a DB session
"""

import logging
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Engine with automatic fallback to local SQLite if PostgreSQL is not running
# ---------------------------------------------------------------------------
db_url = settings.database_url
is_sqlite = db_url.startswith("sqlite")

try:
    if not is_sqlite:
        test_engine = create_engine(db_url, echo=settings.debug, pool_pre_ping=True)
        with test_engine.connect():
            pass
        engine = test_engine
        logger.info("Connected to PostgreSQL database at %s", db_url.split("@")[-1])
    else:
        engine = create_engine(db_url, echo=settings.debug, connect_args={"check_same_thread": False})
except Exception as exc:
    logger.warning(
        "Could not connect to PostgreSQL (%s). Falling back to local SQLite database (buildly.db).",
        exc,
    )
    db_url = "sqlite:///./buildly.db"
    is_sqlite = True
    engine = create_engine(db_url, echo=settings.debug, connect_args={"check_same_thread": False})

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
