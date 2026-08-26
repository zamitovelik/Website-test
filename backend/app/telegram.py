"""Уведомления о заявках в Telegram через Bot API."""

import json
import logging
import urllib.error
import urllib.request

from app.config import get_settings
from app.database import SessionLocal
from app.models import Lead

logger = logging.getLogger("apogee.telegram")
settings = get_settings()

API_BASE = "https://api.telegram.org"
TIMEOUT = 20

KIND_TITLES = {
    "demo": "Новая заявка на демо",
    "contact": "Новое сообщение из формы контактов",
}


class TelegramError(Exception):
    pass


def call_api(method: str, token: str, payload: dict, timeout: int = TIMEOUT) -> dict:
    """Вызывает метод Bot API и возвращает поле result."""
    # Токен уходит прямо в адрес запроса, а он допускает только ASCII.
    # Проверяем заранее, иначе получим UnicodeEncodeError вместо внятной ошибки.
    if not token.isascii():
        raise TelegramError(
            "в токене есть символы не из латиницы — похоже, он скопирован с ошибкой"
        )

    url = f"{API_BASE}/bot{token}/{method}"
    data = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(url, data=data, method="POST")
    request.add_header("Content-Type", "application/json")

    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            body = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        try:
            body = json.loads(exc.read().decode("utf-8"))
        except Exception:  # noqa: BLE001
            raise TelegramError(f"HTTP {exc.code}") from None
        raise TelegramError(body.get("description") or f"HTTP {exc.code}") from None
    except urllib.error.URLError as exc:
        raise TelegramError(f"нет связи с Telegram: {exc.reason}") from None
    except (OSError, ValueError) as exc:
        # Таймаут, оборванное соединение, битый ответ — всё в одну понятную ошибку.
        raise TelegramError(f"{type(exc).__name__}: {exc}") from None

    if not body.get("ok"):
        raise TelegramError(body.get("description") or "неизвестная ошибка")

    return body.get("result", {})


def _escape(value: str) -> str:
    return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build_message(lead: Lead) -> str:
    title = KIND_TITLES.get(lead.kind, "Новая заявка")
    created = lead.created_at.strftime("%d.%m.%Y %H:%M UTC") if lead.created_at else "—"

    rows = [
        ("Имя", lead.name),
        ("Компания", lead.company),
        ("Почта", lead.email),
        ("Команда", lead.team_size),
        ("Тема", lead.topic),
        ("Задача", lead.message),
    ]

    lines = [f"<b>{_escape(title)} #{lead.id}</b>", ""]
    lines += [f"{_escape(label)}: {_escape(str(value))}" for label, value in rows if value]
    lines += ["", f"<i>{_escape(created)}</i>"]

    return "\n".join(lines)


def send_message(token: str, chat_id: str, text: str) -> None:
    call_api(
        "sendMessage",
        token,
        {
            "chat_id": chat_id,
            "text": text,
            "parse_mode": "HTML",
            "disable_web_page_preview": True,
        },
    )


def send_lead_telegram(lead_id: int) -> None:
    """
    Отправляет уведомление о заявке. Вызывается фоновой задачей и никогда
    не бросает исключение наружу: результат пишется в саму заявку.
    """
    db = SessionLocal()
    try:
        lead = db.get(Lead, lead_id)
        if lead is None:
            logger.warning("Заявка %s не найдена, уведомление не отправлено", lead_id)
            return

        if not settings.telegram_enabled:
            lead.telegram_error = "Telegram не настроен — уведомление не отправлялось"
            db.commit()
            return

        try:
            send_message(settings.telegram_bot_token, settings.telegram_chat_id, build_message(lead))
            lead.telegram_sent = True
            lead.telegram_error = None
            logger.info("Уведомление по заявке %s отправлено в Telegram", lead_id)
        except Exception as exc:  # noqa: BLE001 — фоновая задача не должна падать
            lead.telegram_sent = False
            lead.telegram_error = f"{type(exc).__name__}: {exc}"[:2000]
            logger.exception("Не удалось отправить уведомление по заявке %s", lead_id)

        db.commit()
    finally:
        db.close()
