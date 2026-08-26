from collections.abc import Generator
from pathlib import Path

from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import get_settings

settings = get_settings()


def _ensure_sqlite_dir(url: str) -> None:
    """
    Создаёт папку для файла базы, если её нет.

    На Railway база лежит на подключённом диске (например /data/apogee.db).
    Если папку не создать заранее, SQLite падает с «unable to open database file».
    """
    if not url.startswith("sqlite"):
        return

    path = url.split("sqlite:///", 1)[-1]
    if not path or path == ":memory:":
        return

    parent = Path(path).expanduser().parent
    if str(parent) not in ("", "."):
        parent.mkdir(parents=True, exist_ok=True)


DB_URL = settings.sqlalchemy_url

_ensure_sqlite_dir(DB_URL)

# check_same_thread=False нужен, потому что FastAPI обслуживает запросы в пуле потоков.
engine = create_engine(
    DB_URL,
    pool_pre_ping=True,
    connect_args={"check_same_thread": False} if DB_URL.startswith("sqlite") else {},
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


@event.listens_for(Engine, "connect")
def _set_sqlite_pragma(dbapi_connection, _connection_record) -> None:
    """WAL заметно лучше держит одновременные чтение и запись в SQLite."""
    if DB_URL.startswith("sqlite"):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    # Импорт моделей обязателен до create_all, иначе таблицы не зарегистрированы.
    from app import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
    _add_missing_columns()
    _ensure_first_user_is_admin()


# Колонки, появившиеся после первого выпуска. create_all() умеет создавать
# только новые таблицы и не трогает существующие, поэтому добавляем вручную.
_LATER_COLUMNS: dict[str, dict[str, str]] = {
    "leads": {
        "telegram_sent": "BOOLEAN DEFAULT false",
        "telegram_error": "TEXT",
    },
    "users": {
        "is_admin": "BOOLEAN DEFAULT false",
    },
}


def _add_missing_columns() -> None:
    from sqlalchemy import inspect, text

    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())

    with engine.begin() as conn:
        for table, columns in _LATER_COLUMNS.items():
            if table not in existing_tables:
                continue

            present = {col["name"] for col in inspector.get_columns(table)}
            for name, definition in columns.items():
                if name not in present:
                    conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {name} {definition}"))


def _ensure_first_user_is_admin() -> None:
    """
    Гарантирует, что администратор в системе есть хотя бы один.

    Колонка is_admin появилась позже и по умолчанию false, поэтому у аккаунтов,
    созданных раньше, доступ к заявкам иначе пропал бы. Тот же случай — первый
    зарегистрировавшийся на пустой базе: он и становится администратором.
    """
    from sqlalchemy import text

    with engine.begin() as conn:
        has_admin = conn.execute(
            text("SELECT 1 FROM users WHERE is_admin = true LIMIT 1")
        ).first()
        if has_admin:
            return

        first_id = conn.execute(text("SELECT id FROM users ORDER BY id LIMIT 1")).scalar()
        if first_id is not None:
            conn.execute(text("UPDATE users SET is_admin = true WHERE id = :id"), {"id": first_id})
