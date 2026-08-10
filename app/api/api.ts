import axios from 'axios';

// Використовується лише всередині app/api/**\/route.ts (proxy-роутів).
// Роут-хендлери завжди виконуються на сервері, тому base URL завжди — реальний бекенд.
export const api = axios.create({
  baseURL: process.env.BACKEND_URL,
  withCredentials: true,
});
