"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import Button from "@/components/Button/Button";
import ErrorNotification from "@/components/ErrorNotification/ErrorNotification";
import ErrorSaveModal from "@/components/ErrorSaveModal/ErrorSaveModal";
import {
  addArticleToSaved,
  checkIsArticleSaved,
  removeArticleFromSaved,
} from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./ButtonAddToBookmarks.module.css";

type ButtonAddToBookmarksProps = {
  articleId: string;
  variant?: "icon" | "full";
  initialIsSaved?: boolean;
  onRemovedFromSaved?: (articleId: string) => void;
};

function getErrorMessage(error: unknown) {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "Unable to update saved articles.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to update saved articles.";
}

export default function ButtonAddToBookmarks({
  articleId,
  variant = "full",
  initialIsSaved = false,
  onRemovedFromSaved,
}: ButtonAddToBookmarksProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isChecking, setIsChecking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (initialIsSaved) {
      return;
    }

    let isCancelled = false;

    const checkSavedStatus = async () => {
      setIsChecking(true);

      try {
        const saved = await checkIsArticleSaved(articleId);

        if (!isCancelled) {
          setIsSaved(saved);
        }
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (!isCancelled) {
          setIsChecking(false);
        }
      }
    };

    checkSavedStatus();

    return () => {
      isCancelled = true;
    };
  }, [articleId, initialIsSaved, isAuthenticated]);

  const handleClick = async () => {
    // Не дозволяємо користувачу додавати статтю до збережених, якщо він не авторизований. Відкриваємо модальне вікно з повідомленням про помилку.
    if (!isAuthenticated) {
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      if (isSaved) {
        await removeArticleFromSaved(articleId);
        setIsSaved(false);
        onRemovedFromSaved?.(articleId);
      } else {
        await addArticleToSaved(articleId);
        setIsSaved(true);
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const isIcon = variant === "icon";

  return (
    <>
      <Button
        className={isIcon ? css.saveButtonIcon : css.saveButtonFull}
        type="button"
        fullWidth={!isIcon}
        size={isIcon ? "sm" : "md"}
        disabled={isChecking}
        isLoading={isLoading}
        loadingText={isIcon ? "" : isSaved ? "Removing..." : "Saving..."}
        aria-pressed={isSaved}
        aria-label={isIcon ? (isSaved ? "Remove from saved" : "Save article") : undefined}
        onClick={handleClick}
      >
        {!isIcon && (isSaved ? "Saved" : "Save")}

        <svg
          className={`${css.bookmarkIcon} ${isSaved ? css.bookmarkIconSaved : ""}`}
          aria-hidden="true"
        >
          <use href="/sprite.svg#icon-bookmark" />
        </svg>
      </Button>

      {isModalOpen && <ErrorSaveModal onClose={() => setIsModalOpen(false)} />}

      <ErrorNotification message={errorMessage} onClose={() => setErrorMessage("")} />
    </>
  );
}
