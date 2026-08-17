'use client';

import { useEffect, useState } from 'react';
import { Oval } from 'react-loader-spinner';
import ArticlesList from '@/components/ArticlesList/ArticlesList';
import {
  fetchUserArticles,
  type Article,
} from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import ErrorNotification from '@/components/ErrorNotification/ErrorNotification';
import { useProfileStore } from '@/lib/store/profileStore';
import EmptyState from '@/components/EmptyState/EmptyState';
import css from '../ProfileLayout.module.css';

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
        setPage(Number(data.page));
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
      setPage(Number(data.page));
      setTotalPages(data.totalPages);

    } catch {
      setError('Failed to load more articles.');
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
        <div className={css.myArticlesEmpty}>
          <EmptyState
            description="Write your first article"
            buttonText="Create an article"
            href="/articles/new"
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