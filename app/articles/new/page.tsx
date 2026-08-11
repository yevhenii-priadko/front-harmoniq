"use client";

import { ChangeEvent, useId, useState } from "react";
import Image from "next/image";
import css from "./NewArticlePage.module.css";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createArticle } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB, як вимагає ТЗ

const ArticleSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, `Too short!`)
    .max(48, `Too long!`) // бекенд дозволяє макс 48
    .required("Required"),
  description: Yup.string()
    .trim()
    .min(100, `Too short!`)
    .max(4000, `Too long!`)
    .required("Required"),
  photo: Yup.mixed<File>().required("Required"),
});

interface ArticleForm {
  title: string;
  description: string;
  photo: File | null;
}

export default function NewArticlePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fieldId = useId();
  const username = useAuthStore((state) => state.user?.username ?? "Unknown");

  const [preview, setPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");

  const initialValues: ArticleForm = {
    title: ``,
    description: ``,
    photo: null,
  };

  const mutation = useMutation({
    mutationFn: (newArticle: {
      title: string;
      description: string;
      date: string;
      author: string;
      photo: File;
    }) => createArticle(newArticle),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`articles`] });
      router.push(`/articles/${data._id}`);
    },
  });

  const handleSubmit = async (
    values: ArticleForm,
    { resetForm }: FormikHelpers<ArticleForm>,
  ) => {
    if (!values.photo) return;

    try {
      await mutation.mutateAsync({
        title: values.title,
        description: values.description,
        // ⚠️ бекенд очікує 'рррр-мм-дд', а не повний ISO-таймстамп
        date: new Date().toISOString().slice(0, 10),
        author: username,
        photo: values.photo,
      });

      resetForm();
      setPreview(null);
    } catch (err) {
      console.error("Article submission failed", err);
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
          const isDisabled = !isValid || !dirty;

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
                Publish Article
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
