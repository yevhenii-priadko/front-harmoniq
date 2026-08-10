"use client";

import { useEffect } from "react";
import styles from "./ErrorNotification.module.css";

type ErrorNotificationProps = {
  message: string;
  onClose: () => void;
};

export default function ErrorNotification({ message, onClose }: ErrorNotificationProps) {
  useEffect(() => {
    if (!message) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div className={styles.notification} role="alert">
      <p>{message}</p>

      <button
        className={styles.closeButton}
        type="button"
        aria-label="Close error message"
        onClick={onClose}
      >
        <svg className={styles.closeIcon} aria-hidden="true">
          <use href="/sprite.svg#icon-close-small" />
        </svg>
      </button>
    </div>
  );
}
