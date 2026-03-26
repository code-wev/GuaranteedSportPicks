"use client";

import BlogEditorForm from "@/components/Dashboard/BlogEditorForm";
import {
  useGetArticleByIdQuery,
  useUpdateArticleMutation,
} from "@/feature/ArticleApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditBlogPage({ params }) {
  const router = useRouter();
  const { data, isLoading } = useGetArticleByIdQuery(params.id);
  const [updateArticle, { isLoading: isSaving }] = useUpdateArticleMutation();

  const article = data?.data;

  const handleUpdate = async (form) => {
    if (!form.title || !form.content || !form.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("category", form.category);
    formData.append("content", form.content);
    formData.append("isActive", String(form.isActive));

    if (form.image) {
      formData.append("image", form.image);
    } else if (form.imageUrl) {
      formData.append("image", form.imageUrl);
    }

    try {
      const response = await updateArticle({
        id: params.id,
        data: formData,
      }).unwrap();

      if (response.status) {
        toast.success("Article updated successfully!");
        router.push("/dashboard/admin/blogs");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update article");
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center font-medium">Loading article...</div>;
  }

  if (!article) {
    return <div className="p-10 text-center font-medium">Article not found.</div>;
  }

  return (
    <div className="px-2 py-4 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold mb-6">Edit Blog</h1>
      <BlogEditorForm
        mode="edit"
        initialData={article}
        isSubmitting={isSaving}
        onSubmit={handleUpdate}
        onCancel={() => router.back()}
      />
    </div>
  );
}
