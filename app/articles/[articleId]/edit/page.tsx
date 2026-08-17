import { notFound } from "next/navigation";

import ClientEdit from "@/app/articles/[articleId]/edit/ClientEdit";
import { ArticleFormValues } from "@/components/ArticleForm/ArticleForm";
import { fetchArticleById } from "@/lib/api/serverApi";

type Props = {
  params: Promise<{ articleId: string }>;
};

export default async function EditArticlePage({ params }: Props) {
  const { articleId } = await params;

  const article = await fetchArticleById(articleId).catch(() => null);

  if (!article) {
    notFound();
  }

  const initialValues: ArticleFormValues = {
    title: article.title ?? "",
    description: article.description ?? "",
    photo: article.photo ?? null,
    author: article.author ?? "",
    date: article.date ?? "",
  };

  return <ClientEdit articleId={articleId} initialValues={initialValues} />;
}
