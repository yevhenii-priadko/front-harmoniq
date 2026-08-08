type Props = {
  params: Promise<{ authorId: string }>;
};

export default async function AuthorPage({ params }: Props) {
  const { authorId } = await params;

  return (
    <div>
      <h1>Author #{authorId}</h1>
      {/* TODO: інформація про автора + список статей */}
    </div>
  );
}
