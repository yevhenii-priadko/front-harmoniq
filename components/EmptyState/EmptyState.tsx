import Link from 'next/link';
import css from './EmptyState.module.css';

type EmptyStateProps = {
  description: string;
  buttonText: string;
  href: string;
};

export default function EmptyState({
  description,
  buttonText,
  href,
}: EmptyStateProps) {
  return (
    <div className={css.container}>
      <div className={css.content}>
        <div className={css.iconWrapper}>
          <svg className={css.icon} aria-hidden="true">
            <use href="/sprite.svg#icon-alert" />
          </svg>
        </div>

        <h2 className={css.title}>Nothing found.</h2>

        <p className={css.description}>{description}</p>
      </div>

      <Link href={href} className={css.button}>
        {buttonText}
      </Link>
    </div>
  );
}