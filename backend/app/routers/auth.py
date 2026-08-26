from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.ratelimit import client_ip, login_limiter
from app.schemas import LoginIn, TokenOut, UserOut
from app.security import create_access_token, get_current_user, verify_password

router = APIRouter(prefix="/api/auth", tags=["Авторизация"])


@router.post("/login", response_model=TokenOut)
def login(
    payload: LoginIn,
    request: Request,
    db: Session = Depends(get_db),
) -> TokenOut:
    login_limiter.check(client_ip(request))

    user = db.query(User).filter(User.email == str(payload.email).lower().strip()).first()

    # Одна и та же ошибка для неверной почты и неверного пароля —
    # чтобы нельзя было перебором узнать, какие адреса зарегистрированы.
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверная почта или пароль",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Учётная запись отключена",
        )

    user.last_login_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)

    token, expires_in = create_access_token(user.email)
    return TokenOut(access_token=token, expires_in=expires_in, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)) -> UserOut:
    return UserOut.model_validate(current_user)
