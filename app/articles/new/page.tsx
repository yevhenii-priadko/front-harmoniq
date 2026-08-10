"use client";
import { ChangeEvent, useState } from "react";
import css from "./NewArticlePage.module.css";
import Image from "next/image";

export default function NewArticlePage() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={css.container}>
      <h2 className={css.title}>Create an article</h2>
      <form className={css.form} action="">
        <div className={css.wrapper}>
          <input
            type="file"
            id="imageUpload"
            name="photo"
            accept="image/*"
            className={css.hiddenInput}
            onChange={handleFileChange}
          />

          <label htmlFor="imageUpload" className={css.uploadLabel}>
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                className={css.previewImage}
                width={300}
                height={200}
              />
            ) : (
              <svg width="98" height="82" className={css.cameraIcon}>
                <use href="/sprite.svg#icon-camera"></use>
              </svg>
            )}
          </label>
          <div className={css.titleWrapper}>
            <label className={css.label} htmlFor="title">
              Title
            </label>
            <input
              className={css.inputTitle}
              type="text"
              name="title"
              id="title"
              placeholder="Enter the title"
            />
          </div>
        </div>
        <textarea
          className={css.description}
          name="description"
          id="description"
          placeholder="Enter a text"
        ></textarea>
        <button className={css.submit} type="submit">
          Publish Article
        </button>
      </form>
    </div>
  );
}
