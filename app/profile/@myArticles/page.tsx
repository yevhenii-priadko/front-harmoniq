"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/Spinner/Spinner";
import ArticlesList from "@/components/ArticlesList/ArticlesList";
import { fetchUserArticles, type Article } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import ErrorNotification from "@/components/ErrorNotification/ErrorNotification";
import { useProfileStore } from "@/lib/store/profileStore";
import EmptyState from "@/components/EmptyState/EmptyState";
import Pagination from "@/components/Pagination/Pagination";
import css from "../ProfileLayout.module.css";

const PER_PAGE = 12;

function MyArticlesPageContent() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(() => {
    const urlPage = Number(searchParams.get("myPage"));
    return urlPage > 0 ? urlPage : 1;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const setTotalArticles = useProfileStore((state) => state.setTotalArticles);

  useEffect(() => {
    const loadArticles = async () => {
      if (!user?._id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const data = await fetchUserArticles(user._id, page, PER_PAGE);
        setTotalArticles(data.totalArticles);

        setArticles(data.articles);
        setPage(Number(data.page));
        setTotalPages(data.totalPages);
      } catch {
        setError("Failed to load your articles.");
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, [user?._id, page, setTotalArticles]);

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page || nextPage < 1 || nextPage > totalPages) {
      return;
    }

    setPage(nextPage);

    const params = new URLSearchParams(searchParams.toString());

    if (nextPage > 1) {
      params.set("myPage", String(nextPage));
    } else {
      params.delete("myPage");
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
      <ErrorNotification message={error} onClose={() => setError("")} />

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
          <ArticlesList articles={articles} action="edit" />
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

export default function MyArticlesPage() {
  return (
    <Suspense fallback={null}>
      <MyArticlesPageContent />
    </Suspense>
  );
}
