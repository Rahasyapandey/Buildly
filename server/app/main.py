"""
main.py — FastAPI application factory for Buildly backend.

Registers:
  - CORS middleware (allowing the Vite dev-server origin)
  - REST routers: boards, elements
  - WebSocket router: ws
  - Startup event: creates all DB tables for easy local dev (no migrations needed)
"""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import boards, elements
from app.routers import ws as ws_router

logging.basicConfig(level=logging.DEBUG if settings.debug else logging.INFO)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Application
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Buildly API",
    description="Collaborative whiteboard backend — REST + WebSocket",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS — must be registered before routers so pre-flight OPTIONS requests work
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(boards.router)
app.include_router(elements.router)
app.include_router(ws_router.router)


# ---------------------------------------------------------------------------
# Startup: auto-create tables (safe for local dev; use Alembic for production)
# ---------------------------------------------------------------------------
@app.on_event("startup")
async def create_tables() -> None:
    """
    Create all ORM-defined tables if they don't already exist.

    This is a convenience for local development so you can run the server
    without first running ``alembic upgrade head``.  In production, run
    Alembic migrations explicitly before starting the app.
    """
    logger.info("Running startup table creation (create_all)…")
    Base.metadata.create_all(bind=engine)
    logger.info("Tables ready.")


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["health"])
async def health() -> dict[str, str]:
    """Simple liveness check — returns HTTP 200 with status ok."""
    return {"status": "ok"}
