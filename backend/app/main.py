import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import get_settings
from app.database import engine, init_db
from app.routers import auth, leads
from app.schemas import HealthOut

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s %(name)s  %(message)s",
)
logger = logging.getLogger("apogee")

settings = get_settings()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    logger.info("База готова: %s", settings.database_url)
    if settings.mail_enabled:
        logger.info("Почта настроена, уведомления уходят на %s", settings.mail_to)
    else:
        logger.warning(
            "SMTP не настроен — заявки будут сохраняться в базу, но письма не отправляются. "
            "Заполните backend/.env (см. .env.example)."
        )
    yield


app = FastAPI(
    title="Apogee API",
    description="Бэкенд сайта Apogee: заявки, авторизация и уведомления на почту.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=settings.cors_origin_regex or None,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(leads.router)
app.include_router(auth.router)


@app.get("/api/health", response_model=HealthOut, tags=["Служебное"])
def health() -> HealthOut:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        database = "ok"
    except Exception as exc:  # noqa: BLE001
        database = f"error: {type(exc).__name__}"

    return HealthOut(
        status="ok",
        database=database,
        database_engine=engine.dialect.name,
        mail_configured=settings.mail_enabled,
        telegram_configured=settings.telegram_enabled,
    )
