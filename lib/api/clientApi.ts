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
  perPage = 12
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

// ⚠️ Mongoose-модель Article (models/article.js) на бекенді зараз містить
// лише title/description/photo/userId — полів date/author там НЕМАЄ,
// хоча Joi-валідація на POST їх вимагає. Тобто ці поля можна відправити
// (валідація пройде), але вони НЕ збережуться і не повернуться в GET,
// поки хтось не додасть їх у Mongoose-схему. Тримаємо в типі як optional,
// щоб UI не падав, коли їх немає у відповіді.
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

// ⚠️ ТИМЧАСОВЕ РІШЕННЯ: Cloudinary в проєкті ВЖЕ підключений і реально працює
// (src/utils/saveFileToCloudinary.js, використовується для аватара користувача —
// PATCH/POST /users/avatar). Але цю саму функцію поки НЕ підключено до статей:
// у articlesController.js/articlesRoutes.js немає ні виклику saveFileToCloudinary,
// ні multer у ланцюжку POST /articles. Крім того, функцію не можна переносити
// на статті "як є" — вона хардкодить folder: 'harmoniq/avatars' та
// public_id: `avatar_${userId}` з overwrite: true (тобто в одного юзера завжди
// лише один файл-аватар). Для статей знадобиться свій public_id (наприклад
// на основі article._id, а не userId) і folder: 'harmoniq/articles', інакше
// друга стаття того самого автора перезапише фото першої в Cloudinary.
// Поки цього не підключили — POST /articles валідує `photo` як звичайний рядок
// (URL), тому зараз поле фото у формі має бути текстовим інпутом для посилання
// на картинку, а не file input.
export type ArticleFormValues = {
  title: string;
  description: string;
  date: string;
  author: string;
  photo: string; // URL, не File
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

// Створення статті — AddArticleForm, кнопка Publish.

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

// ⚠️ НЕ ПРАЦЮЄ ЗАРАЗ: на бекенді немає роута PATCH /articles/:id
// (ні в routes/articlesRoutes.js, ні в controllers/articlesController.js).
// Викликати цю функцію можна, але вона гарантовано поверне 404,
// поки хтось не реалізує редагування на бекенді.
export const updateArticle = async (
  id: string,
  values: ArticleFormValues,
): Promise<Article> => {
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
