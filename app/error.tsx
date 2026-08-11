"use client";

import { useEffect } from "react";
import styles from "./error.module.css";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles.errorPage}>
      <div className={styles.content}>
        <p className={styles.code}>Error</p>

        <h1 className={styles.title}>
          Something went wrong
        </h1>

        <p className={styles.message}>
          We couldn&apos;t complete your request.
          Please try again.
        </p>

        <button
          type="button"
          className={styles.retryButton}
          onClick={reset}
        >
          Try again
        </button>
      </div>
    </main>
  );
}