"""
alembic/env.py — Alembic migration environment.

Reads DATABASE_URL from the app's Settings so migrations always run against
the same database as the running application.
"""

from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

# ---------------------------------------------------------------------------
# Import ORM Base so Alembic can inspect the model metadata for autogenerate
# ---------------------------------------------------------------------------
from app.database import Base  # noqa: F401 — registers all mapped tables
import app.models  # noqa: F401 — ensures all models are imported and registered

# ---------------------------------------------------------------------------
# Read DATABASE_URL from pydantic settings (honours .env file)
# ---------------------------------------------------------------------------
from app.config import settings

# Alembic Config object — provides access to values in alembic.ini
config = context.config

# Override the sqlalchemy.url from alembic.ini with the one from Settings
config.set_main_option("sqlalchemy.url", settings.database_url)

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadata for 'autogenerate' support
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.

    Configures the context with just a URL (no Engine) so DDL can be emitted
    to stdout or a script file without a live DB connection.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode (normal path).

    Creates an Engine, associates it with a connection, and then invokes the
    migration context.
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
