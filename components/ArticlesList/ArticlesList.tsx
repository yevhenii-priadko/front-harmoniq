// import ArticlesItem from "@/components/ArticlesItem/ArticlesItem";

type Article = {
  _id: string;
  title: string;
  description: string;
  photo: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
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
      {articles.map((article) => (
        <li key={article._id}>{/* <ArticlesItem/> */}</li>
      ))}
    </ul>
  );
}
