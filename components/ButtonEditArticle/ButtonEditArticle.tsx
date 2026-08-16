import css from "./ButtonEditArticle.module.css";
import Link from "next/link";

interface EditArticleButtonProps {
  articleId: string;
  showText?: boolean;
  className?: string;
}

export default function EditArticleButton({
  articleId,
  showText = true,
  className = "",
}: EditArticleButtonProps) {
  const editUrl = `/articles/${articleId}/edit`;

  return (
    <Link href={editUrl} className={`${css.button} ${className}`}>

      {showText && <span className={css.text}>Edit</span>}
      <svg width={24} height={24} className={css.icon}>
        <use href="/sprite.svg#icon-edit"></use>
      </svg>
    </Link>
  );
}