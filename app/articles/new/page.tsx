"use client";

import { useId } from "react";
import css from "./NewArticlePage.module.css";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArticleFormValues, createArticle } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

const ArticleSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, `Too short!`)
    .max(48, `Too long!`) // ⚠️ бекенд дозволяє макс 48, не 50
    .required("Required"),
  description: Yup.string()
    .trim()
    .min(100, `Too short!`)
    .max(4000, `Too long!`)
    .required("Required"),
  // ⚠️ ТИМЧАСОВО: бекенд поки не приймає файл, лише URL-рядок (див.
  // коментар у lib/api/clientApi.ts) — тому це звичайний текстовий інпут,
  // а не file upload.
  photo: Yup.string().url("Enter a valid image URL").required("Required"),
});

interface ArticleForm {
  title: string;
  description: string;
  photo: string;
}

export default function NewArticlePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fieldId = useId();
  const username = useAuthStore((state) => state.user?.username ?? "Unknown");

  const initialValues: ArticleForm = {
    title: ``,
    description: ``,
    photo: "",
  };

  const mutation = useMutation({
    mutationFn: (newArticle: ArticleFormValues) => createArticle(newArticle),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`articles`] });
      router.push(`/articles/${data._id}`);
    },
  });

  const handleSubmit = async (
    values: ArticleForm,
    { resetForm }: FormikHelpers<ArticleForm>,
  ) => {
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
        {({ isValid, dirty }) => {
          const isDisabled = !isValid || !dirty;

          return (
            <Form className={css.form}>
              <div className={css.wrapper}>
                <div className={css.titleWrapper}>
                  <label className={css.label} htmlFor={`${fieldId}-photo`}>
                    Photo URL
                  </label>
                  <Field
                    className={css.inputTitle}
                    type="text"
                    name="photo"
                    id={`${fieldId}-photo`}
                    placeholder="https://..."
                  />
                </div>

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
