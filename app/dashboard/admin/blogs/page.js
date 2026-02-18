"use client";

import { FiChevronDown, FiEye, FiTrash2, FiEdit3 } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

export default function BlogManagementPage() {
  const posts = [
    {
      title: "NFL Week 16 Betting Preview: Top Picks and Analysis",
      slug: "/nfl-week-16-betting-preview-top-picks-analysis",
      author: "Mike Johnson",
      views: "8",
      status: "Published",
      date: "2024-01-15 14:30:00",
      image: "/dashboard/admin/blog/blog.jpg",
    },
    {
      title: "NFL Week 16 Betting Preview: Top Picks and Analysis",
      slug: "/nfl-week-16-betting-preview-top-picks-analysis",
      author: "Mike Johnson",
      views: "8",
      status: "Published",
      date: "2024-01-15 14:30:00",
      image: "/dashboard/admin/blog/blog.jpg",
    },
    {
      title: "NFL Week 16 Betting Preview: Top Picks and Analysis",
      slug: "/nfl-week-16-betting-preview-top-picks-analysis",
      author: "Mike Johnson",
      views: "8",
      status: "Published",
      date: "2024-01-15 14:30:00",
      image: "/dashboard/admin/blog/blog.jpg",
    },
    {
      title: "NFL Week 16 Betting Preview: Top Picks and Analysis",
      slug: "/nfl-week-16-betting-preview-top-picks-analysis",
      author: "Mike Johnson",
      views: "8",
      status: "Published",
      date: "2024-01-15 14:30:00",
      image: "/dashboard/admin/blog/blog.jpg",
    },
  ];

  const statusStyle = {
    Published: "bg-green-50 text-green-600",
    Unpublished: "bg-red-50 text-red-500",
  };

  return (
    <div className="px-6 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blog Management</h1>
        <Link href="/dashboard/admin/blogs/new-blog" className="bg-[#DC2626] hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
          + Add Blog
        </Link>
      </div>
      {/* Blog Post Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6 shadow-sm">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">Blog Post (0{posts.length})</h2>
        </div>

        {/* Filter Row */}
        <div className="flex flex-col md:flex-row items-center justify-end gap-3 mb-4">
          <div className="relative w-full md:w-40">
            <select className="appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm w-full cursor-pointer focus:outline-none">
              <option>All Status</option>
              <option>Published</option>
              <option>Unpublished</option>
            </select>
            <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
          </div>

          <input
            type="text"
            placeholder="Search Posts..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-52 placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500 border-b border-gray-200">
              <tr>
                <th className="py-6">POST</th>
                <th className="py-6">Status</th>
                <th className="py-6">AUTHOR</th>
                <th className="py-6">VIEWS</th>
                <th className="py-6">DATE</th>
                <th className="py-6 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {posts.map((post, i) => (
                <tr key={i} className="border-b border-gray-200 last:border-none">
                  {/* POST COLUMN */}
                  <td className="py-6">
                    <div className="flex items-center gap-3">
                      <Image
                        src={post.image}
                        width={60}
                        height={40}
                        alt="thumb"
                        className="rounded-md"
                      />

                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-xs text-gray-400">{post.slug}</p>
                      </div>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="py-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusStyle[post.status]
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>

                  {/* AUTHOR */}
                  <td className="py-6">{post.author}</td>

                  {/* VIEWS */}
                  <td className="py-6">{post.views}</td>

                  {/* DATE */}
                  <td className="py-6 text-xs text-gray-500">{post.date}</td>

                  {/* ACTION */}
                  <td className="py-6">
                    <div className="flex items-center justify-center gap-3 text-lg">
                      <FiEdit3 className="text-indigo-600 cursor-pointer hover:text-indigo-800" />
                      <FiEye className="text-green-600 cursor-pointer hover:text-green-800" />
                      <FiTrash2 className="text-red-500 cursor-pointer hover:text-red-700" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
