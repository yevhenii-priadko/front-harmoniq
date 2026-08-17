'use client';

import { useEffect, useState } from 'react';
import { Oval } from 'react-loader-spinner';
import ArticlesList from '@/components/ArticlesList/ArticlesList';
import ErrorNotification from '@/components/ErrorNotification/ErrorNotification';
import {
  fetchSavedArticles,
  type Article,
} from '@/lib/api/clientApi';
import EmptyState from '@/components/EmptyState/EmptyState';
import css from '../ProfileLayout.module.css';

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
        setPage(Number(data.page));
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
      setPage(Number(data.page));
      setTotalPages(data.totalPages);

    } catch {
      setError('Failed to load more saved articles.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const hasMoreArticles = page < totalPages;

  if (isLoading) {
    return (
      <div className={css.loadingWrapper}>
        <Oval
          height={60}
          width={60}
          color="var(--green)"
          secondaryColor="#D1E0D8"
          strokeWidth={2}
          strokeWidthSecondary={2}
          visible={true}
          ariaLabel="oval-loading"
        />
      </div>
    );
  }

  return (
    <section>
      <ErrorNotification
        message={error}
        onClose={() => setError('')}
      />

      {!error && articles.length === 0 ? (
        <div className={css.savedArticlesEmpty}>
          <EmptyState
            description="Save your first article"
            buttonText="Go to articles"
            href="/articles"
          />
        </div>
      ) : articles.length > 0 ? (
        <div className={css.profileArticlesList}>
          <ArticlesList articles={articles} />
        </div>
      ) : null}

      {hasMoreArticles && (
        <button
          className={css.loadMoreButton}
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