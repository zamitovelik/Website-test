"""
Проверяет настройки SMTP из backend/.env, отправляя тестовое письмо на MAIL_TO.

Запуск из папки backend:
    python -m scripts.send_test_email

Ничего не пишет в базу — только проверяет, что почта настроена верно.
"""

import smtplib
import sys
from email.message import EmailMessage
from email.utils import formataddr
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.stdout.reconfigure(encoding="utf-8")

from app.config import get_settings  # noqa: E402


def main() -> int:
    s = get_settings()

    missing = [
        name
        for name, value in (
            ("SMTP_HOST", s.smtp_host),
            ("SMTP_USER", s.smtp_user),
            ("SMTP_PASSWORD", s.smtp_password),
            ("MAIL_TO", s.mail_to),
        )
        if not value
    ]
    if missing:
        print("Не заполнены переменные в backend/.env: " + ", ".join(missing))
        print("Заявки при этом всё равно сохраняются в базу — не уходят только письма.")
        return 1

    msg = EmailMessage()
    msg["Subject"] = "Apogee — проверка настроек почты"
    msg["From"] = formataddr((s.mail_from_name, s.mail_from or s.smtp_user))
    msg["To"] = s.mail_to
    msg.set_content(
        "Если вы читаете это письмо, SMTP настроен верно "
        "и уведомления о заявках будут приходить на этот адрес."
    )

    print(f"Подключаюсь к {s.smtp_host}:{s.smtp_port} (STARTTLS={s.smtp_starttls})…")
    try:
        with smtplib.SMTP(s.smtp_host, s.smtp_port, timeout=20) as smtp:
            smtp.ehlo()
            if s.smtp_starttls:
                smtp.starttls()
                smtp.ehlo()
            smtp.login(s.smtp_user, s.smtp_password)
            smtp.send_message(msg)
    except smtplib.SMTPAuthenticationError:
        print("Ошибка авторизации на SMTP-сервере.")
        print("Для Gmail нужен пароль приложения: https://myaccount.google.com/apppasswords")
        return 1
    except Exception as exc:  # noqa: BLE001
        print(f"Не удалось отправить: {type(exc).__name__}: {exc}")
        return 1

    print(f"Готово — письмо отправлено на {s.mail_to}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
