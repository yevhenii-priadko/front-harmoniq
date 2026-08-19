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
  // Нормалізуємо всі варіанти переносу рядка (реальний \r\n/\n, а також помилкові
  // текстові послідовності \n та /n, які зустрічалися в старих статтях) до
  // єдиного символу \n. ВАЖЛИВО: раніше тут одразу спліттили по одному переносу
  // і викидали порожні рядки через filter(Boolean) — через це порожній рядок
  // між абзацами (два Enter поспіль) просто зникав, і абзаци візуально
  // склеювались в один суцільний текст без відступу між ними. Тепер спершу
  // ділимо на АБЗАЦИ (розділені порожнім рядком), і лише всередині абзацу —
  // на окремі рядки для <br />.
  const paragraphs = article.description
    .replace(/\r\n|\\n|\/n/g, "\n")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
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
          <div className={css.descriptionWrapper}>
            {paragraphs.map((paragraph, pIndex) => {
              const lines = paragraph
                .split(/\n/)
                .map((line) => line.trim())
                .filter(Boolean);

              return (
                <p className={css.description} key={`${pIndex}-${paragraph}`}>
                  {lines.map((line, lIndex) => (
                    <Fragment key={`${lIndex}-${line}`}>
                      {line}

                      {/*Додавання між рядками одного абзацу тегу <br /> */}
                      {lIndex < lines.length - 1 && <br />}
                    </Fragment>
                  ))}
                </p>
              );
            })}
          </div>
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
