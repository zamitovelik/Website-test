import logging
import smtplib
from email.message import EmailMessage
from email.utils import formataddr

from app.config import get_settings
from app.database import SessionLocal
from app.models import Lead

logger = logging.getLogger("apogee.mailer")
settings = get_settings()

KIND_TITLES = {
    "demo": "Заявка на демо",
    "contact": "Сообщение из формы контактов",
}


def _format_body(lead: Lead) -> tuple[str, str]:
    """Возвращает пару (текстовая версия, HTML-версия) письма."""
    title = KIND_TITLES.get(lead.kind, "Заявка с сайта")
    created = lead.created_at.strftime("%d.%m.%Y %H:%M UTC") if lead.created_at else "—"

    rows: list[tuple[str, str | None]] = [
        ("Имя", lead.name),
        ("Почта", lead.email),
        ("Компания", lead.company),
        ("Размер команды", lead.team_size),
        ("Тема", lead.topic),
        ("Сообщение", lead.message),
        ("Страница", lead.source_path),
        ("IP", lead.ip_address),
        ("Получено", created),
    ]
    visible = [(label, value) for label, value in rows if value]

    text = f"{title} #{lead.id}\n\n" + "\n".join(f"{label}: {value}" for label, value in visible)

    def esc(value: str) -> str:
        return (
            value.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\n", "<br>")
        )

    html_rows = "".join(
        f'<tr>'
        f'<td style="padding:8px 16px 8px 0;color:#6b7280;font-size:13px;'
        f'vertical-align:top;white-space:nowrap">{esc(label)}</td>'
        f'<td style="padding:8px 0;color:#111827;font-size:14px">{esc(str(value))}</td>'
        f"</tr>"
        for label, value in visible
    )

    html = f"""\
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            background:#f5f6f8;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;
              padding:28px;border:1px solid #e5e7eb">
    <p style="margin:0 0 4px;color:#6b7280;font-size:12px;letter-spacing:.08em;
              text-transform:uppercase">Apogee</p>
    <h1 style="margin:0 0 20px;font-size:20px;font-weight:600;color:#111827">
      {esc(title)} #{lead.id}
    </h1>
    <table style="width:100%;border-collapse:collapse">{html_rows}</table>
  </div>
</div>"""

    return text, html


def _build_message(lead: Lead) -> EmailMessage:
    title = KIND_TITLES.get(lead.kind, "Заявка с сайта")
    text, html = _format_body(lead)

    msg = EmailMessage()
    msg["Subject"] = f"{title} #{lead.id} — {lead.name}"
    msg["From"] = formataddr((settings.mail_from_name, settings.mail_from or settings.smtp_user))
    msg["To"] = settings.mail_to
    # Чтобы «Ответить» в почте писало прямо заявителю.
    msg["Reply-To"] = lead.email
    msg.set_content(text)
    msg.add_alternative(html, subtype="html")
    return msg


def send_lead_email(lead_id: int) -> None:
    """
    Отправляет уведомление о заявке. Вызывается фоновой задачей, поэтому
    никогда не бросает исключение наружу: результат пишется в саму заявку.
    """
    db = SessionLocal()
    try:
        lead = db.get(Lead, lead_id)
        if lead is None:
            logger.warning("Заявка %s не найдена, письмо не отправлено", lead_id)
            return

        if not settings.mail_enabled:
            lead.email_error = "SMTP не настроен — письмо не отправлялось"
            db.commit()
            logger.info("SMTP не настроен, заявка %s сохранена только в базе", lead_id)
            return

        try:
            msg = _build_message(lead)
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as smtp:
                smtp.ehlo()
                if settings.smtp_starttls:
                    smtp.starttls()
                    smtp.ehlo()
                smtp.login(settings.smtp_user, settings.smtp_password)
                smtp.send_message(msg)

            lead.email_sent = True
            lead.email_error = None
            logger.info("Письмо по заявке %s отправлено на %s", lead_id, settings.mail_to)
        except Exception as exc:  # noqa: BLE001 — фоновая задача не должна падать
            lead.email_sent = False
            lead.email_error = f"{type(exc).__name__}: {exc}"[:2000]
            logger.exception("Не удалось отправить письмо по заявке %s", lead_id)

        db.commit()
    finally:
        db.close()
