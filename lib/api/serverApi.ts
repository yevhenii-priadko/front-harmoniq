import { cookies } from "next/headers";
import { api } from "./api";
import { Article, ArticlesResponse } from "./clientApi";

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
export const fetchArticles = async (
  page = 1,
  perPage = 12,
): Promise<ArticlesResponse> => {
  const headers = await getHeadersWithCookies();
  const res = await api.get<ArticlesResponse>("/articles", {
    params: { page, perPage },
    ...headers,
  });
  return res.data;
};

// Одна стаття по id — для ArticlePage (SSR/prefetch)
export const fetchArticleById = async (id: string): Promise<Article> => {
  const headers = await getHeadersWithCookies();
  const res = await api.get(`/articles/${id}`, headers);
  return res.data;
};

// Отримуємо три випадкові статті для блоку рекомендацій.
export const fetchRecommendedArticles = async (
  currentArticleId: string,
  currentArticleTitle: string,
): Promise<Article[]> => {
  const firstPage = await fetchArticles(1, 20); // Отримуємо першу сторінку статей, щоб мати базу для рекомендацій.

  if (firstPage.articles.length === 0) {
    return [];
  }

  // Випадково обираємо сторінку зі статтями.
  const randomPage = Math.floor(Math.random() * Math.max(firstPage.totalPages, 1)) + 1;

  const randomPageData =
    randomPage === 1 ? firstPage : await fetchArticles(randomPage, 20);

  // Доводимо назву статті до єдиного формату для порівняння: видаляємо зайві пробіли, приводимо до нижнього регістру.
  const normalizeTitle = (title: string) =>
    title.trim().toLowerCase().replace(/\s+/g, " ");

  const normalizedCurrentTitle = normalizeTitle(currentArticleTitle);

  // Фільтруємо статті, щоб не включати поточну статтю у рекомендації.
  const availableArticles = randomPageData.articles.filter((article, index, articles) => {
    const normalizedTitle = normalizeTitle(article.title);

    const isCurrentArticle =
      article._id === currentArticleId || normalizedTitle === normalizedCurrentTitle;

    const isFirstArticleWithThisTitle =
      articles.findIndex((item) => normalizeTitle(item.title) === normalizedTitle) ===
      index;

    return !isCurrentArticle && isFirstArticleWithThisTitle;
  });

  //Додаємо умову, щоб якщо на випадковій сторінці менше 3 статей, то додавати статті з першої сторінки
  if (availableArticles.length < 3 && randomPage !== 1) {
    const additionalArticles = firstPage.articles.filter((article, index, articles) => {
      const normalizedTitle = normalizeTitle(article.title);

      // Перевіряємо, чи не є стаття поточною.
      // Порівнюємо не тільки id, але й заголовок,
      // оскільки в базі можуть бути дублікати з різними id.
      const isCurrentArticle =
        article._id === currentArticleId || normalizedTitle === normalizedCurrentTitle;

      // Перевіряємо, чи стаття з таким заголовком
      // уже була додана зі випадково вибраної сторінки.
      const isAlreadyAdded = availableArticles.some(
        (availableArticle) => normalizeTitle(availableArticle.title) === normalizedTitle,
      );

      // Перевіряємо, чи це перша стаття з таким заголовком
      // на першій сторінці. Інші дублікати не додаємо.
      const isFirstArticleWithThisTitle =
        articles.findIndex((item) => normalizeTitle(item.title) === normalizedTitle) ===
        index;

      // Додаємо статтю, тільки якщо:
      // 1. вона не є поточною;
      // 2. її ще немає у списку рекомендацій;
      // 3. вона не дублює іншу статтю з таким самим заголовком.
      return !isCurrentArticle && !isAlreadyAdded && isFirstArticleWithThisTitle;
    });

    availableArticles.push(...additionalArticles);
  }

  const shuffledArticles = [...availableArticles];

  // Перемішуємо статті випадковим чином. Тобто отримуэмо два рівня випадковості: спочатку випадкова сторінка, потім випадковий порядок статей на ній.
  for (let index = shuffledArticles.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [shuffledArticles[index], shuffledArticles[randomIndex]] = [
      shuffledArticles[randomIndex],
      shuffledArticles[index],
    ];
  }

  return shuffledArticles.slice(0, 3);
};
