type Props = {
  params: Promise<{ articleId: string }>;
};

export default async function ArticlePage({ params }: Props) {
  const { articleId } = await params;

  return (
    <div>
      <h1>Article #{articleId}</h1>
      {/* TODO: отримати та відобразити статтю */}
    </div>
  );
}
