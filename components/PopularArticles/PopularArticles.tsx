import Link from "next/link";
import css from "./PopularArticles.module.css";
import ArticlesItem from "@/components/ArticlesItem/ArticlesItem";

interface Article {
  _id: string;
  title: string;
  description: string;
  photo: string;
  userName: string;
}

async function getPopularArticles() {
  const res = await fetch(
    `${process.env.BACKEND_URL}/articles?filter=popular&perPage=5&page=1`,
    { cache: "no-store" },
  );

  if (!res.ok) throw new Error("Failed to fetch articles");
  const data = await res.json();
  return data.articles.slice(0, 4);
}

export default async function PopularArticles() {
  const articles = await getPopularArticles();

  return (
    <section id="popular" className={css.popular}>
      <div className={css.wrapper}>
        <h2 className={css.title}>Popular Articles</h2>
        <div className={css.heading}>
          <Link className={css.link} href="/articles">
            Go to all Articles
          </Link>
          <svg width={24} height={24} className={css.icon}>
            <use href="/sprite.svg#icon-top-right" />
          </svg>
        </div>
        <ul className={css.list}>
          {articles.map((article: Article) => (
            <ArticlesItem
              key={article._id}
              id={article._id}
              title={article.title}
              description={article.description}
              photo={article.photo}
              userName={article.userName}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
