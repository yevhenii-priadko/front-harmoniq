'use client';

import { useEffect, useState } from 'react';
import ArticlesList from '@/components/ArticlesList/ArticlesList';
import {
  fetchUserArticles,
  type Article,
} from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import ErrorNotification from '@/components/ErrorNotification/ErrorNotification';
import { useProfileStore } from '@/lib/store/profileStore';

const PER_PAGE = 12;

export default function MyArticlesPage() {
  const user = useAuthStore((state) => state.user);

  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const setTotalArticles = useProfileStore(
    (state) => state.setTotalArticles,
  );

  useEffect(() => {
    if (!user?._id) {
      return;
    }

    const loadArticles = async () => {
      try {
        setIsLoading(true);
        setError('');

        const data = await fetchUserArticles(user._id, 1, PER_PAGE);
        setTotalArticles(data.totalArticles);

        setArticles(data.articles);
        setPage(data.page);
        setTotalPages(data.totalPages);
      } catch {
        setError('Failed to load your articles.');
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, [user?._id, setTotalArticles]);

  const handleLoadMore = async () => {
    if (!user?._id) {
      return;
    }

    const nextPage = page + 1;

    try {
      setIsLoadingMore(true);
      setError('');

      const data = await fetchUserArticles(
        user._id,
        nextPage,
        PER_PAGE,
      );

      setArticles((prevArticles) => [
        ...prevArticles,
        ...data.articles,
      ]);
      setPage(data.page);
      setTotalPages(data.totalPages);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch {
      setError('Failed to load more articles.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const hasMoreArticles = page < totalPages;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <section>
      <ErrorNotification
        message={error}
        onClose={() => setError('')}
      />

      <ArticlesList articles={articles} />

      {hasMoreArticles && (
        <button
          type="button"
          onClick={handleLoadMore}
          disabled={isLoadingMore}
        >
          {isLoadingMore ? 'Loading...' : 'Load More'}
        </button>
      )}
    </section>
  );
}