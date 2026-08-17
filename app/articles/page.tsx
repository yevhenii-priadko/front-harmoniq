"use client";

import ArticlesList from "@/components/ArticlesList/ArticlesList";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import css from "./page.module.css";

type Article = {
  _id: string;
  title: string;
  description: string;
  photo: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  savedCount?: number;
};

type ArticlesResponse = {
  page: number;
  perPage: number;
  totalArticles: number;
  totalPages: number;
  articles: Article[];
};

const PER_PAGE = 12;

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalArticles, setTotalArticles] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filter, setFilter] = useState<"all" | "popular">("all");

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getArticles = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `/api/articles?filter=${filter}&page=1&perPage=${PER_PAGE}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }

        const data: ArticlesResponse = await response.json();

        setArticles(data.articles);
        setTotalArticles(data.totalArticles);
        setTotalPages(data.totalPages);
        setPage(1);
      } catch {
        setError("Failed to load articles.");
      } finally {
        setIsLoading(false);
      }
    };

    getArticles();
  }, [filter]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = event.target.value as "all" | "popular";

    if (newFilter === filter) {
      return;
    }

    setFilter(newFilter);
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;

    try {
      setIsLoadingMore(true);
      setError("");

      const response = await fetch(
        `/api/articles?filter=${filter}&page=${nextPage}&perPage=${PER_PAGE}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch more articles");
      }

      const data: ArticlesResponse = await response.json();

      setArticles((prevArticles) => [...prevArticles, ...data.articles]);
      setPage(data.page);
      setTotalPages(data.totalPages);

      // window.scrollTo({
      //   top: 0,
      //   behavior: "smooth",
      // });
    } catch {
      setError("Failed to load more articles.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const hasMoreArticles = page < totalPages;

  return (
    <div className={css.page}>
      <SectionTitle>Articles</SectionTitle>

      <div className={css.filters}>
        <p>{totalArticles} articles</p>

        <select value={filter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="popular">Popular</option>
        </select>
      </div>

      {error && <p>{error}</p>}

      {isLoading ? (
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
      ) : (
        <>
          <ArticlesList articles={articles} />

          {hasMoreArticles && (
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className={css.loadMoreButton}
            >
              {isLoadingMore ? "Loading..." : "Load More"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
