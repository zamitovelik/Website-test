"""
Настройка почты в один заход: спрашивает данные, сам правит backend/.env
и сразу отправляет проверочное письмо.

Запуск из папки backend:
    python -m scripts.setup_mail

Пароль вводится скрыто (на экране не появляется) и попадает только в файл
.env на вашем компьютере. Файл в git не отправляется.
"""

import getpass
import smtplib
import sys
from email.message import EmailMessage
from email.utils import formataddr
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.stdout.reconfigure(encoding="utf-8")

ENV_PATH = Path(__file__).resolve().parents[1] / ".env"
ENV_EXAMPLE = Path(__file__).resolve().parents[1] / ".env.example"

# Готовые настройки популярных почт: host, port, starttls, подсказка про пароль
PROVIDERS = {
    "1": (
        "Gmail",
        "smtp.gmail.com",
        587,
        True,
        "Нужен пароль приложения: https://myaccount.google.com/apppasswords\n"
        "   (сначала включите двухэтапную проверку, иначе раздел не откроется)",
    ),
    "2": (
        "Яндекс Почта",
        "smtp.yandex.ru",
        587,
        True,
        "Нужен пароль приложения: Яндекс ID → Безопасность → Пароли приложений → Почта",
    ),
    "3": (
        "Mail.ru",
        "smtp.mail.ru",
        587,
        True,
        "Нужен пароль для внешних приложений: Настройки → Безопасность → Пароли для приложений",
    ),
    "4": (
        "Brevo (бесплатно 300 писем в день)",
        "smtp-relay.brevo.com",
        587,
        True,
        "Ключ SMTP берётся в панели Brevo: SMTP & API → SMTP.\n"
        "   Двухэтапная проверка не нужна — подходит, если Google не даёт пароль приложения.",
    ),
    "5": ("Другой сервер (ввести вручную)", "", 0, True, ""),
}

MAIL_KEYS = (
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "SMTP_STARTTLS",
    "MAIL_FROM",
    "MAIL_TO",
)


def read_env_lines() -> list[str]:
    if ENV_PATH.exists():
        return ENV_PATH.read_text(encoding="utf-8").splitlines()
    if ENV_EXAMPLE.exists():
        print("Файл .env не найден — создаю его из .env.example")
        return ENV_EXAMPLE.read_text(encoding="utf-8").splitlines()
    return []


def update_env(lines: list[str], values: dict[str, str]) -> list[str]:
    """Меняет только почтовые строки, остальное в файле не трогает."""
    result: list[str] = []
    seen: set[str] = set()

    for line in lines:
        stripped = line.strip()
        if stripped and not stripped.startswith("#") and "=" in stripped:
            key = stripped.split("=", 1)[0].strip()
            if key in values:
                result.append(f"{key}={values[key]}")
                seen.add(key)
                continue
        result.append(line)

    missing = [k for k in MAIL_KEYS if k in values and k not in seen]
    if missing:
        result.append("")
        for key in missing:
            result.append(f"{key}={values[key]}")

    return result


def send_test(values: dict[str, str]) -> str | None:
    """Отправляет проверочное письмо. Возвращает текст ошибки или None при успехе."""
    msg = EmailMessage()
    msg["Subject"] = "Apogee — почта настроена"
    msg["From"] = formataddr(("Apogee", values["MAIL_FROM"]))
    msg["To"] = values["MAIL_TO"]
    msg.set_content(
        "Всё получилось.\n\n"
        "Теперь каждая заявка с сайта — запрос демо и сообщение из формы контактов —\n"
        "будет приходить на этот адрес. Кнопка «Ответить» в письме пишет сразу клиенту."
    )

    try:
        with smtplib.SMTP(values["SMTP_HOST"], int(values["SMTP_PORT"]), timeout=25) as smtp:
            smtp.ehlo()
            if values["SMTP_STARTTLS"] == "true":
                smtp.starttls()
                smtp.ehlo()
            smtp.login(values["SMTP_USER"], values["SMTP_PASSWORD"])
            smtp.send_message(msg)
    except smtplib.SMTPAuthenticationError:
        return (
            "Сервер не принял логин или пароль.\n"
            "   Чаще всего это значит, что введён обычный пароль от почты,\n"
            "   а нужен отдельный пароль приложения."
        )
    except (smtplib.SMTPConnectError, OSError):
        # Сюда попадают отказ в соединении, таймаут и неверное имя хоста.
        return (
            f"Не удалось подключиться к {values['SMTP_HOST']}:{values['SMTP_PORT']}.\n"
            "   Проверьте адрес сервера и порт, а также что интернет доступен\n"
            "   и подключение не блокирует антивирус или файрвол."
        )
    except smtplib.SMTPRecipientsRefused:
        return f"Сервер не принял адрес получателя {values['MAIL_TO']}. Проверьте, нет ли опечатки."
    except smtplib.SMTPSenderRefused:
        return (
            f"Сервер не принял адрес отправителя {values['MAIL_FROM']}.\n"
            "   У большинства почт отправитель должен совпадать с логином."
        )
    except Exception as exc:  # noqa: BLE001
        return f"{type(exc).__name__}: {exc}"

    return None


