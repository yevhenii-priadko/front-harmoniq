"use client";

import { useState } from "react";
import { FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import ArticleForm, { ArticleFormValues } from "@/components/ArticleForm/ArticleForm";
import ErrorNotification from "@/components/ErrorNotification/ErrorNotification";
import { createArticle } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

function getErrorMessage(error: unknown) {
  if (isAxiosError<{ message?: string }>(error)) {
    return (
      error.response?.data?.message ?? "Unable to publish the article. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to publish the article. Please try again.";
}

export default function NewArticlePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const username = useAuthStore((state) => state.user?.username ?? "Unknown");
  const [submitError, setSubmitError] = useState("");

  const mutation = useMutation({
    mutationFn: (newArticle: Parameters<typeof createArticle>[0]) =>
      createArticle(newArticle),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      router.push(`/articles/${data._id}`);
    },
    onError: (error) => {
      setSubmitError(getErrorMessage(error));
    },
  });

  const handleSubmit = async (
    values: ArticleFormValues,
    { resetForm }: FormikHelpers<ArticleFormValues>,
  ) => {
    if (!values.photo || typeof values.photo === "string") return;

    setSubmitError("");

    try {
      await mutation.mutateAsync({
        title: values.title,
        description: values.description,
        date: new Date().toISOString().slice(0, 10),
        author: username,
        photo: values.photo,
      });

      resetForm();
    } catch {
      // помилку вже показали через onError/submitError, тут просто гасимо
      // необроблений reject, щоб не спливав далі
    }
  };

  return (
    <>
      <ErrorNotification message={submitError} onClose={() => setSubmitError("")} />

      <ArticleForm onSubmit={handleSubmit} isLoading={mutation.status === "pending"} />
    </>
  );
}
