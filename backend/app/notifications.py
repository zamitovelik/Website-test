"""
Единая точка отправки уведомлений о заявке.

Каждый канал настраивается независимо и падает молча: заявка уже сохранена
в базе, а причина неудачи записывается в саму заявку.
"""

import logging

from app.mailer import send_lead_email
from app.telegram import send_lead_telegram

logger = logging.getLogger("apogee.notifications")


def notify_lead(lead_id: int) -> None:
    for name, sender in (("почта", send_lead_email), ("telegram", send_lead_telegram)):
        try:
            sender(lead_id)
        except Exception:  # noqa: BLE001 — один упавший канал не мешает другому
            logger.exception("Канал %s не смог обработать заявку %s", name, lead_id)
