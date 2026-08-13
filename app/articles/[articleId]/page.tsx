import { isAxiosError } from "axios";
import { notFound } from "next/navigation";
import ArticleDetails from "@/components/ArticleDetails/ArticleDetails";
import { fetchArticleById, fetchRecommendedArticles } from "@/lib/api/serverApi";

type Props = {
  params: Promise<{ articleId: string }>;
};

// Функція для отримання даних статті з бекенду. Винесена окремо, щоб можна було
// обробляти помилки (404/не знайдено) і відкривати глобальну сторінку not-found.
async function getArticle(articleId: string) {
  try {
    return await fetchArticleById(articleId);
  } catch (error) {
    // Якщо бекенд повернув 404, то відкриваємо сторінку not-found.tsx.
    if (isAxiosError(error) && error.response?.status === 404) {
      notFound();
    }

    throw error;
  }
}

export default async function ArticlePage({ params }: Props) {
  const { articleId } = await params;

  const article = await getArticle(articleId);

  // Получаем три случайные статьи, исключая текущую.
  const recommendedArticles = await fetchRecommendedArticles(articleId, article.title);

  return <ArticleDetails article={article} recommendedArticles={recommendedArticles} />;
}
