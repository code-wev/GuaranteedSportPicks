"use client";

import Image from "next/image";

export default function LatestBettingInsights() {
  return (
    <section className="relative w-full bg-white bg-cover bg-center bg-no-repeat py-16 md:py-20 overflow-hidden"
      style={{ backgroundImage: "url('/home/LatestBetting/BgImg.png')" }}>
   
      {/* soft decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#fce9e9] blur-3xl opacity-70" />
      <div className="pointer-events-none absolute top-[38%] -left-24 w-[360px] h-[360px] rounded-full bg-[#f7eeee] blur-3xl opacity-80" />

      <div className="max-w-[1100px] mx-auto px-4 md:px-6">
        {/* Heading */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-[28px] md:text-[40px] font-bold text-[#111] tracking-[-0.02em]">
            Latest Betting Insights
          </h2>
          <p className="mt-2 text-[13px] md:text-[14px] text-[#6f6f6f]">
            Stay ahead of the game with our expert analysis, strategies, and market insights
          </p>
        </div>

        {/* Cards grid with staggered offsets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
          {/* Card 1 - top aligned */}
          <div className="">
            <ArticleCard
              img="/home/LatestBetting/img1.jpg"
              title="NBA Playoffs Betting Guide: Expert Strategies for Maximum Profits"
              excerpt="Discover the insider secrets our analysts use to consistently profit during the most exciting time of the basketball season."
              date="March 15, 2024"
              read="8 min read"
            />
          </div>

          {/* Card 2 - slightly lower */}
          <div className="">
            <ArticleCard
              img="/home/LatestBetting/img2.jpg"
              title="NBA Playoffs Betting Guide: Expert Strategies for Maximum Profits"
              excerpt="Discover the insider secrets our analysts use to consistently profit during the most exciting time of the basketball season."
              date="March 15, 2024"
              read="8 min read"
              gradient="from-[#37d1ff] via-[#2fc6ff] to-[#0ea5e9]"
            />
          </div>

          {/* Card 3 - more lower */}
          <div className="">
            <ArticleCard
              img="/home/LatestBetting/img3.jpg"
              title="NBA Playoffs Betting Guide: Expert Strategies for Maximum Profits"
              excerpt="Discover the insider secrets our analysts use to consistently profit during the most exciting time of the basketball season."
              date="March 15, 2024"
              read="8 min read"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 md:mt-20 flex justify-center">
          <button className="inline-flex items-center justify-center h-[44px] px-6 rounded-full bg-[#E63946] text-white text-[14px] font-semibold shadow-[0_12px_28px_rgba(230,57,70,0.35)] hover:bg-[#d23340] transition">
            View All Partners
          </button>
        </div>
      </div>
    </section>
  );
}

/* ----------------- subcomponent ----------------- */
function ArticleCard({
  img,
  title,
  excerpt,
  date,
  read,
  gradient = "from-[#ff6a6a] via-[#ff6a6a] to-[#ff6a6a]",
}) {
  return (
    <article className="group rounded-[18px] bg-white border border-[#00000012] shadow-[0_14px_36px_rgba(0,0,0,0.08)] overflow-hidden">
      {/* image section fills perfectly */}
      <div className="relative w-full h-[180px]">
        <Image
          src={img}
          alt={title}
          fill
          priority={false}
          className="object-cover rounded-t-[18px] transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${gradient} opacity-0 group-hover:opacity-[0.06] transition`}
        />
      </div>

      {/* body */}
      <div className="px-4 pt-4 pb-4">
        <h3 className="text-[14px] font-semibold leading-snug">
          <span className="text-[#E63946] hover:underline cursor-pointer">
            {title}
          </span>
        </h3>

        <p className="mt-2 text-[13px] leading-relaxed text-[#6b6b6b]">
          {excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between text-[12px] text-[#9a9a9a]">
          <span>{date}</span>
          <span>{read}</span>
        </div>

        <button
          className="
            mt-4 px-5
            h-[36px]
            rounded-[8px]
            bg-[#B91C1C]
            text-white
            text-[13px]
            font-semibold
            hover:bg-[#cf2f3b]
            transition
          "
        >
          Read more
        </button>
      </div>
    </article>
  );
}
