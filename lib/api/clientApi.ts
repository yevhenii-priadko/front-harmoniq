import { api } from "./api";
import { isAxiosError } from "axios";

export type Author = {
  _id: string;
  username?: string;
  email?: string;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthorsResponse = {
  page: number;
  perPage: number;
  totalUsers: number;
  totalPages: number;
  users: Author[];
};

export type UserResponse = {
  user: Author;
};

export const fetchAuthorsClient = async (
  page = 1,
  perPage = 20,
): Promise<AuthorsResponse> => {
  const res = await api.get<AuthorsResponse>("/authors", {
    params: { page, perPage },
  });
  return res.data;
};

export const fetchAuthorClient = async (id: string): Promise<Author> => {
  const res = await api.get<UserResponse>(`/users/${id}`);
  return res.data.user;
};

export const fetchAuthorArticlesClient = async (
  authorId: string,
  page = 1,
  perPage = 12,
): Promise<ArticlesResponse> => {
  const res = await api.get<ArticlesResponse>(`/users/${authorId}/articles`, {
    params: { page, perPage },
  });
  return res.data;
};

// Реальна відповідь бекенду (перевірено на живому сервері 09.08):
// { page, perPage, totalArticles, totalPages, articles: [...] }
export type ArticlesResponse = {
  page: number;
  perPage: number;
  totalArticles: number;
  totalPages: number;
  articles: Article[];
};

// date/author є в Mongoose-схемі Article (models/article.js) як required —
// бекенд завжди їх повертає для статей, створених після PR з полями дати/автора.
// Лишаємо тут optional як підстраховку: у старих статтях, створених до того,
// як ці поля з'явились у схемі, значення в базі можуть бути відсутні.
export type Article = {
  _id: string;
  title: string;
  description: string;
  photo: string;
  userId: string;
  date?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
};

// Пейлоад для PATCH /articles/:id (updateArticle нижче). Назва навмисно
// відрізняється від ArticleFormValues у components/ArticleForm/ArticleForm.tsx —
// та описує стан самої форми (date/author опціональні), а це — вже готовий
// до відправки об'єкт. photo може бути новим File (юзер вибрав нову картинку
// в формі редагування — тоді updateArticle нижче збирає FormData і вантажить
// файл, як і createArticle) або рядком (лишили старе фото — просто передаємо
// існуючий URL).
export type UpdateArticlePayload = {
  title: string;
  description: string;
  date: string;
  author: string;
  photo: File | string;
};
// Список статей — для клієнтських хуків (React Query) на ArticlesPage
export const fetchArticlesClient = async (
  page = 1,
  perPage = 12,
): Promise<ArticlesResponse> => {
  const res = await api.get<ArticlesResponse>("/articles", {
    params: { page, perPage },
  });
  return res.data;
};

// Створення статті — ArticleForm на /articles/new, кнопка Publish.

export type CreateArticlePayload = {
  title: string;
  description: string;
  date: string;
  author: string;
  photo: File;
};

export const createArticle = async (values: CreateArticlePayload): Promise<Article> => {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("description", values.description);
  formData.append("date", values.date);
  formData.append("author", values.author);
  formData.append("photo", values.photo);

  const res = await api.post<Article>("/articles", formData);
  return res.data;
};

// PATCH /articles/:id реалізовано на бекенді (PR #21 + фікс #22, #23).
// Поле author у values бекенд ігнорує — він завжди підставляє ім'я
// з автентифікованої сесії, а не з тіла запиту.
//
// Якщо photo — новий File (юзер вибрав іншу картинку при редагуванні),
// шлемо multipart/form-data так само, як createArticle: бекенд сам вантажить
// файл на Cloudinary і підставляє URL. Якщо photo лишився рядком (старе фото
// не міняли) — шлемо звичайний JSON, як і раніше.
export const updateArticle = async (
  id: string,
  values: UpdateArticlePayload,
): Promise<Article> => {
  if (values.photo instanceof File) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("date", values.date);
    formData.append("author", values.author);
    formData.append("photo", values.photo);

    const res = await api.patch<Article>(`/articles/${id}`, formData);
    return res.data;
  }

  const res = await api.patch<Article>(`/articles/${id}`, values);
  return res.data;
};

//Завантаження аватара користувача — UploadForm, кнопка Save.
export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();

  formData.append("avatar", file);

  try {
    const { data } = await api.patch<{ url: string }>("/users/avatar", formData);

    return data.url;
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? "Unable to upload your photo.");
    }

    throw new Error("Unable to upload your photo.");
  }
};

//Отримання створених статей поточного користувача для ProfilePage
export const fetchUserArticles = async (
  userId: string,
  page = 1,
  perPage = 12,
): Promise<ArticlesResponse> => {
  const res = await api.get<ArticlesResponse>(`/users/${userId}/articles`, {
    params: { page, perPage },
  });

  return res.data;
};

// Отримання збережених статей поточного користувача для ProfilePage
export const fetchSavedArticles = async (
  page = 1,
  perPage = 12,
): Promise<ArticlesResponse> => {
  const res = await api.get<ArticlesResponse>("/users/me/saved-articles", {
    params: { page, perPage },
  });

  return res.data;
};

// Перевіряємо, чи знаходиться конкретна статья в збережених.
export const checkIsArticleSaved = async (articleId: string): Promise<boolean> => {
  // Спочатку перевіряємо першу сторінку збережених статей, якщо там немає — ідемо по всіх сторінках.
  let page = 1;
  let totalPages = 1;

  do {
    const data = await fetchSavedArticles(page, 20);

    const isSaved = data.articles.some((article) => article._id === articleId);

    if (isSaved) {
      return true;
    }

    totalPages = data.totalPages;
    page += 1;
  } while (page <= totalPages);

  return false;
};

// Додавання статті до збережених.
export const addArticleToSaved = async (articleId: string): Promise<void> => {
  await api.post(`/users/saved/${articleId}`);
};

// Видалення статті зі збережених.
export const removeArticleFromSaved = async (articleId: string): Promise<void> => {
  await api.delete(`/users/saved/${articleId}`);
};
