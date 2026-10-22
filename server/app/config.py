"""
config.py — Application settings loaded from environment variables.
Uses pydantic-settings so values can be overridden via a .env file or
actual environment variables without changing code.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration object for the Buildly backend."""

    # PostgreSQL / SQLite connection string
    database_url: str = "postgresql://buildly:buildly_dev@localhost:5432/buildly"

    # Comma-separated list of allowed CORS origins
    allowed_origins: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    # Enable SQLAlchemy echo / debug logging
    debug: bool = False

    # Google OAuth & JWT Settings
    google_client_id: str = ""
    google_client_secret: str = ""
    jwt_secret_key: str = "buildly-dev-secret-key-32-chars-long-jwt"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # 7 days

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @property
    def origins_list(self) -> list[str]:
        """Return ALLOWED_ORIGINS as a Python list."""
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]


# Module-level singleton — import this everywhere
settings = Settings()
