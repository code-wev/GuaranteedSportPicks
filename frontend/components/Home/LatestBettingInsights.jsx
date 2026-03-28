"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetAllArticlesQuery } from "@/feature/ArticleApi";

function getSafeImageSrc(src) {
  if (!src || typeof src !== "string") {
    return null;
  }

  const trimmedSrc = src.trim();
  if (!trimmedSrc) {
    return null;
  }

  if (trimmedSrc.startsWith("/")) {
    return trimmedSrc;
  }

  try {
    return new URL(trimmedSrc).toString();
  } catch {
    return null;
  }
}

function stripHtml(html) {
  if (typeof window === "undefined") {
    return html?.replace(/<[^>]*>/g, "") || "";
  }

  const doc = new DOMParser().parseFromString(html || "", "text/html");
  return doc.body.textContent || "";
}

export default function LatestBettingInsights() {
  const { data, isLoading } = useGetAllArticlesQuery({
    page: 1,
    limit: 3,
    isActive: "true",
  });

  const articles = data?.data || [];

  return (
    <section
      className="relative w-full bg-white bg-cover bg-center bg-no-repeat py-16 md:py-20 overflow-hidden"
      style={{ backgroundImage: "url('/home/LatestBetting/BgImg.png')" }}
    >
      <div className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#fce9e9] blur-3xl opacity-70" />
      <div className="pointer-events-none absolute top-[38%] -left-24 w-[360px] h-[360px] rounded-full bg-[#f7eeee] blur-3xl opacity-80" />

      <div className="max-w-[1100px] mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-[28px] md:text-[40px] font-bold text-[#111] tracking-[-0.02em]">
            Latest Betting Insights
          </h2>
          <p className="mt-2 text-[13px] md:text-[14px] text-[#6f6f6f]">
            Stay ahead of the game with our expert analysis, strategies, and market insights
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-[18px] bg-white border border-[#00000012] h-[380px] animate-pulse" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white/80 p-12 text-center text-gray-500">
            No articles available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
            {articles.map((article, index) => (
              <ArticleCard
                key={article._id}
                img={article.image}
                title={article.title}
                excerpt={stripHtml(article.content)}
                date={new Date(article.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                read={`${Math.max(3, Math.ceil(stripHtml(article.content).split(" ").length / 200))} min read`}
                slug={article.slug}
                gradient={
                  index === 1
                    ? "from-[#37d1ff] via-[#2fc6ff] to-[#0ea5e9]"
                    : "from-[#ff6a6a] via-[#ff6a6a] to-[#ff6a6a]"
                }
              />
            ))}
          </div>
        )}

        <div className="mt-16 md:mt-20 flex justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center h-[44px] px-6 rounded-full bg-[#E63946] text-white text-[14px] font-semibold shadow-[0_12px_28px_rgba(230,57,70,0.35)] hover:bg-[#d23340] transition"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}

function ArticleCard({
  img,
  title,
  excerpt,
  date,
  read,
  slug,
  gradient = "from-[#ff6a6a] via-[#ff6a6a] to-[#ff6a6a]",
}) {
  const safeImageSrc = getSafeImageSrc(img);

  return (
    <article className="group rounded-[18px] bg-white border border-[#00000012] shadow-[0_14px_36px_rgba(0,0,0,0.08)] overflow-hidden">
      <div className="relative w-full h-[180px] bg-gray-100">
        {safeImageSrc ? (
          <Image
            src={safeImageSrc}
            alt={title}
            fill
            priority={false}
            className="object-cover rounded-t-[18px] transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg font-semibold">
            Article
          </div>
        )}
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${gradient} opacity-0 group-hover:opacity-[0.06] transition`}
        />
      </div>

      <div className="px-4 pt-4 pb-4">
        <Link href={`/blog/${slug}`}>
          <h3 className="text-[14px] font-semibold leading-snug text-[#E63946] hover:underline cursor-pointer line-clamp-2">
            {title}
          </h3>
        </Link>

        <p className="mt-2 text-[13px] leading-relaxed text-[#6b6b6b] line-clamp-3">
          {excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between text-[12px] text-[#9a9a9a]">
          <span>{date}</span>
          <span>{read}</span>
        </div>

        <Link
          href={`/blog/${slug}`}
          className="inline-flex items-center justify-center mt-4 px-5 h-[36px] rounded-[8px] bg-[#B91C1C] text-white text-[13px] font-semibold hover:bg-[#cf2f3b] transition"
        >
          Read more
        </Link>
      </div>
    </article>
  );
}
