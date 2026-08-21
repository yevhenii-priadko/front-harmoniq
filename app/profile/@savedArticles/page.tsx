'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Spinner from '@/components/Spinner/Spinner';
import ArticlesList from '@/components/ArticlesList/ArticlesList';
import ErrorNotification from '@/components/ErrorNotification/ErrorNotification';
import { useProfileStore } from '@/lib/store/profileStore';
import {
  fetchSavedArticles,
  type Article,
} from '@/lib/api/clientApi';
import EmptyState from '@/components/EmptyState/EmptyState';
import Pagination from '@/components/Pagination/Pagination';
import css from '../ProfileLayout.module.css';

const PER_PAGE = 12;

function SavedArticlesPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(() => {
    const urlPage = Number(searchParams.get('savedPage'));
    return urlPage > 0 ? urlPage : 1;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const totalArticles = useProfileStore((state) => state.totalArticles);
  const setTotalArticles = useProfileStore((state) => state.setTotalArticles);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true);
        setError('');

        const data = await fetchSavedArticles(page, PER_PAGE);
        setTotalArticles(data.totalArticles);

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
  }, [page, refreshKey, setTotalArticles]);

  const updateSavedPageInUrl = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextPage > 1) {
      params.set('savedPage', String(nextPage));
    } else {
      params.delete('savedPage');
    }

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page || nextPage < 1 || nextPage > totalPages) {
      return;
    }

    setPage(nextPage);

    updateSavedPageInUrl(nextPage);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleRemovedFromSaved = (articleId: string) => {
    const nextTotalArticles = Math.max(totalArticles - 1, 0);
    const nextTotalPages = Math.ceil(nextTotalArticles / PER_PAGE);
    const nextPage = Math.min(page, Math.max(nextTotalPages, 1));

    setArticles((currentArticles) =>
      currentArticles.filter((article) => article._id !== articleId),
    );

    setTotalArticles(nextTotalArticles);
    setTotalPages(nextTotalPages);

    if (nextPage !== page) {
      setPage(nextPage);
      updateSavedPageInUrl(nextPage);
    } else {
      setRefreshKey((currentKey) => currentKey + 1);
    }
  };

  if (isLoading) {
    return (
      <div className={css.loadingWrapper}>
        <Spinner size={60} ariaLabel="oval-loading" />
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
          <ArticlesList
            articles={articles}
            initialIsSaved
            onRemovedFromSaved={handleRemovedFromSaved}
          />
        </div>
      ) : null}

      {totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
}

export default function SavedArticlesPage() {
  return (
    <Suspense fallback={null}>
      <SavedArticlesPageContent />
    </Suspense>
  );
}
