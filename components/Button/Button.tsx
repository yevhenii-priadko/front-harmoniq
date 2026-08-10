import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  size?: "sm" | "md";
};

export default function Button({
  children,
  className = "",
  disabled = false,
  fullWidth = false,
  isLoading = false,
  loadingText,
  size = "md",
  ...buttonProps
}: ButtonProps) {
  const buttonClassName = [
    styles.button,
    styles[size],
    fullWidth ? styles.fullWidth : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={buttonClassName}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...buttonProps}
    >
      {isLoading && <span className={styles.spinner} aria-hidden="true" />}

      <span>{isLoading ? (loadingText ?? children) : children}</span>
    </button>
  );
}
