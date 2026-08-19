"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ErrorNotification from "@/components/ErrorNotification/ErrorNotification";
import AuthorsItem from "@/components/AuthorsItem/AuthorsItem";
import Pagination from "@/components/Pagination/Pagination";
import {
  fetchAuthorsClient,
  type Author,
  type AuthorsResponse,
} from "@/lib/api/clientApi";
import css from "./AuthorsList.module.css";

const AUTHORS_PER_PAGE = 20;

type AuthorsListProps = {
  initialData: AuthorsResponse;
  initialError?: string;
};

function AuthorsListContent({
  initialData,
  initialError = "",
}: AuthorsListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialPage = initialData.page || 1;
  const urlPage = (() => {
    const parsed = Number(searchParams.get("page"));
    return parsed > 0 ? parsed : initialPage;
  })();
  const isDeepLinkedPage = urlPage !== initialPage;

  const [authors, setAuthors] = useState<Author[]>(
    isDeepLinkedPage ? [] : initialData.users,
  );
  const [page, setPage] = useState(urlPage);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [isLoading, setIsLoading] = useState(isDeepLinkedPage);
  const [error, setError] = useState(initialError);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      if (page === initialPage) {
        return;
      }
    }

    const loadAuthors = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await fetchAuthorsClient(page, AUTHORS_PER_PAGE);

        setAuthors(data.users);
        setTotalPages(data.totalPages);
      } catch {
        setError("Unable to load authors. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthors();
  }, [page, initialPage]);

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page || nextPage < 1 || nextPage > totalPages) {
      return;
    }

    setPage(nextPage);

    const params = new URLSearchParams(searchParams.toString());

    if (nextPage > 1) {
      params.set("page", String(nextPage));
    } else {
      params.delete("page");
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const hasAuthors = authors.length > 0;

  return (
    <>
      <ErrorNotification message={error} onClose={() => setError("")} />

      {hasAuthors && (
        <ul className={css.list}>
          {authors.map((author, index) => (
            <AuthorsItem
              key={`${author._id || "author"}-${index}`}
              author={author}
              priority={index < 4}
            />
          ))}
        </ul>
      )}

      {!hasAuthors && !isLoading && <p className={css.empty}>No authors found.</p>}

      {hasAuthors && totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}

export default function AuthorsList(props: AuthorsListProps) {
  return (
    <Suspense fallback={null}>
      <AuthorsListContent {...props} />
    </Suspense>
  );
}
