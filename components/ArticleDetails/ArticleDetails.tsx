"use client";

import { Fragment } from "react";
import Image from "next/image";
import type { Article } from "@/lib/api/clientApi";
import css from "./ArticleDetails.module.css";
import ArticleRecommendations from "@/components/ArticleRecommendations/ArticleRecommendations";
import ButtonAddToBookmarks from "@/components/ButtonAddToBookmarks/ButtonAddToBookmarks";
import ButtonEditArticle from "@/components/ButtonEditArticle/ButtonEditArticle";
import { useAuthStore } from "@/lib/store/authStore";

type ArticleDetailsProps = {
  article: Article;
  recommendedArticles: Article[];
};

export default function ArticleDetails({
  article,
  recommendedArticles,
}: ArticleDetailsProps) {
  // Розбиваємо текст description на строки по символу перевода рядка \n, щоб потім
  // відобразити їх у <p> з реальними HTML-тегами <br /> між ними. Але зустрічалися випадки, символу переноса: дійсний перевод рядка \n, та помилкові рядки  /n. Тому використовуємо регулярний вираз для розбиття на строки.
  const descriptionLines = article.description
    .split(/\r?\n|\\n|\/n/g)
    .map((line) => line.trim())
    .filter(Boolean);

  const user = useAuthStore((state) => state.user);
  const isAuthor = (user && user._id === article.userId) || false;

  return (
    <article className={css.article}>
      <div className={css.container}>
        <h1 className={css.title}>{article.title}</h1>

        <Image
          className={css.image}
          src={article.photo}
          alt={article.title}
          width={1224}
          height={620}
          priority
        />

        <div className={css.contentLayout}>
          <p className={css.description}>
            {descriptionLines.map((line, index) => (
              <Fragment key={`${index}-${line}`}>
                {line}

                {/*Додавання між строками тегу <br /> */}
                {index < descriptionLines.length - 1 && <br />}
              </Fragment>
            ))}
          </p>
          <div className={css.sidebar}>
            <ArticleRecommendations
              author={article.author}
              date={article.date}
              articles={recommendedArticles}
            />

            <ButtonAddToBookmarks articleId={article._id} />
            {isAuthor && <ButtonEditArticle articleId={article._id} showText={true} />}
          </div>
        </div>
      </div>
    </article>
  );
}