def main() -> int:
    print("\n=== Настройка почты для заявок с сайта ===\n")
    print("Откуда будут уходить письма:")
    for key, (name, *_rest) in PROVIDERS.items():
        print(f"  {key}. {name}")

    choice = input("\nНомер (по умолчанию 1): ").strip() or "1"
    if choice not in PROVIDERS:
        print("Нет такого варианта.")
        return 1

    name, host, port, starttls, hint = PROVIDERS[choice]

    if choice == "5":
        host = input("Адрес SMTP-сервера: ").strip()
        port_raw = input("Порт (обычно 587): ").strip() or "587"
        if not port_raw.isdigit():
            print("Порт должен быть числом.")
            return 1
        port = int(port_raw)
    else:
        print(f"\nВыбрано: {name}")
        if hint:
            print(f"   {hint}")

    print()
    user = input("Логин (обычно полный адрес почты): ").strip()
    if not user:
        print("Логин не может быть пустым.")
        return 1

    mail_from = input(f"Адрес отправителя (Enter — взять {user}): ").strip() or user
    mail_to = input(f"Куда присылать заявки (Enter — взять {user}): ").strip() or user

    values = {
        "SMTP_HOST": host,
        "SMTP_PORT": str(port),
        "SMTP_USER": user,
        "SMTP_PASSWORD": "",
        "SMTP_STARTTLS": "true" if starttls else "false",
        "MAIL_FROM": mail_from,
        "MAIL_TO": mail_to,
    }

    # До трёх попыток: пароль легко вставить не полностью, и перезапускать
    # весь скрипт из-за этого не нужно.
    for attempt in range(1, 4):
        print()
        password = getpass.getpass("Пароль приложения (при вводе не отображается): ")
        # Google показывает пароль группами по 4 символа — пробелы внутри не нужны.
        password = password.replace(" ", "").replace("\t", "").strip()

        if not password:
            print("Ничего не введено. Похоже, вставка не сработала:")
            print("   попробуйте Ctrl+V, а если не помогает — правую кнопку мыши.")
            continue

        # Подсказка без раскрытия пароля: видно только длину и состав.
        print(f"   принято символов: {len(password)}")

        if choice == "1" and (len(password) != 16 or not password.isalpha()):
            print("   Похоже, это не пароль приложения Google.")
            print("   Он состоит ровно из 16 латинских букв без цифр и знаков")
            print("   (Google показывает их как 4 группы по 4 буквы).")
            print("   Обычный пароль от аккаунта Gmail не подойдёт.")
            if attempt < 3:
                again = input("   Ввести ещё раз? [Д/н]: ").strip().lower()
                if again in ("", "д", "да", "y", "yes"):
                    continue
            return 1

        values["SMTP_PASSWORD"] = password

        print("\nПроверяю подключение…")
        error = send_test(values)
        if not error:
            break

        print(f"\nНе получилось: {error}")
        if attempt < 3:
            print("\nЧастые причины:")
            print("   • пароль удалён на странице паролей приложений — создайте новый;")
            print("   • скопирован не тот пароль;")
            print("   • вставилась только часть пароля.")
            again = input("\nПопробовать ещё раз? [Д/н]: ").strip().lower()
            if again not in ("", "д", "да", "y", "yes"):
                print("\nФайл .env не изменён.")
                return 1
        else:
            print("\nФайл .env не изменён — создайте новый пароль приложения и запустите скрипт снова.")
            return 1

    lines = update_env(read_env_lines(), values)
    ENV_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"\nГотово. Проверочное письмо отправлено на {mail_to} — загляните в почту.")
    print(f"Настройки сохранены в {ENV_PATH}")
    print("\nТеперь запустите сайт, и заявки будут приходить вам на почту:")
    print("   1) в этой папке:  uvicorn app.main:app --reload --port 8000")
    print("   2) в папке сайта: npm run dev")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
