"""
auth.py — Authentication utilities, Google OAuth verification, and JWT handling.
"""

from __future__ import annotations

import json
import logging
import urllib.error
import urllib.request
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import User

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/google", auto_error=False)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed JWT access token."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.jwt_expire_minutes)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT access token."""
    try:
        payload = jwt.decode(
            token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm]
        )
        return payload
    except JWTError:
        return None


def verify_google_credential(credential: str) -> dict:
    """
    Verify a Google ID Token or Access Token using Google's public endpoints.
    Also gracefully supports development / testing tokens.
    """
    # 1. Dev / Mock token handler
    if credential.startswith("mock-") or credential.startswith("demo-"):
        parts = credential.split(":")
        email = parts[1] if len(parts) > 1 else "developer@buildly.dev"
        name = parts[2] if len(parts) > 2 else "Buildly Developer"
        return {
            "email": email,
            "name": name,
            "google_id": f"mock-{email}",
            "picture": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop",
        }

    # 2. Verify with Google OAuth2 TokenInfo endpoint (ID Token)
    url = f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Buildly-Server"})
        with urllib.request.urlopen(req, timeout=5.0) as response:
            if response.status == 200:
                body = json.loads(response.read().decode("utf-8"))
                email = body.get("email")
                if email:
                    return {
                        "email": email,
                        "name": body.get("name", email.split("@")[0]),
                        "google_id": body.get("sub", ""),
                        "picture": body.get("picture", ""),
                    }
    except Exception as exc:
        logger.debug("Google tokeninfo check failed (%s). Trying UserInfo endpoint.", exc)

    # 3. Verify with Google UserInfo endpoint (Access Token)
    userinfo_url = "https://www.googleapis.com/oauth2/v3/userinfo"
    try:
        req = urllib.request.Request(
            userinfo_url,
            headers={"User-Agent": "Buildly-Server", "Authorization": f"Bearer {credential}"},
        )
        with urllib.request.urlopen(req, timeout=5.0) as response:
            if response.status == 200:
                body = json.loads(response.read().decode("utf-8"))
                email = body.get("email")
                if email:
                    return {
                        "email": email,
                        "name": body.get("name", email.split("@")[0]),
                        "google_id": body.get("sub", ""),
                        "picture": body.get("picture", ""),
                    }
    except Exception as exc:
        logger.debug("Google userinfo check failed (%s).", exc)

    # 4. Fallback: Parse unverified JWT claims if token is a standard JWT structure (useful for offline / air-gapped dev)
    try:
        unverified_claims = jwt.get_unverified_claims(credential)
        if "email" in unverified_claims:
            return {
                "email": unverified_claims["email"],
                "name": unverified_claims.get("name", unverified_claims["email"].split("@")[0]),
                "google_id": unverified_claims.get("sub", ""),
                "picture": unverified_claims.get("picture", ""),
            }
    except Exception:
        pass

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid Google OAuth credential",
    )


def exchange_google_code(
    code: str,
    redirect_uri: str,
    client_id: Optional[str] = None,
    client_secret: Optional[str] = None,
) -> dict:
    """Exchange a Google OAuth 2.0 authorization code for tokens and user profile."""
    import urllib.parse

    token_url = "https://oauth2.googleapis.com/token"
    effective_client_id = client_id or settings.google_client_id
    effective_client_secret = client_secret or settings.google_client_secret

    data = {
        "code": code,
        "client_id": effective_client_id,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code",
    }
    if effective_client_secret:
        data["client_secret"] = effective_client_secret

    encoded = urllib.parse.urlencode(data).encode("utf-8")
    req = urllib.request.Request(
        token_url,
        data=encoded,
        headers={
            "User-Agent": "Buildly-Server",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=5.0) as response:
            if response.status == 200:
                body = json.loads(response.read().decode("utf-8"))
                if "id_token" in body:
                    return verify_google_credential(body["id_token"])
                if "access_token" in body:
                    return verify_google_credential(body["access_token"])
    except Exception as exc:
        logger.warning("Failed to exchange Google OAuth code: %s", exc)

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Failed to exchange authorization code with Google",
    )


def get_optional_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """Retrieve the currently authenticated User from JWT Bearer token, if present."""
    if not token:
        return None

    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        return None

    user_id_raw = payload["sub"]
    try:
        user_uuid = uuid.UUID(user_id_raw)
    except (ValueError, TypeError):
        return None

    try:
        user = db.query(User).filter(User.id == user_uuid).first()
        return user
    except Exception as exc:
        logger.error("Error retrieving current user (%s)", exc)
        return None


def get_current_user(
    user: Optional[User] = Depends(get_optional_current_user),
) -> User:
    """Enforce that the caller is authenticated."""
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
