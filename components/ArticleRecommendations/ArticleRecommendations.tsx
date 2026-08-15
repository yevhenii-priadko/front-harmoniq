import Link from "next/link";
import type { Article } from "@/lib/api/clientApi";
import css from "./ArticleRecommendations.module.css";

type RecommendedArticle = Pick<Article, "_id" | "title" | "author">;

type ArticleRecommendationsProps = {
  author?: string;
  date?: string;
  articles: RecommendedArticle[];
};

// Backend зберігає дату у форматі YYYY-MM-DD, а в макете вона відображається як DD.MM.YYYY.
function formatDate(date?: string) {
  if (!date) {
    return "Not specified";
  }

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}.${month}.${year}`;
}

export default function ArticleRecommendations({
  author,
  date,
  articles,
}: ArticleRecommendationsProps) {
  return (
    <aside className={css.recommendations} aria-labelledby="recommendations-title">
      <p className={css.info}>
        <span className={css.label}>Author:</span> {author ?? "Harmoniq author"}
      </p>

      <p className={css.info}>
        <span className={css.label}>Publication date:</span> {formatDate(date)}
      </p>

      <h2 id="recommendations-title" className={css.title}>
        You can also interested
      </h2>

      <ul className={css.list}>
        {articles.map((article) => (
          <li key={article._id}>
            <Link
              href={`/articles/${article._id}`}
              className={css.articleLink}
              aria-label={`Read article: ${article.title}`}
            >
              <span className={css.articleInfo}>
                <span className={css.articleTitle}>{article.title}</span>

                <span className={css.author}>{article.author ?? "Harmoniq author"}</span>
              </span>

              <span className={css.iconWrapper} aria-hidden="true">
                <svg className={css.icon} width="24" height="24">
                  <use href="/sprite.svg#icon-top-right" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
