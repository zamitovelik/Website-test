"""
Создаёт пользователя для входа на сайт.

Запуск из папки backend:
    python -m scripts.create_user

Пароль запрашивается скрытым вводом и нигде не сохраняется в открытом виде —
в базу попадает только bcrypt-хеш.
"""

import getpass
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.database import SessionLocal, init_db  # noqa: E402
from app.models import User  # noqa: E402
from app.security import hash_password  # noqa: E402


def main() -> int:
    init_db()

    email = input("Почта: ").strip().lower()
    if not email or "@" not in email:
        print("Некорректная почта.")
        return 1

    full_name = input("Имя (можно пропустить): ").strip() or None

    password = getpass.getpass("Пароль: ")
    if len(password) < 8:
        print("Пароль должен быть не короче 8 символов.")
        return 1

    if password != getpass.getpass("Повторите пароль: "):
        print("Пароли не совпадают.")
        return 1

    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            existing.hashed_password = hash_password(password)
            if full_name:
                existing.full_name = full_name
            db.commit()
            print(f"Пароль пользователя {email} обновлён.")
        else:
            db.add(
                User(
                    email=email,
                    full_name=full_name,
                    hashed_password=hash_password(password),
                )
            )
            db.commit()
            print(f"Пользователь {email} создан.")
    finally:
        db.close()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
