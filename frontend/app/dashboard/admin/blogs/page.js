"use client";

import { useState } from "react";
import { FiChevronDown, FiEye, FiTrash2, FiEdit3, FiSearch } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { useGetAllArticlesQuery, useDeleteArticleMutation } from "@/feature/ArticleApi";
import toast from "react-hot-toast";

const isValidUrl = (url) => {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
};

export default function BlogManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");

  const { data, isLoading } = useGetAllArticlesQuery({
    page,
    limit: 10,
    search: search || undefined,
    isActive: status === "Published" ? "true" : status === "Unpublished" ? "false" : undefined,
  });

  const [deleteArticle] = useDeleteArticleMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        const res = await deleteArticle(id).unwrap();
        if (res.status) {
          toast.success("Article deleted successfully");
        }
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete article");
      }
    }
  };

  const statusStyle = {
    true: "bg-green-50 text-green-600",
    false: "bg-red-50 text-red-500",
  };

  if (isLoading) return <div className="p-10 text-center font-medium">Loading articles...</div>;

  return (
    <div className="px-6 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between py-6">
        <h1 className="text-2xl font-semibold text-gray-800">Blog Management</h1>
        <Link href="/dashboard/admin/blogs/new-blog" className="bg-[#DC2626] hover:bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-all">
          + Add Blog
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-700">All Posts ({data?.data?.length || 0})</h2>
        </div>

        {/* Filter Row */}
        <div className="flex flex-col md:flex-row items-center justify-end gap-3 mb-6">
          <div className="relative w-full md:w-44">
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none border border-gray-300 rounded-lg px-4 py-2 text-sm w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option>All Status</option>
              <option>Published</option>
              <option>Unpublished</option>
            </select>
            <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold border-b border-gray-200">
              <tr>
                <th className="px-4 py-4">Article</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Author</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {data?.data?.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                        {post.image && isValidUrl(post.image) ? (
                          <Image
                            src={post.image}
                            fill
                            alt="thumb"
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400 uppercase font-black bg-gray-50">
                            {post.category || 'N/A'}
                          </div>
                        )}
                      </div>

                      <div className="max-w-[200px] md:max-w-md">
                        <p className="font-bold text-gray-800 truncate" title={post.title}>{post.title}</p>
                        <p className="text-[10px] text-gray-400 font-medium truncate">/{post.slug}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        statusStyle[post.isActive]
                      }`}
                    >
                      {post.isActive ? "Published" : "Unpublished"}
                    </span>
                  </td>

                  <td className="px-4 py-4 font-medium text-gray-700">
                    {post.author ? `${post.author.firstName} ${post.author.lastName}` : "Expert Team"}
                  </td>

                  <td className="px-4 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">
                      {post.category}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-[11px] text-gray-500 font-medium">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-4 text-xl">
                      <Link href={`/blog/${post.slug}`} target="_blank" title="View Article">
                        <FiEye className="text-gray-400 cursor-pointer hover:text-green-600 transition-colors" />
                      </Link>
                      <Link href={`/dashboard/admin/blogs/edit/${post._id}`} title="Edit Article">
                        <FiEdit3 className="text-gray-400 cursor-pointer hover:text-blue-600 transition-colors" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(post._id)}
                        title="Delete Article"
                        className="transition-colors hover:text-red-600"
                      >
                        <FiTrash2 className="text-gray-400 hover:text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data?.data?.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-medium">No articles found.</p>
          </div>
        )}

        {/* Pagination */}
        {data?.meta && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button 
              disabled={page === 1}
              onClick={() => setPage(prev => prev - 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-800">{page}</span>
              <span className="text-sm text-gray-400">/</span>
              <span className="text-sm text-gray-400">{data.meta.totalPages}</span>
            </div>
            <button 
              disabled={page === data.meta.totalPages}
              onClick={() => setPage(prev => prev + 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
