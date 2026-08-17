"use client";

import { useEffect } from "react";
import Link from "next/link";
import css from "./ErrorSaveModal.module.css";

type ErrorSaveModalProps = {
  onClose: () => void;
};

export default function ErrorSaveModal({ onClose }: ErrorSaveModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className={css.backdrop} role="presentation" onMouseDown={onClose}>
      <div
        className={css.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="error-save-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className={css.closeButton}
          type="button"
          aria-label="Close modal"
          onClick={onClose}
        >
          <svg className={css.closeIcon} aria-hidden="true">
            <use href="/sprite.svg#icon-close" />
          </svg>
        </button>

        <h2 id="error-save-title" className={css.title}>
          Error while saving
        </h2>

        <p className={css.description}>
          To save an article, please log in to your account or register.
        </p>

        <div className={css.actions}>
          <Link href="/login" className={css.loginLink}>
            Log in
          </Link>

          <Link href="/register" className={css.registerLink}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
