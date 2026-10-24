# Конструктор резюме и портфолио

SPA на React + Vite: форма резюме, генерация через Gemini (сервер), хранение черновика в **Turso**, шаблоны, экспорт PDF.

## Запуск

1. Скопируйте `.env.example` в `.env` и вставьте ключ:

```bash
cp .env.example .env
# GEMINI_API_KEY=ваш_ключ из https://aistudio.google.com/apikey
```

2. Установка и dev (сервер API + Vite):

```bash
npm install
npm run dev
```

Откройте **http://127.0.0.1:5173** (фронт). API: **http://127.0.0.1:3001**.

## Продакшен

```bash
npm run preview
```

Собирает фронт и запускает Express на порту 3001 (раздаёт `dist` и `/api`).

## Деплой на Vercel

1. Импортируйте репозиторий [zarina-cpu/resume-builder](https://github.com/zarina-cpu/resume-builder) в [Vercel](https://vercel.com/new).
2. **Settings → Environment Variables** — добавьте (галочка **Production** обязательна):

   | Name | Пример |
   |------|--------|
   | `GEMINI_API_KEY` | ключ из [AI Studio](https://aistudio.google.com/apikey) |
   | `GEMINI_MODEL` | `gemini-3.8-flash` |
   | `TURSO_DATABASE_URL` | `libsql://…` |
   | `TURSO_AUTH_TOKEN` | токен Turso |

3. **Deployments** → последний деплой → **⋯ → Redeploy** (без redeploy ключи не подхватятся).
4. Проверка: `https://ваш-домен.vercel.app/api/health` → `"geminiConfigured": true`.
5. Открывайте **Production URL** из панели Vercel, не старые preview-ссылки.

В репозитории есть `vercel.json`: статика из `dist`, маршруты SPA и API через `api/index.js`.

## Gemini

Ключ только в `.env` на сервере (`GEMINI_API_KEY`). Модель по умолчанию `gemini-3.8-flash`, переопределение: `GEMINI_MODEL`.

## Turso

В `.env` задайте `TURSO_DATABASE_URL` и `TURSO_AUTH_TOKEN`. Браузер хранит только анонимный `clientId` (UUID); резюме и настройки — в таблице `client_data` на Turso. При недоступности API используется локальный кэш в браузере.
