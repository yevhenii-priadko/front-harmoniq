# Harmoniq — Frontend

Фронтенд платформи для статей на Next.js 16 (App Router). Реалізовано: реєстрація/логін,
стрічка статей з пагінацією, створення та редагування статей (з завантаженням фото на
Cloudinary), збережені статті, сторінки авторів і профілю користувача (свої статті,
збережені, аватар).

## Запуск

```bash
npm install
cp .env.template .env
npm run dev
```

У `.env` потрібно вказати адресу бекенду:

```
BACKEND_URL=https://backend-harmoniq.onrender.com
```

Або, якщо піднімаєш бекенд локально (наприклад, для роботи над бековою частиною задачі) —
`BACKEND_URL=http://localhost:3000`, після `npm run dev` у `backend-harmoniq`.

## Стек

Next.js 16 (App Router) + React 19, TypeScript, Formik + Yup (форми та валідація),
Zustand (клієнтський стан: авторизація, профіль), TanStack React Query (кешування
запитів), Axios (HTTP-клієнт).

## Структура

- `app/` — сторінки (App Router) за маршрутами: `/`, `/login`, `/register`, `/articles`,
  `/articles/new`, `/articles/[articleId]`, `/articles/[articleId]/edit`, `/authors`,
  `/profile` (з паралельними слотами `@myArticles`/`@savedArticles`), `/photo`
- `app/api/` — Route Handlers, проксі-шар між браузером і бекендом
- `components/` — по одній папці на компонент/модуль
- `lib/api/` — `clientApi.ts` (запити з браузера через `/api/*`), `serverApi.ts`
  (прямі запити до бекенду з Server Components), `api.ts` (axios-інстанс)
- `lib/store/` — Zustand-стори (`authStore`, `profileStore`)
- `styles/globals.css` — базові CSS-змінні

## Навіщо `app/api/` (проксі-шар)

На сервері (Server Components) можна бити напряму в `BACKEND_URL` — зайвий хоп не
потрібен. У браузері (Client Components) — тільки через свої `/api/*` роути, щоб не
світити клієнту реальний `BACKEND_URL` і креденшели.

Два нюанси, на яких вже спотикались — тримати в голові при додаванні нових проксі-роутів:

- **Cookie-заголовок.** `cookies()` з `next/headers` треба форвардити в бекенд вручну
  через заголовок `Cookie`. `cookieStore.toString()` тут працює коректно (перевірено),
  але надійніше і явно — `cookieStore.getAll().map(({name, value}) => \`${name}=${value}\`).join('; ')`.
- **JSON vs multipart.** Якщо роут може отримати файл (наприклад, фото при створенні/
  редагуванні статті), перевіряй `Content-Type` вхідного запиту і читай або
  `request.formData()`, або `request.json()` — і форвардь тілом як є, без ручного
  `Content-Type` для multipart (axios сам виставить правильний boundary).

## Деплой

Vercel, автодеплой при пуші в `main` (через GitHub-вебхук). Якщо після мержу в
Deployments не з'явився новий Production-деплой — вебхук міг не долетіти (буває при
збоях на боці GitHub); допоміг порожній коміт (`git commit --allow-empty` + `git push`)
або ручний деплой через `vercel --prod`.
