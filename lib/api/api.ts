import axios from 'axios';

// На сервері (Server Components) — б'ємо напряму в бекенд, зайвий хоп через
// власні /api роути не потрібен, бо curl/cookies тут і так не палляться браузеру.
// У браузері (Client Components) — йдемо тільки через свої /api/* роути,
// щоб не світити реальний BACKEND_URL і креденшели клієнту.
const baseURL = typeof window === 'undefined' ? process.env.BACKEND_URL : '/api';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
