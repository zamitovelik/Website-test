from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Конфигурация читается из backend/.env (см. .env.example)."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Приложение
    secret_key: str = "dev-secret-change-me"
    access_token_expire_minutes: int = 1440
    # Домены, которым разрешено обращаться к API. По умолчанию — локальная
    # разработка и опубликованный сайт, чтобы не задавать это вручную на хостинге.
    cors_origins: str = (
        "http://localhost:5173,"
        "http://127.0.0.1:5173,"
        "https://website-murex-two-60.vercel.app,"
        "https://website-zamitoveliks-projects.vercel.app"
    )
    # Необязательный шаблон — например ^https://.*\.vercel\.app$ для превью-сборок.
    cors_origin_regex: str = ""
    database_url: str = "sqlite:///./apogee.db"

    # Почта
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_starttls: bool = True
    mail_from: str = ""
    mail_from_name: str = "Apogee"
    mail_to: str = ""

    # Telegram
    telegram_bot_token: str = ""
    telegram_chat_id: str = ""

    # Админка
    admin_token: str = ""

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def sqlalchemy_url(self) -> str:
        """
        Приводит адрес базы к виду, понятному SQLAlchemy.

        Railway для своей Postgres подставляет DATABASE_URL вида
        postgres://… или postgresql://…, а установленный драйвер — psycopg 3,
        который подключается только по схеме postgresql+psycopg://.
        """
        url = self.database_url
        if url.startswith("postgres://"):
            url = "postgresql://" + url[len("postgres://") :]
        if url.startswith("postgresql://"):
            url = "postgresql+psycopg://" + url[len("postgresql://") :]
        return url

    @property
    def mail_enabled(self) -> bool:
        """Письма уходят только если SMTP и получатель настроены полностью."""
        return bool(self.smtp_host and self.smtp_user and self.smtp_password and self.mail_to)

    @property
    def telegram_enabled(self) -> bool:
        return bool(self.telegram_bot_token and self.telegram_chat_id)


@lru_cache
def get_settings() -> Settings:
    return Settings()
