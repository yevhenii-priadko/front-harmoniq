import ArticlesItem from "@/components/ArticlesItem/ArticlesItem";

type Article = {
  _id: string;
  title: string;
  description: string;
  photo: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  // ⚠️ date/author додані в Mongoose-модель нещодавно (перевірено вживу через
  // тестовий POST /articles) — для СТАРИХ статей, створених до цієї зміни,
  // цих полів у відповіді не буде, тому позначаємо як optional і даємо fallback.
  date?: string;
  author?: string;
};

type ArticlesListProps = {
  articles: Article[];
};

export default function ArticlesList({ articles }: ArticlesListProps) {
  if (!articles.length) {
    return <p>No articles found.</p>;
  }

  return (
    <ul>
      {articles.map((article, index) => (
        <ArticlesItem
          key={`${article._id}-${index}`}
          id={article._id}
          title={article.title}
          description={article.description}
          photo={article.photo}
          userName={article.author ?? "Harmoniq author"}
        />
      ))}
    </ul>
  );
}
