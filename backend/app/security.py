from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models import User

settings = get_settings()

ALGORITHM = "HS256"


def _encode(password: str) -> bytes:
    # bcrypt читает максимум 72 байта и молча игнорирует остаток —
    # обрезаем явно, чтобы длина пароля вела себя предсказуемо.
    return password.encode("utf-8")[:72]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(_encode(password), bcrypt.gensalt()).decode("ascii")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(_encode(plain), hashed.encode("ascii"))
    except ValueError:
        # Повреждённый или чужого формата хеш — считаем пароль неверным.
        return False


def create_access_token(subject: str) -> tuple[str, int]:
    expires_in = settings.access_token_expire_minutes * 60
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": subject, "exp": expire, "iat": datetime.now(timezone.utc)}
    token = jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)
    return token, expires_in


def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Требуется вход в систему",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not authorization or not authorization.lower().startswith("bearer "):
        raise credentials_error

    token = authorization.split(" ", 1)[1].strip()
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        raise credentials_error from None

    email = payload.get("sub")
    if not email:
        raise credentials_error

    user = db.query(User).filter(User.email == email).first()
    if user is None or not user.is_active:
        raise credentials_error

    return user
