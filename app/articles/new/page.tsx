"use client";

import { ChangeEvent, useId, useState } from "react";
import css from "./NewArticlePage.module.css";
import Image from "next/image";
import { Field, FieldProps, Form, Formik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArticleFormValues, createArticle } from "@/lib/api/clientApi";

const ArticleSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, `Too short!`)
    .max(50, `Too long!`)
    .required("Required"),
  description: Yup.string()
    .trim()
    .min(100, `Too short!`)
    .max(4000, `Too long!`)
    .required("Required"),
  image: Yup.string().required("Required"),
});

interface ArticleForm {
  title: string;
  description: string;
  photo: string;
}

export default function NewArticlePage() {
  const queryClient = useQueryClient();
  const fieldId = useId();

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
    photo: "",
  };

  const mutation = useMutation({
    mutationFn: (newArticle: ArticleFormValues) => createArticle(newArticle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`articles`] });
    },
  });

  const handleSubmit = (values: ArticleForm) => {
    mutation.mutate({
      title: values.title,
      description: values.description,
      date: new Date().toISOString(),
      author: "",
      photo: values.photo,
    });
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
        {({ setFieldValue, isValid, dirty, touched, errors }) => {
          const isDisabled = !isValid || !dirty;

          return (
            <Form className={css.form}>
              <div className={css.wrapper}>
                <Field name="image">
                  {({ form }: FieldProps) => (
                    <input
                      type="file"
                      id={`${fieldId}-image`}
                      accept="image/*"
                      className={css.hiddenInput}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files && e.target.files[0]) {
                          form.setFieldValue("image", e.target.files[0]);
                          handleFileChange(e);
                        }
                      }}
                    />
                  )}
                </Field>

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
                <div className={css.titleWrapper}>
                  <label className={css.label} htmlFor="title">
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
