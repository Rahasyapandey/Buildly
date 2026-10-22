"""
routers/auth.py — Authentication endpoints for Buildly.
Supports Google OAuth 2.0 Sign-In and 1-click Demo Developer Sign-In.
"""

from datetime import datetime, timezone
import logging
import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.auth import create_access_token, get_current_user, verify_google_credential
from app.database import get_db
from app.models import User
from app.schemas import DemoLoginRequest, GoogleAuthRequest, TokenResponse, UserRead

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/google", response_model=TokenResponse)
async def google_login(
    payload: GoogleAuthRequest,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """
    Authenticate a user using a Google OAuth ID token (credential).
    Finds existing user by email or creates a new account.
    Returns a signed JWT access token and user profile.
    """
    profile = verify_google_credential(payload.credential)
    email = profile["email"].lower().strip()
    name = profile.get("name") or email.split("@")[0]
    picture = profile.get("picture")
    google_id = profile.get("google_id")

    # Find or create user
    user = db.query(User).filter(User.email == email).first()
    now = datetime.now(timezone.utc)

    if not user:
        user = User(
            id=uuid.uuid4(),
            email=email,
            name=name,
            avatar_url=picture,
            google_id=google_id,
            created_at=now,
            last_login=now,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info("Created new user via Google OAuth: %s (%s)", email, user.id)
    else:
        # Update profile with latest Google info
        user.last_login = now
        if name and not user.name:
            user.name = name
        if picture and not user.avatar_url:
            user.avatar_url = picture
        if google_id and not user.google_id:
            user.google_id = google_id
        db.commit()
        db.refresh(user)
        logger.info("User logged in via Google OAuth: %s (%s)", email, user.id)

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserRead.model_validate(user),
    )


@router.post("/demo-login", response_model=TokenResponse)
async def demo_login(
    payload: DemoLoginRequest = DemoLoginRequest(),
    db: Session = Depends(get_db),
) -> TokenResponse:
    """
    Instant 1-click developer/tester login.
    Allows testing authenticated board sync, real-time rooms, and user profiles
    without requiring a Google Cloud client ID setup.
    """
    email = (payload.email or "alex.architect@buildly.dev").lower().strip()
    name = payload.name or "Alex Architect"
    avatar = payload.avatar_url or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop"

    user = db.query(User).filter(User.email == email).first()
    now = datetime.now(timezone.utc)

    if not user:
        user = User(
            id=uuid.uuid4(),
            email=email,
            name=name,
            avatar_url=avatar,
            google_id=f"demo-{email}",
            created_at=now,
            last_login=now,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info("Created demo user: %s", email)
    else:
        user.last_login = now
        db.commit()
        db.refresh(user)

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserRead.model_validate(user),
    )


@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)) -> UserRead:
    """Return the profile of the currently authenticated user."""
    return UserRead.model_validate(current_user)


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout() -> dict[str, str]:
    """Client-side session termination confirmation."""
    return {"message": "Logged out successfully"}
