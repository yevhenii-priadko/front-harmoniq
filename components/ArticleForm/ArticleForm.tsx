"use client";

import { ChangeEvent, useId, useState } from "react";
import Image from "next/image";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

import css from "@/app/articles/new/NewArticlePage.module.css";

const MAX_FILE_SIZE = 1024 * 1024;

const ArticleSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, `Too short!`)
    .max(48, `Too long!`)
    .required("Required"),
  description: Yup.string()
    .trim()
    .min(100, `Too short!`)
    .max(4000, `Too long!`)
    .required("Required"),
  photo: Yup.mixed<File | string>().required("Required"),
});

export interface ArticleFormValues {
  title: string;
  description: string;
  photo: File | string | null;
  date?: string;
  author?: string;
}

interface ArticleFormProps {
  initialValues?: ArticleFormValues;
  submitLabel?: string;
  onSubmit: (
    values: ArticleFormValues,
    helpers: FormikHelpers<ArticleFormValues>,
  ) => Promise<void> | void;
  isLoading?: boolean;
}

export default function ArticleForm({
  initialValues = { title: "", description: "", photo: null },
  submitLabel = "Publish Article",
  onSubmit,
  isLoading = false,
}: ArticleFormProps) {
  const fieldId = useId();

  const [preview, setPreview] = useState<string | null>(
    typeof initialValues.photo === "string" && initialValues.photo
      ? initialValues.photo
      : null,
  );
  const [photoError, setPhotoError] = useState("");

  const handleSubmit = async (
    values: ArticleFormValues,
    helpers: FormikHelpers<ArticleFormValues>,
  ) => {
    await onSubmit(values, helpers);

    if (!values.photo) {
      setPreview(null);
    }
  };

  return (
    <div className={css.container}>
      <h2 className={css.title}>Create an article</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={ArticleSchema}
        validateOnMount
      >
        {({ isValid, dirty, setFieldValue }) => {
          const isDisabled = !isValid || !dirty || !!isLoading;

          const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            setPhotoError("");

            if (!file) return;

            if (!file.type.startsWith("image/")) {
              setPhotoError("Only images are allowed.");
              setFieldValue("photo", null);
              return;
            }

            if (file.size > MAX_FILE_SIZE) {
              setPhotoError("Maximum file size is 1 MB.");
              setFieldValue("photo", null);
              return;
            }

            setFieldValue("photo", file);

            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
          };

          return (
            <Form className={css.form}>
              <div className={css.wrapper}>
                <input
                  type="file"
                  id={`${fieldId}-image`}
                  accept="image/*"
                  className={css.hiddenInput}
                  onChange={handleFileChange}
                />

                <label htmlFor={`${fieldId}-image`} className={css.uploadLabel}>
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

                {photoError && <p className={css.error}>{photoError}</p>}

                <div className={css.titleWrapper}>
                  <label className={css.label} htmlFor={`${fieldId}-title`}>
                    Title
                  </label>
                  <Field
                    className={css.inputTitle}
                    type="text"
                    name="title"
                    id={`${fieldId}-title`}
                    placeholder="Enter the title"
                  />
                </div>
              </div>

              <Field
                as="textarea"
                className={css.description}
                name="description"
                id={`${fieldId}-description`}
                placeholder="Enter a text"
              />

              <button
                className={`${css.submit} ${isDisabled ? css.disabled : ""}`}
                type="submit"
                disabled={isDisabled}
              >
                {isLoading ? "Loading..." : submitLabel}
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
