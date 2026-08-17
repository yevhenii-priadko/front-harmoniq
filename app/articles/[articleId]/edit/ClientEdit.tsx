"use client";

import { useState } from "react";
import { FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import ArticleForm, { ArticleFormValues } from "@/components/ArticleForm/ArticleForm";
import ErrorNotification from "@/components/ErrorNotification/ErrorNotification";
import { updateArticle } from "@/lib/api/clientApi";

interface ClientEditProps {
  articleId: string;
  initialValues: ArticleFormValues;
}

function getErrorMessage(error: unknown) {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "Unable to save changes. Please try again.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to save changes. Please try again.";
}

export default function ClientEdit({ articleId, initialValues }: ClientEditProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState("");

  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof updateArticle>[1]) =>
      updateArticle(articleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      router.push(`/articles/${articleId}`);
    },
    onError: (error) => {
      setSubmitError(getErrorMessage(error));
    },
  });

  const handleSubmit = async (
    values: ArticleFormValues,
    { resetForm }: FormikHelpers<ArticleFormValues>,
  ) => {
    if (!values.title || !values.description) {
      return;
    }

    setSubmitError("");

    // photo передаємо як є (File або рядок) — updateArticle сам розбереться,
    // чи вантажити нове фото на Cloudinary, чи лишити старий URL без змін.
    const payload: Parameters<typeof updateArticle>[1] = {
      title: values.title,
      description: values.description,
      date: values.date ?? new Date().toISOString().slice(0, 10),
      author: values.author ?? "",
      photo: values.photo ?? "",
    };

    try {
      await mutation.mutateAsync(payload);
      resetForm();
    } catch {
      // помилку вже показали через onError/submitError, тут просто гасимо
      // необроблений reject, щоб не спливав далі
    }
  };

  return (
    <>
      <ErrorNotification message={submitError} onClose={() => setSubmitError("")} />

      <ArticleForm
        initialValues={initialValues}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
        isLoading={mutation.status === "pending"}
      />
    </>
  );
}
