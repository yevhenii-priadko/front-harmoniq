"use client";

import { FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import ArticleForm, { ArticleFormValues } from "@/components/ArticleForm/ArticleForm";
import { updateArticle } from "@/lib/api/clientApi";

interface ClientEditProps {
  articleId: string;
  initialValues: ArticleFormValues;
}

export default function ClientEdit({ articleId, initialValues }: ClientEditProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof updateArticle>[1]) =>
      updateArticle(articleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      router.push(`/articles/${articleId}`);
    },
  });

  const handleSubmit = async (
    values: ArticleFormValues,
    { resetForm }: FormikHelpers<ArticleFormValues>,
  ) => {
    if (!values.title || !values.description) {
      return;
    }

    const payload: Parameters<typeof updateArticle>[1] = {
      title: values.title,
      description: values.description,
      date: values.date ?? new Date().toISOString().slice(0, 10),
      author: values.author ?? "Unknown",
      photo: typeof values.photo === "string" ? values.photo : "",
    };

    await mutation.mutateAsync(payload);

    resetForm();
  };

  return (
    <ArticleForm
      initialValues={initialValues}
      submitLabel="Save Changes"
      onSubmit={handleSubmit}
      isLoading={mutation.status === "pending"}
    />
  );
}
