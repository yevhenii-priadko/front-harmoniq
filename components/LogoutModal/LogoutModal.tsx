"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";
import css from "./LogoutModal.module.css";

type LogoutModalProps = {
  onClose: () => void;
  onError: (message: string) => void;
};

export default function LogoutModal({ onClose, onError }: LogoutModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        cache: "no-store",
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;

        onError(data?.message ?? "Logout failed. Please try again.");
      }
    } catch {
      onError("Authentication server is unavailable.");
    } finally {
      setIsLoading(false);
      onClose();
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div
      className={css.backdrop}
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <div
        className={css.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
        aria-describedby="logout-modal-description"
      >
        <button
          className={css.closeButton}
          type="button"
          aria-label="Close logout confirmation"
          onClick={onClose}
        >
          <svg className={css.closeIcon} aria-hidden="true">
            <use href="/sprite.svg#icon-close-small" />
          </svg>
        </button>

        <div className={css.content}>
          <h2 className={css.title} id="logout-modal-title">
            Log out
          </h2>
          <p className={css.description} id="logout-modal-description">
            Are you sure you want to log out?
          </p>
        </div>

        <div className={css.actions}>
          <Button
            type="button"
            size="sm"
            className={css.logoutButton}
            isLoading={isLoading}
            loadingText="Logging out..."
            onClick={handleLogout}
          >
            Logout
          </Button>
          <button
            className={css.cancelButton}
            type="button"
            disabled={isLoading}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
