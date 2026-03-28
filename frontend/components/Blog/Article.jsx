"use client";

import { useGetAllArticlesQuery } from "@/feature/ArticleApi";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GoDotFill } from "react-icons/go";

const CATEGORIES = [
  "All",
  "NFL",
  "NBA",
  "MLB",
  "NHL",
  "Soccer",
  "Tennis",
  "UFC",
  "Other",
];

const getSafeImageSrc = (src) => {
  if (!src || typeof src !== "string") return null;
  const trimmedSrc = src.trim();
  if (!trimmedSrc) return null;
  if (trimmedSrc.startsWith("/")) return trimmedSrc;

  try {
    return new URL(trimmedSrc).toString();
  } catch {
    return null;
  }
};

export default function Article() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAllArticlesQuery({
    page,
    limit: page * 6,
    category: activeCategory === "All" ? undefined : activeCategory,
    isActive: "true",
  });

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const stripHtml = (html) => {
    if (typeof window === "undefined") return html;
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const allArticles = data?.data || [];
  const featuredArticle = allArticles[0];
  const remainingArticles = allArticles.slice(1);
  const featuredImage = getSafeImageSrc(featuredArticle?.image);

  if (isLoading && page === 1)
    return <div className='text-center p-20'>Loading articles...</div>;

  return (
    <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 my-20'>
      <div className='md:col-span-2 space-y-8'>
        <h2 className='text-4xl font-semibold'>
          {activeCategory === "All"
            ? "Featured Articles"
            : `${activeCategory} Articles`}
        </h2>

        {featuredArticle && (
          <div className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100'>
            <div className='relative w-full h-80 bg-gray-100'>
              {featuredImage ? (
                <Image
                  src={featuredImage}
                  alt={featuredArticle.title}
                  fill
                  className='object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-4xl font-bold text-gray-300'>
                  {featuredArticle.category}
                </div>
              )}
            </div>

            <div className='p-6 space-y-4'>
              <div className='flex items-center gap-3 text-xs text-gray-500'>
                <span className='bg-[#B91C1C] text-white px-3 py-1 rounded'>
                  {featuredArticle.category}
                </span>
                <p className='flex items-center gap-1'>
                  <GoDotFill className='text-gray-400' />
                  {new Date(featuredArticle.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                </p>
              </div>

              <Link href={`/blog/${featuredArticle.slug}`}>
                <h3 className='text-3xl font-bold hover:text-[#B91C1C] transition-colors cursor-pointer line-clamp-2'>
                  {featuredArticle.title}
                </h3>
              </Link>

              <p className='text-gray-600 text-base line-clamp-3'>
                {stripHtml(featuredArticle.content)}
              </p>

              <p className='text-lg text-gray-800 font-medium'>
                By{" "}
                {featuredArticle.author
                  ? `${featuredArticle.author.firstName} ${featuredArticle.author.lastName}`
                  : "Expert Team"}
              </p>
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {remainingArticles.map((article) => {
            const safeImageSrc = getSafeImageSrc(article.image);

            return (
              <div
                key={article._id}
                className='bg-white rounded-xl shadow-md border border-gray-50 overflow-hidden flex flex-col'>
                <div className='relative w-full h-52 bg-gray-100'>
                  {safeImageSrc ? (
                    <Image
                      src={safeImageSrc}
                      alt={article.title}
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-2xl font-bold text-gray-200'>
                      {article.category}
                    </div>
                  )}
                </div>
                <div className='p-4 flex flex-col flex-grow space-y-3'>
                  <div className='flex items-center gap-2 text-xs text-gray-500'>
                    <span className='bg-[#B91C1C] text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold'>
                      {article.category}
                    </span>
                    <p className='flex items-center'>
                      <GoDotFill className='text-gray-400' />
                      {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <Link href={`/blog/${article.slug}`}>
                    <h4 className='font-bold text-xl hover:text-[#B91C1C] transition-colors cursor-pointer line-clamp-2'>
                      {article.title}
                    </h4>
                  </Link>

                  <p className='text-sm text-gray-600 line-clamp-2 flex-grow'>
                    {stripHtml(article.content)}
                  </p>

                  <p className='text-base font-medium'>
                    By{" "}
                    {article.author
                      ? `${article.author.firstName} ${article.author.lastName}`
                      : "Expert Team"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {data?.meta && data.meta.page < data.meta.totalPages && (
          <div className='flex items-center justify-center gap-4 py-8'>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className='bg-[#B91C1C] hover:bg-red-800 transition-colors text-white px-8 py-3 rounded-md text-sm font-bold shadow-lg'>
              {isLoading ? "Loading..." : "Load More Articles"}
            </button>
          </div>
        )}

        {allArticles.length === 0 && !isLoading && (
          <div className='text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200'>
            <p className='text-gray-500 text-lg'>
              No articles found in this category.
            </p>
          </div>
        )}
      </div>

      <div className='space-y-6'>
        <div className='bg-white p-6 shadow-lg rounded-xl border border-gray-50'>
          <h4 className='font-bold mb-4 text-xl border-b pb-2'>Categories</h4>
          <ul className='space-y-1 text-sm text-gray-700 font-medium'>
            {CATEGORIES.map((cat) => (
              <li
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`cursor-pointer py-2 rounded-lg px-3 transition-all ${
                  activeCategory === cat
                    ? "bg-[#B91C1C] text-white shadow-md transform scale-[1.02]"
                    : "hover:bg-red-50 hover:text-[#B91C1C]"
                }`}>
                {cat}
              </li>
            ))}
          </ul>
        </div>

        <div className='bg-[#1a1a1a] p-6 shadow-lg rounded-xl text-white'>
          <h4 className='font-bold mb-2 text-xl'>Stay Updated</h4>
          <p className='text-sm text-gray-400 mb-4'>
            Get the latest sports analysis and winning picks delivered to your
            inbox.
          </p>
          <div className='space-y-3'>
            <input
              type='email'
              placeholder='Enter your email'
              className='w-full bg-[#333] border-none px-4 py-3 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#B91C1C] outline-none'
            />
            <button className='w-full bg-[#B91C1C] hover:bg-red-700 transition-colors text-white py-3 rounded-lg text-sm font-bold uppercase tracking-wider'>
              Subscribe Now
            </button>
          </div>
        </div>

        <RecentArticlesList />
      </div>
    </div>
  );
}

function RecentArticlesList() {
  const { data } = useGetAllArticlesQuery({ limit: 5, isActive: "true" });

  if (!data?.data?.length) return null;

  return (
    <div className='bg-white p-6 shadow-lg rounded-xl border border-gray-50'>
      <h4 className='font-bold mb-4 text-xl border-b pb-2'>Recent Articles</h4>
      <div className='flex flex-col gap-4'>
        {data.data.map((article) => {
          const safeImageSrc = getSafeImageSrc(article.image);

          return (
            <Link
              key={article._id}
              href={`/blog/${article.slug}`}
              className='flex items-start gap-3 group'>
              <div className='relative w-20 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0'>
                {safeImageSrc ? (
                  <Image
                    src={safeImageSrc}
                    alt={article.title}
                    fill
                    className='object-cover group-hover:scale-110 transition-transform duration-300'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-[8px] font-bold text-gray-300'>
                    {article.category}
                  </div>
                )}
              </div>
              <div className='text-xs space-y-1'>
                <p className='font-bold group-hover:text-[#B91C1C] transition-colors line-clamp-2'>
                  {article.title}
                </p>
                <p className='text-gray-400 font-medium'>
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
