# Harmoniq — Frontend

Скелет проєкту на Next.js 16 (App Router). Логіка компонентів, форм, стану та
запитів до бекенду — не реалізована, кожен розробник пише свою частину в межах
своєї задачі.

## Запуск

```bash
npm install
cp .env.template .env
npm run dev
```

## Структура

- `app/` — сторінки (App Router) за маршрутами з ТЗ
- `app/api/` — сюди додаються Route Handlers (проксі до backend)
- `components/` — по одній папці на кожен названий у ТЗ модуль
- `styles/globals.css` — базові CSS-змінні

## Рекомендований стек (додавати по мірі потреби)

Formik + Yup, Zustand, TanStack React Query, Axios — встановлювати командою
`npm install <пакет>` у своїй задачі, коли він реально знадобиться.
