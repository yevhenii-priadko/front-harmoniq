import { notFound } from 'next/navigation';
import AuthorProfile from '@/components/AuthorProfile/AuthorProfile';
import { api } from '@/lib/api/api';
import type { UserResponse, ArticlesResponse, Author } from '@/lib/api/clientApi';
import css from './AuthorPage.module.css';

const ARTICLES_PER_PAGE = 12;

export const dynamic = 'force-dynamic';

const emptyArticlesResponse: ArticlesResponse = {
  page: 1,
  perPage: ARTICLES_PER_PAGE,
  totalArticles: 0,
  totalPages: 0,
  articles: [],
};

type AuthorPageProps = {
  params: Promise<{
    id?: string;
    authorId?: string;
  }>;
};

const fetchAuthorData = async (authorId: string) => {
  let author: Author | null = null;
  let articlesResponse = emptyArticlesResponse;

  if (!authorId) {
    return {
      author: null,
      articlesResponse: emptyArticlesResponse,
      error: 'Invalid author ID',
    };
  }

  try {
    const authorRes = await api.get<UserResponse>(`/users/${authorId}`);
    author = authorRes.data.user;
  } catch {
    return {
      author: null,
      articlesResponse: emptyArticlesResponse,
      error: 'Unable to load author data. Please try again later.',
    };
  }

  try {
    const articlesRes = await api.get<ArticlesResponse>(`/users/${authorId}/articles`, {
      params: { page: 1, perPage: ARTICLES_PER_PAGE },
    });
    articlesResponse = articlesRes.data;
  } catch {
    articlesResponse = emptyArticlesResponse;
  }

  return { author, articlesResponse, error: '' };
};

export default async function AuthorPage({ params }: AuthorPageProps) {
  const resolvedParams = await params;
  const authorId = resolvedParams.authorId || resolvedParams.id || '';

  const { author, articlesResponse, error } = await fetchAuthorData(authorId);

  if (!author && !error) {
    notFound();
  }

  return (
    <section className={css.section}>
      <div className={css.container}>
        {author ? (
          <AuthorProfile
            author={author}
            initialArticlesData={articlesResponse}
            initialError={error}
          />
        ) : (
          <p className={css.error}>{error}</p>
        )}
      </div>
    </section>
  );
}