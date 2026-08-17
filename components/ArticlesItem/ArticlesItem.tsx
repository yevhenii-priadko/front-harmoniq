import css from "./ArticlesItem.module.css";
import Image from "next/image";
import Link from "next/link";
import ButtonAddToBookmarks from "../ButtonAddToBookmarks/ButtonAddToBookmarks";
import ButtonEditArticle from '../ButtonEditArticle/ButtonEditArticle';

interface ArticlesItemProps {
  id: string;
  title: string;
  description: string;
  photo: string;
  userName: string;
  action?: "bookmark" | "edit";
}

export default function ArticlesItem({
  id,
  title,
  description,
  photo,
  userName,
  action = "bookmark",
}: ArticlesItemProps) {
  return (
    <li className={css.articleItem}>
      <div className={css.articleItem__image}>
        <Image src={photo} alt={title} width={400} height={234} />
      </div>
      <div className={css.articleItem__content}>
        <p className={css.articleItem__userName}>{userName}</p>
        <h2 className={css.articleItem__title}>{title}</h2>
        <p className={css.articleItem__description}>{description}</p>
      </div>
      <div className={css.articleItem__buttons}>
        <Link href={`/articles/${id}`} className={css.articleItem__button}>
          Learn more
        </Link>
        {action === 'edit' ? (
          <ButtonEditArticle articleId={id} />
        ) : (
          <ButtonAddToBookmarks articleId={id} variant="icon" />
        )}

        {/* <ButtonAddToBookmarks articleId={id} /> */}
      </div>
    </li>
  );
}
