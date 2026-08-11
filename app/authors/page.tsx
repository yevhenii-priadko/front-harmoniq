import AuthorsList from '@/components/AuthorsList/AuthorsList';
import { api } from '@/lib/api/api';
import type { AuthorsResponse } from '@/lib/api/clientApi';
import css from './AuthorsPage.module.css';

const AUTHORS_PER_PAGE = 20;

export const dynamic = 'force-dynamic';

const emptyAuthorsResponse: AuthorsResponse = {
  page: 1,
  perPage: AUTHORS_PER_PAGE,
  totalUsers: 0,
  totalPages: 0,
  users: [],
};

const fetchInitialAuthors = async () => {
  try {
    const res = await api.get<AuthorsResponse>('/users', {
      params: { page: 1, perPage: AUTHORS_PER_PAGE },
    });

    return {
      authorsResponse: res.data,
      error: '',
    };
  } catch {
    return {
      authorsResponse: emptyAuthorsResponse,
      error: 'Unable to load authors. Please try again later.',
    };
  }
};

export default async function AuthorsPage() {
  const { authorsResponse, error } = await fetchInitialAuthors();

  return (
    <section className={css.section}>
      <div className={css.container}>
        <h1 className={css.title}>Authors</h1>
        <AuthorsList initialData={authorsResponse} initialError={error} />
      </div>
    </section>
  );
}
