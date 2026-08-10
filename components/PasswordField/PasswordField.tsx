"use client";

import { useState } from "react";
import type { ChangeEventHandler, FocusEventHandler, ReactNode } from "react";
import styles from "./PasswordField.module.css";

type PasswordFieldProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
  error?: string;
  helper?: ReactNode;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
};

export default function PasswordField({
  id,
  name,
  label,
  value,
  placeholder,
  autoComplete,
  minLength,
  maxLength,
  error,
  helper,
  onChange,
  onBlur,
}: PasswordFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const messageId = `${id}-message`;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>

      <div className={styles.inputWrapper}>
        <input
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          id={id}
          name={name}
          type={isPasswordVisible ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={messageId}
          onChange={onChange}
          onBlur={onBlur}
        />

        <button
          className={styles.visibilityButton}
          type="button"
          aria-label={
            isPasswordVisible
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
          aria-pressed={isPasswordVisible}
          onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
        >
          <svg className={styles.icon} aria-hidden="true">
            <use
              href={`/sprite.svg#${isPasswordVisible ? "icon-eye" : "icon-eye-crossed"}`}
            />
          </svg>
        </button>
      </div>

      <div className={styles.message} id={messageId} aria-live="polite">
        {error ?? helper}
      </div>
    </div>
  );
}
