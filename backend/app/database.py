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


_ensure_sqlite_dir(settings.database_url)

# check_same_thread=False нужен, потому что FastAPI обслуживает запросы в пуле потоков.
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if settings.database_url.startswith("sqlite") else {},
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


@event.listens_for(Engine, "connect")
def _set_sqlite_pragma(dbapi_connection, _connection_record) -> None:
    """WAL заметно лучше держит одновременные чтение и запись в SQLite."""
    if settings.database_url.startswith("sqlite"):
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


# Колонки, появившиеся после первого выпуска. create_all() умеет создавать
# только новые таблицы и не трогает существующие, поэтому добавляем вручную.
_LATER_COLUMNS: dict[str, dict[str, str]] = {
    "leads": {
        "telegram_sent": "BOOLEAN DEFAULT 0",
        "telegram_error": "TEXT",
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
