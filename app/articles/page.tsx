"use client";

import ArticlesList from "@/components/ArticlesList/ArticlesList";
import EmptyState from "@/components/EmptyState/EmptyState";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import Pagination from "@/components/Pagination/Pagination";
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
  const [error, setError] = useState("");

  useEffect(() => {
    const getArticles = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `/api/articles?filter=${filter}&page=${page}&perPage=${PER_PAGE}`,
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
      } catch {
        setError("Failed to load articles.");
      } finally {
        setIsLoading(false);
      }
    };

    getArticles();
  }, [filter, page]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = event.target.value as "all" | "popular";

    if (newFilter === filter) {
      return;
    }

    setPage(1);
    setFilter(newFilter);
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page || nextPage < 1 || nextPage > totalPages) {
      return;
    }

    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={css.page}>
      <SectionTitle>Articles</SectionTitle>

      <div
        className={`${css.filters} ${
          !isLoading && !error && articles.length === 0 ? css.emptyFilters : ""
        }`}
      >
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
          {!error && articles.length === 0 ? (
            <EmptyState
              description="Be the first, who create an article"
              buttonText="Create an article"
              href="/articles/new"
            />
          ) : articles.length > 0 ? (
            <>
              <ArticlesList articles={articles} />
              {totalPages > 1 && (
                <Pagination
                  pageCount={totalPages}
                  currentPage={page}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
