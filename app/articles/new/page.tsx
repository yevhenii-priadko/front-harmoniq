"use client";

import { ChangeEvent, useId, useState } from "react";
import css from "./NewArticlePage.module.css";
import Image from "next/image";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "@tanstack/react-query";

const ArticleSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, `Too short!`)
    .max(50, `Too long!`)
    .required("Required"),
  description: Yup.string().trim().min(100).max(4000, `Too long!`).required("Required"),
  image: Yup.string().required("Required"),
});

interface ArticleForm {
  title: string;
  description: string;
  image: File | string | null;
}

export default function NewArticlePage() {
  // const queryClient = useQueryClient()
  const fieldId = useId()

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

  const initialValues: ArticleForm = {
    title: ``,
    description: ``,
    image: ``,
  };

  const handleSubmit = (values: ArticleForm) => {
    
  };

  return (
    <div className={css.container}>
      <h2 className={css.title}>Create an article</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={ArticleSchema}
      >
        {({ setFieldValue }) => (
          <Form className={css.form}>
            <div className={css.wrapper}>
              <input
                type="file"
                id="imageUpload"
                name="image"
                accept="image/*"
                className={css.hiddenInput}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files[0]) {
                    // set Formik field value so validation sees the file
                    setFieldValue("image", e.target.files[0]);
                    handleFileChange(e);
                  }
                }}
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
                <Field
                  className={css.inputTitle}
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter the title"
                />
              </div>
            </div>
            <Field
              as="textarea"
              className={css.description}
              name="description"
              id="description"
              placeholder="Enter a text"
            />
            <button className={css.submit} type="submit">
              Publish Article
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
