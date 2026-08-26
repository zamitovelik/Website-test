"""
Настройка уведомлений в Telegram.

Запуск из папки backend:
    python -m scripts.setup_telegram

Скрипт проверит токен бота, сам определит, куда слать сообщения, пришлёт
проверочное уведомление и сохранит настройки в .env.
"""

import getpass
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.stdout.reconfigure(encoding="utf-8")

from app.telegram import TelegramError, call_api, send_message  # noqa: E402
from scripts.setup_mail import ENV_PATH, read_env_lines, update_env  # noqa: E402

WAIT_SECONDS = 180
POLL_EVERY = 3


TOKEN_FILE = Path(__file__).resolve().parents[1] / "token.txt"


def read_token() -> str | None:
    """
    Берёт токен из файла token.txt, если он есть, иначе спрашивает в терминале.

    Вариант с файлом нужен потому, что вставка в консоль Windows срабатывает
    не всегда, а в Блокноте — всегда. Файл удаляется сразу после чтения,
    чтобы токен не лежал на диске открытым текстом.
    """
    if TOKEN_FILE.exists():
        token = TOKEN_FILE.read_text(encoding="utf-8-sig").strip()
        try:
            TOKEN_FILE.unlink()
            removed = True
        except OSError:
            removed = False

        if not token:
            print(f"Файл {TOKEN_FILE.name} пустой — вставьте в него токен и сохраните.")
            return None

        print(f"Токен прочитан из файла {TOKEN_FILE.name}")
        print("   файл удалён" if removed else f"   ВНИМАНИЕ: удалите {TOKEN_FILE} вручную")
        return token

    # Токен — ключ доступа к боту, поэтому вводим его скрыто: так он не
    # останется на экране и в истории терминала.
    print(f"(Подсказка: если вставка в это окно не работает, положите токен")
    print(f" в файл {TOKEN_FILE} и запустите скрипт снова.)\n")
    token = getpass.getpass("Вставьте токен бота (при вводе не отображается): ").strip()

    if not token:
        print("Ничего не введено. Похоже, вставка не сработала:")
        print("   попробуйте Ctrl+V, правую кнопку мыши —")
        print(f"   или положите токен в файл {TOKEN_FILE.name} и запустите скрипт снова.")
        return None

    return token


def find_chat_id(token: str, bot_username: str) -> str | None:
    """
    Ждёт, пока пользователь напишет боту, и достаёт chat_id из обновлений.
    Так адрес получателя не приходится искать вручную.
    """
    print(f"\nТеперь откройте в Telegram бота @{bot_username} и нажмите «Start»")
    print("(или просто отправьте ему любое сообщение).\n")
    print("Жду сообщение", end="", flush=True)

    deadline = time.monotonic() + WAIT_SECONDS
    while time.monotonic() < deadline:
        try:
            updates = call_api("getUpdates", token, {"timeout": 0, "limit": 20}, timeout=15)
        except TelegramError as exc:
            print(f"\nОшибка при опросе Telegram: {exc}")
            return None

        for update in updates or []:
            message = update.get("message") or update.get("channel_post") or {}
            chat = message.get("chat") or {}
            if chat.get("id") is not None:
                who = chat.get("username") or chat.get("first_name") or chat.get("title") or ""
                print(f"\nНашёл: {who} (chat_id {chat['id']})")
                return str(chat["id"])

        print(".", end="", flush=True)
        time.sleep(POLL_EVERY)

    print("\nСообщение так и не пришло.")
    return None


def main() -> int:
    print("\n=== Уведомления о заявках в Telegram ===\n")
    print("Как получить токен бота:")
    print("  1. Откройте в Telegram бота @BotFather")
    print("  2. Отправьте ему команду /newbot")
    print("  3. Придумайте имя бота, затем логин, оканчивающийся на bot")
    print("  4. BotFather пришлёт строку вида 1234567890:AAH...  — это токен\n")

    token = read_token()
    if not token:
        return 1

    print(f"   принято символов: {len(token)}")

    if ":" not in token:
        print("Это не похоже на токен: в нём должно быть двоеточие.")
        print("Скопируйте строку из сообщения BotFather целиком.")
        return 1

    if not token.split(":", 1)[0].isdigit():
        print("Это не похоже на токен: до двоеточия должны идти только цифры.")
        return 1

    print("\nПроверяю токен…")
    try:
        me = call_api("getMe", token, {})
    except TelegramError as exc:
        print(f"Токен не подошёл: {exc}")
        print("Скопируйте его из сообщения BotFather ещё раз, целиком и без пробелов.")
        return 1

    bot_username = me.get("username", "")
    print(f"Токен рабочий — это бот @{bot_username}")

    chat_id = find_chat_id(token, bot_username)
    if not chat_id:
        print("\nНастройка не завершена. Запустите скрипт снова и напишите боту, когда он попросит.")
        return 1

    print("\nОтправляю проверочное сообщение…")
    try:
        send_message(
            token,
            chat_id,
            "<b>Apogee — уведомления подключены</b>\n\n"
            "Сюда будут приходить заявки с сайта: запросы демо и сообщения "
            "из формы контактов.",
        )
    except TelegramError as exc:
        print(f"Не удалось отправить: {exc}")
        return 1

    lines = update_env(
        read_env_lines(),
        {"TELEGRAM_BOT_TOKEN": token, "TELEGRAM_CHAT_ID": chat_id},
    )
    ENV_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print("\nГотово — проверьте Telegram, там уже лежит сообщение от бота.")
    print(f"Настройки сохранены в {ENV_PATH}")
    print("\nТеперь запустите сайт, и каждая заявка будет приходить вам в Telegram:")
    print("   1) в этой папке:  uvicorn app.main:app --reload --port 8000")
    print("   2) в папке сайта: npm run dev")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
