import styles from "./PasswordStrengthBar.module.css";

type PasswordStrengthBarProps = {
  password: string;
};

const STRENGTH_LABELS = ["", "Weak", "Medium", "Strong", "Very strong"];

// The indicator gives password advice; form validation still checks the 8-64 limit.
function calculatePasswordStrength(password: string) {
  if (!password) {
    return { level: 0, percentage: 0 };
  }

  const lengthPoints = Math.min(password.length / 12, 1) * 50;
  const characterGroups = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
  const percentage = Math.min(
    100,
    Math.round(lengthPoints + characterGroups * 12.5),
  );

  if (percentage < 30) {
    return { level: 1, percentage };
  }

  if (percentage < 65) {
    return { level: 2, percentage };
  }

  if (percentage < 85) {
    return { level: 3, percentage };
  }

  return { level: 4, percentage };
}

export default function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  const { level, percentage } = calculatePasswordStrength(password);

  // Hide the indicator until the visitor starts entering a password.
  if (level === 0) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.track}
        role="progressbar"
        aria-label="Password strength"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        aria-valuetext={STRENGTH_LABELS[level]}
      >
        <span
          className={`${styles.fill} ${styles[`strength${level}`]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
