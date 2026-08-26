# Apogee

Сайт аналитической платформы: React-фронтенд и Python-бэкенд с базой SQLite.

- **Фронтенд** — Vite 5 + React 18 + TypeScript 5.5 + Tailwind CSS 3.4
- **Бэкенд** — FastAPI + SQLAlchemy + SQLite, уведомления о заявках на почту

## Быстрый старт

Нужны два терминала.

**1. Бэкенд** (из папки `backend`):

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

**2. Фронтенд** (из корня проекта):

```bash
npm install
npm run dev
```

Сайт откроется на http://localhost:5173, запросы к `/api` уходят на бэкенд
через прокси Vite. Настройка почты и создание пользователей описаны в
[backend/README.md](backend/README.md).

## Команды фронтенда

```
npm run dev        сервер разработки
npm run build      сборка в dist
npm run preview    просмотр сборки
npm run lint       eslint
npm run typecheck  tsc --noEmit
```

## Структура

```
index.html
vercel.json                правила маршрутизации SPA (кроме /api)
src/
  main.tsx                 BrowserRouter
  App.tsx                  маршруты
  lib/
    api.ts                 клиент бэкенда
    navigation.ts          пункты меню
    ui.ts                  общие классы кнопок и полей
  components/
    Hero.tsx               первый экран с фоновым видео
    HomeSections.tsx       прокручиваемая часть главной
    Nav.tsx                шапка, выпадающее меню, мобильное меню
    Footer.tsx  PageShell.tsx  RevenueCard.tsx
    Animate.tsx            появление по таймеру (первый экран)
    Reveal.tsx             появление по прокрутке (ниже первого экрана)
    ScrollToTop.tsx
  pages/                   Home, Platform, Pricing, Resources, Blog,
                           Login, Demo, Contact, NotFound
backend/
  app/                     main, config, database, models, schemas,
                           security, mailer, ratelimit, routers/
  scripts/                 create_user.py, send_test_email.py
```

## Страницы

| Путь | Что это |
|---|---|
| `/` | Первый экран + прокручиваемая главная |
| `/platform` | Возможности платформы, якорные блоки |
| `/pricing` | Тарифы с переключателем периода и FAQ |
| `/resources` | Материалы с фильтром по категориям |
| `/blog` | Статьи с фильтром по категориям |
| `/login` | Вход (настоящая авторизация) |
| `/demo` | Заявка на демо (сохраняется в базу) |
| `/contact` | Сообщение команде (сохраняется в базу) |

## Развёртывание

Фронтенд собирается в статику и разворачивается на Vercel. Чтобы формы работали
в продакшене, бэкенд нужно разместить отдельно — на хостинге с постоянным диском
(Railway, Render, Fly.io, VPS), потому что SQLite хранит данные в файле. Затем:

1. добавьте домен фронтенда в `CORS_ORIGINS` в `backend/.env`;
2. задайте переменную `VITE_API_URL` со ссылкой на бэкенд при сборке фронтенда.

Без `VITE_API_URL` статическая версия работает целиком, кроме отправки форм —
они покажут сообщение о том, что бэкенд не подключён.
