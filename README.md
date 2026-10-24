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

## Gemini

Ключ только в `.env` на сервере (`GEMINI_API_KEY`). Модель по умолчанию `gemini-3.8-flash`, переопределение: `GEMINI_MODEL`.

## Turso

В `.env` задайте `TURSO_DATABASE_URL` и `TURSO_AUTH_TOKEN`. Браузер хранит только анонимный `clientId` (UUID); резюме и настройки — в таблице `client_data` на Turso. При недоступности API используется локальный кэш в браузере.
