"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { FiChevronDown, FiUpload } from "react-icons/fi";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const CATEGORIES = ["NFL", "NBA", "MLB", "NHL", "Soccer", "Tennis", "UFC", "Other"];

const buildInitialState = (initialData) => ({
  title: initialData?.title || "",
  category: initialData?.category || "NFL",
  content: initialData?.content || "",
  image: null,
  imageUrl: initialData?.image || "",
  isActive: initialData?.isActive ?? true,
});

export default function BlogEditorForm({
  mode = "create",
  initialData,
  isSubmitting,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(buildInitialState(initialData));
  const [preview, setPreview] = useState(initialData?.image || "");

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    updateField("image", file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    await onSubmit(form);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Enter article title"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Category *</label>
          <div className="relative">
            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="appearance-none w-full border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Publication Status</label>
          <div className="relative">
            <select
              value={form.isActive ? "published" : "draft"}
              onChange={(e) => updateField("isActive", e.target.value === "published")}
              className="appearance-none w-full border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Featured Image {mode === "create" ? "*" : ""}</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
              <FiUpload className="text-gray-600" />
              <span className="text-sm text-gray-600">
                {mode === "edit" ? "Replace Image" : "Choose Image"}
              </span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            {form.image && (
              <span className="text-xs text-gray-500 truncate max-w-[200px]">{form.image.name}</span>
            )}
            {!form.image && form.imageUrl && (
              <span className="text-xs text-gray-500 truncate max-w-[200px]">Current image kept</span>
            )}
          </div>
        </div>
      </div>

      {preview && (
        <div className="mb-6">
          <div className="relative w-48 h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
            <Image
              src={preview}
              alt="Preview"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col mb-6">
        <label className="text-sm font-medium text-gray-700 mb-1">Content *</label>
        <div className="h-[400px] mb-12">
          <ReactQuill
            theme="snow"
            value={form.content}
            onChange={(value) => updateField("content", value)}
            modules={modules}
            className="h-full rounded-lg"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 my-4" />

      <div className="flex items-center justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-5 py-2 bg-[#DC2626] text-white rounded-lg text-sm font-medium hover:bg-red-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? mode === "edit"
              ? "Saving..."
              : "Publishing..."
            : mode === "edit"
              ? "Save Changes"
              : "Publish"}
        </button>
      </div>
    </div>
  );
}
