"use client";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { useGetAllArticlesQuery } from "@/feature/ArticleApi";
import Link from "next/link";

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

const RelatedArticles = ({ currentCategory, excludeId }) => {
  const { data, isLoading } = useGetAllArticlesQuery({
    category: currentCategory,
    limit: 4,
    isActive: "true"
  });

  const filteredArticles = data?.data?.filter(a => a._id !== excludeId).slice(0, 3) || [];

  const stripHtml = (html) => {
    if (typeof window === 'undefined') return html;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  if (isLoading) return <div className="py-20 text-center">Loading related articles...</div>;
  if (filteredArticles.length === 0) return null;

  return (
    <section className="py-16 bg-[#f9fafb]">
      <h2 className="text-center text-4xl font-bold text-gray-900 mb-12">
        Related Articles
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {filteredArticles.map((article) => {
          const safeImageSrc = getSafeImageSrc(article.image);

          return (
          <div key={article._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
            {/* IMAGE */}
            <div className="relative w-full h-56 bg-gray-100 rounded-t-2xl overflow-hidden">
              {safeImageSrc ? (
                <Image
                  src={safeImageSrc}
                  alt={article.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-200">
                  {article.category}
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-[#B91C1C] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  {article.category}
                </span>
                <p className="text-[10px] flex items-center gap-1 text-gray-400 font-bold uppercase">
                  <GoDotFill className="text-gray-300" />
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>
              </div>

              <Link href={`/blog/${article.slug}`}>
                <h3 className="font-bold text-gray-900 mb-3 leading-tight hover:text-[#B91C1C] transition-colors line-clamp-2 text-xl">
                  {article.title}
                </h3>
              </Link>

              <p className="text-gray-600 text-sm mb-6 line-clamp-2 flex-grow">
                {stripHtml(article.content)}
              </p>

              <p className="text-gray-900 text-sm font-bold border-t pt-4">
                By {article.author ? `${article.author.firstName} ${article.author.lastName}` : "Expert Team"}
              </p>
            </div>
          </div>
        )})}
      </div>

      <div className="text-center mt-12">
        <Link href="/blog" className="inline-flex items-center gap-2 bg-white text-[#B91C1C] border-2 border-[#B91C1C] px-8 py-3 rounded-xl font-bold hover:bg-[#B91C1C] hover:text-white transition-all duration-300">
          View All Articles
          <FaArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
};

export default RelatedArticles;
