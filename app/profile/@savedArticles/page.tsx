'use client';

import { useEffect, useState } from 'react';
import ArticlesList from '@/components/ArticlesList/ArticlesList';
import ErrorNotification from '@/components/ErrorNotification/ErrorNotification';
import {
  fetchSavedArticles,
  type Article,
} from '@/lib/api/clientApi';

const PER_PAGE = 12;

export default function SavedArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true);
        setError('');

        const data = await fetchSavedArticles(1, PER_PAGE);

        setArticles(data.articles);
        setPage(data.page);
        setTotalPages(data.totalPages);
      } catch {
        setError('Failed to load saved articles.');
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  const handleLoadMore = async () => {
    const nextPage = page + 1;

    try {
      setIsLoadingMore(true);
      setError('');

      const data = await fetchSavedArticles(nextPage, PER_PAGE);

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
      setError('Failed to load more saved articles.');
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