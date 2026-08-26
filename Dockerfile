# Сборка бэкенда для Railway.
#
# Этот файл нужен на случай, когда в настройках сервиса не задан
# Root Directory = backend: тогда Railway берёт корень репозитория и без
# Dockerfile собрал бы фронтенд вместо API.
#
# Если Root Directory всё-таки задан, файл просто не попадает в контекст
# сборки и не мешает. Vercel его тоже не использует — там статическая сборка.

FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/app ./app
COPY backend/scripts ./scripts

EXPOSE 8000

# Форма через sh нужна, чтобы подставилась переменная PORT, которую задаёт Railway.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
