"use client";

import { FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import ArticleForm, { ArticleFormValues } from "@/components/ArticleForm/ArticleForm";
import { createArticle } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function NewArticlePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const username = useAuthStore((state) => state.user?.username ?? "Unknown");

  const mutation = useMutation({
    mutationFn: (newArticle: Parameters<typeof createArticle>[0]) =>
      createArticle(newArticle),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      router.push(`/articles/${data._id}`);
    },
  });

  const handleSubmit = async (
    values: ArticleFormValues,
    { resetForm }: FormikHelpers<ArticleFormValues>,
  ) => {
    if (!values.photo || typeof values.photo === "string") return;

    await mutation.mutateAsync({
      title: values.title,
      description: values.description,
      date: new Date().toISOString().slice(0, 10),
      author: username,
      photo: values.photo,
    });

    resetForm();
  };

  return (
    <ArticleForm onSubmit={handleSubmit} isLoading={mutation.status === "pending"} />
  );
}
