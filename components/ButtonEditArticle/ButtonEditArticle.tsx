import Link from 'next/link';
import css from './ButtonEditArticle.module.css';

type ButtonEditArticleProps = {
  articleId: string;
};

export default function ButtonEditArticle({
  articleId,
}: ButtonEditArticleProps) {
  return (
    <Link
      href={`/articles/${articleId}/edit`}
      className={css.editButton}
      aria-label="Edit article"
    >
      <svg className={css.editIcon} aria-hidden="true">
        <use href="/sprite.svg#icon-pencil" />
      </svg>
    </Link>
  );
}