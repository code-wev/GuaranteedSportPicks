"use client";

import { useCreateArticleMutation } from "@/feature/ArticleApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import BlogEditorForm from "@/components/Dashboard/BlogEditorForm";

export default function NewBlog() {
  const [createArticle, { isLoading }] = useCreateArticleMutation();
  const router = useRouter();

  const handlePublish = async (form) => {
    if (!form.title || !form.content || !form.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!form.image) {
      toast.error("Please select a featured image");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("category", form.category);
    formData.append("content", form.content);
    formData.append("image", form.image);
    formData.append("isActive", String(form.isActive));

    try {
      const response = await createArticle(formData).unwrap();

      if (response.status) {
        toast.success(form.isActive ? "Article published successfully!" : "Draft saved successfully!");
        router.push("/dashboard/admin/blogs");
      }
    } catch (err) {
      console.error("Failed to publish article:", err);
      toast.error(err?.data?.message || "Failed to publish article");
    }
  };

  return (
    <div className="px-2 py-4 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold mb-6">New Blog Management</h1>
      <BlogEditorForm
        mode="create"
        isSubmitting={isLoading}
        onSubmit={handlePublish}
        onCancel={() => router.back()}
      />
    </div>
  );
}
