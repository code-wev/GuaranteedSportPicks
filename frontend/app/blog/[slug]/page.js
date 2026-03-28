"use client";

import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import { MdOutlineShare, MdBookmarkBorder } from "react-icons/md";
import { FaXTwitter } from "react-icons/fa6";
import { GrLinkedinOption } from "react-icons/gr";
import RelatedArticles from "@/components/BlogDetails/RelatedArticles";
import { useGetArticleBySlugQuery } from "@/feature/ArticleApi";
import "../blog.css";

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

export default function BlogDetails({ params }) {
  const { slug } = params;
  const { data, isLoading, isError } = useGetArticleBySlugQuery(slug);

  if (isLoading) return <div className="text-center p-20 min-h-screen">Loading article...</div>;
  if (isError || !data?.status) return <div className="text-center p-20 min-h-screen">Article not found.</div>;

  const article = data.data;
  const safeImageSrc = getSafeImageSrc(article.image);

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#F9FAFB] border-b border-gray-100">
        <p className="text-sm text-gray-500 max-w-7xl mx-auto py-4 px-4">
          Home / Blog / <span className="text-[#B91C1C] font-medium">{article.category}</span>
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 md:py-16">
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {/* Category Badge */}
          <span className="px-3 py-1.5 bg-[#B91C1C] text-white text-xs rounded-md font-bold uppercase tracking-wider">
            {article.category}
          </span>
          <p className="flex items-center gap-1 text-gray-500 text-sm font-medium">
            <GoDotFill className="text-gray-300" />
            {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-8 text-gray-900">
          {article.title}
        </h1>

        {/* Meta Row */}
        <div className="flex items-center justify-between border-y border-gray-100 py-6 mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#B91C1C] rounded-full flex items-center justify-center text-white font-bold text-xl">
              {article.author?.firstName?.charAt(0) || "E"}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {article.author ? `${article.author.firstName} ${article.author.lastName}` : "Expert Team"}
              </h3>
              <p className="text-gray-500 text-sm font-medium">Senior Analyst</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-500">
            <button className="flex items-center gap-2 hover:text-[#B91C1C] transition-colors font-medium text-sm">
              <MdOutlineShare className="text-xl" /> Share
            </button>
            <button className="flex items-center gap-2 hover:text-[#B91C1C] transition-colors font-medium text-sm">
              <MdBookmarkBorder className="text-xl" /> Save
            </button>
          </div>
        </div>

        {/* Banner Image */}
        {safeImageSrc && (
          <div className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden mb-12 shadow-xl">
            <Image
              src={safeImageSrc}
              fill
              alt={article.title}
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <article className="quill-content mb-12">
          <div 
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />
        </article>

        {/* Author Box */}
        <div className="mt-16 p-8 rounded-2xl border border-gray-100 bg-gray-50 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
          <div className="w-20 h-20 bg-[#B91C1C] rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
            {article.author?.firstName?.charAt(0) || "E"}
          </div>
          <div className="flex-grow">
            <h3 className="font-bold text-2xl text-gray-900 mb-2">
              {article.author ? `${article.author.firstName} ${article.author.lastName}` : "Expert Team"}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our expert analysts provide the most in-depth sports betting insights, 
              leveraging years of experience and advanced data metrics to give you 
              the winning edge in every game.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 text-gray-400">
              <FaXTwitter className="text-xl hover:text-black cursor-pointer transition-colors" />
              <GrLinkedinOption className="text-xl hover:text-[#0077b5] cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 border-t border-gray-100">
        <RelatedArticles currentCategory={article.category} excludeId={article._id} />
      </div>
    </div>
  );
}
