import type { ChangeEventHandler, FocusEventHandler } from "react";
import styles from "./FormField.module.css";

type FormFieldProps = {
  id: string;
  name: string;
  label: string;
  type: "text" | "email";
  value: string;
  placeholder?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  error?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
};

export default function FormField({
  id,
  name,
  label,
  type,
  value,
  placeholder,
  autoComplete,
  autoFocus = false,
  maxLength,
  error,
  onChange,
  onBlur,
}: FormFieldProps) {
  const messageId = `${id}-message`;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>

      <input
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={messageId}
        onChange={onChange}
        onBlur={onBlur}
      />

      <p className={styles.message} id={messageId} aria-live="polite">
        {error ?? ""}
      </p>
    </div>
  );
}
