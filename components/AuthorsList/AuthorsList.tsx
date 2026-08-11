'use client';

import { useRef, useState } from 'react';
import Button from '@/components/Button/Button';
import ErrorNotification from '@/components/ErrorNotification/ErrorNotification';
import AuthorsItem from '@/components/AuthorsItem/AuthorsItem';
import {
  fetchAuthorsClient,
  type Author,
  type AuthorsResponse,
} from '@/lib/api/clientApi';
import css from './AuthorsList.module.css';

const AUTHORS_PER_PAGE = 20;

type AuthorsListProps = {
  initialData: AuthorsResponse;
  initialError?: string;
};

export default function AuthorsList({ initialData, initialError = '' }: AuthorsListProps) {
  const [authors, setAuthors] = useState<Author[]>(initialData.users);
  const [page, setPage] = useState(initialData.page);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const listRef = useRef<HTMLUListElement>(null);

  const loadAuthors = async (nextPage: number) => {
    setIsLoading(true);
    setError('');

    try {
      const data = await fetchAuthorsClient(nextPage, AUTHORS_PER_PAGE);

      setAuthors((currentAuthors) =>
        nextPage === 1 ? data.users : [...currentAuthors, ...data.users],
      );
      setPage(data.page);
      setTotalPages(data.totalPages);

      if (nextPage > 1) {
        listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch {
      setError('Unable to load authors. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const hasAuthors = authors.length > 0;
  const canLoadMore = page < totalPages;

  return (
    <>
      <ErrorNotification message={error} onClose={() => setError('')} />

      {hasAuthors && (
        <ul className={css.list} ref={listRef}>
          {authors.map((author, index) => (
            <AuthorsItem key={author._id} author={author} priority={index < 4} />
          ))}
        </ul>
      )}

      {!hasAuthors && !isLoading && (
        <p className={css.empty}>No authors found.</p>
      )}

      {hasAuthors && canLoadMore && (
        <div className={css.actions}>
          <Button
            type="button"
            size="md"
            isLoading={isLoading}
            loadingText="Loading..."
            onClick={() => void loadAuthors(page + 1)}
          >
            Load more
          </Button>
        </div>
      )}
    </>
  );
}
