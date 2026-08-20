"use client";
import css from "./ArticlesItem.module.css";
import Image from "next/image";
import Link from "next/link";
import ButtonAddToBookmarks from "../ButtonAddToBookmarks/ButtonAddToBookmarks";
import ButtonEditArticle from "@/components/ButtonEditArticle/ButtonEditArticle";
import { useAuthStore } from "@/lib/store/authStore";

interface ArticlesItemProps {
  id: string;
  title: string;
  description: string;
  photo: string;
  userName: string;
  action?: "bookmark" | "edit";
  userId: string; // Додано userId для перевірки авторства
  initialIsSaved?: boolean;
  onRemovedFromSaved?: (articleId: string) => void;
}

export default function ArticlesItem({
  id,
  title,
  description,
  photo,
  userName,
  action = "bookmark",
  userId,
  initialIsSaved = false,
  onRemovedFromSaved,
}: ArticlesItemProps) {

  const user = useAuthStore((state) => state.user);
  const isAuthor = (user && user._id === userId) || false;

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
        {action === "edit" && isAuthor ? (
          <ButtonEditArticle
            className={css.edit}
            articleId={id}
            showText={false}
          />
        ) : (
          <ButtonAddToBookmarks
            articleId={id}
            variant="icon"
            initialIsSaved={initialIsSaved}
            onRemovedFromSaved={onRemovedFromSaved}
          />
        )}
      </div>
    </li>
  );
}
