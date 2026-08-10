import { cookies } from 'next/headers';
import { api } from './api';
import { ArticlesResponse } from './clientApi';

// Хелпер для передачі кук на сервері (JWT з httpOnly cookie)
const getHeadersWithCookies = async () => {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
};

// Список статей — для ArticlesPage (SSR/prefetch)
export const fetchArticles = async (page = 1, perPage = 12): Promise<ArticlesResponse> => {
  const headers = await getHeadersWithCookies();
  const res = await api.get<ArticlesResponse>('/articles', {
    params: { page, perPage },
    ...headers,
  });
  return res.data;
};

// Одна стаття по id — для ArticlePage (SSR/prefetch)
export const fetchArticleById = async (id: string) => {
  const headers = await getHeadersWithCookies();
  const res = await api.get(`/articles/${id}`, headers);
  return res.data;
};
