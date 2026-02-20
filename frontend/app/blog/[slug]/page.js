"use client";

import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import { MdOutlineShare, MdBookmarkBorder } from "react-icons/md";
import { FaXTwitter } from "react-icons/fa6";
import { GrLinkedinOption } from "react-icons/gr";
import RelatedArticles from "@/components/BlogDetails/RelatedArticles";

export default function BlogDetails() {
  return (
    <div className="">
      {/* Breadcrumb */}
      <div className="bg-[#F9FAFB] h-[50px] pt-5">
        <p className="text-sm text-gray-500 max-w-7xl mx-auto mb-6 pl-4">
          Home / Blog / NFL Analysis
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2">
          {/* Category Badge */}
          <span className="px-3 py-2 bg-[#B91C1C] text-white text-xs rounded-md font-medium">
            NFL Analysis
          </span>
          <p className="flex items-center gap-1 text-gray-500">
            <GoDotFill className="" />
            November 12, 2025
          </p>
          <p className="flex items-center gap-1 text-gray-500">
            <GoDotFill className="" />5 min read
          </p>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold mt-6 mb-6">
          NFL Week 15 Power Rankings: Chiefs Maintain Top Spot Despite Close
          Calls
        </h1>

        {/* Meta Row */}
        <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Image
              src="/blogDetails/momo.png"
              width={60}
              height={60}
              alt="Author"
              className="rounded-full border"
            />
            <div>
              <h3 className="font-semibold text-2xl">Mike Rodriguez</h3>
              <p className="text-gray-600 text-xl">Sports Analyst</p>
            </div>
          </div>

          <div className="flex items-center gap-5 text-gray-600">
            <button className="flex items-center gap-1 hover:text-black">
              <MdOutlineShare className="text-xl" /> Share
            </button>

            <button className="flex items-center gap-1 hover:text-black">
              <MdBookmarkBorder className="text-xl" /> Save
            </button>
          </div>
        </div>

        {/* Banner Image */}
        <div className="w-full mt-6">
          <Image
            src="/blogDetails/details.png"
            width={1300}
            height={333}
            alt="Stadium"
            className="rounded-3xl object-cover h-[433px]"
          />
        </div>

        {/* Article Content */}
        <article className="prose lg:prose-lg mt-8 max-w-none">
          <p>
            As we enter the final stretch of the NFL regular season, teams are
            battling not only for playoff berths but also for momentum. Week 15
            delivered shake-ups, breakout performances, and tight finishes that
            forced analysts to reevaluate the hierarchy. Despite some close
            calls, the Kansas City Chiefs continue to hold the No. 1 spot, while
            several contenders are making aggressive climbs.
          </p>

          <h3 className="font-semibold mt-6">Top 5 Power Rankings</h3>

          <ol className="list-decimal pl-5">
            <li>
              <strong>Kansas City Chiefs (10–3):</strong> The Chiefs survived
              another nail-biter thanks to Patrick Mahomes’ late-game magic.
              Their defense looked shaky early but tightened up when it mattered
              most.
            </li>

            <li>
              <strong>Buffalo Bills (10–4):</strong> Josh Allen continues to
              play MVP-level football. Their offense looks explosive again, and
              the addition of more defensive blitz packages has paid off.
            </li>

            <li>
              <strong>Philadelphia Eagles (11–3):</strong> A strong ground
              attack and improved red-zone efficiency keep them firmly in the
              top tier. However, inconsistent secondary play remains a concern.
            </li>

            <li>
              <strong>San Francisco 49ers (10–4):</strong> Brock Purdy continues
              to exceed expectations. The 49ers’ offense remains one of the most
              balanced units in football, and their defensive front is heating
              up.
            </li>

            <li>
              <strong>Miami Dolphins (9–5):</strong> Miami rebounded with a
              statement win. Tua Tagovailoa and Tyreek Hill look unstoppable
              when the scheme clicks.
            </li>
          </ol>

          <h3 className="mt-6 font-semibold">Key Storylines to Watch</h3>
          <p>
            With only a few weeks remaining, playoff positioning is becoming
            more intense. The AFC is particularly crowded, with several teams
            vying for the final Wild Card spots. Meanwhile, the NFC continues to
            showcase parity, setting the stage for dramatic finishes in Weeks 16
            and 17. Injuries to key quarterbacks could also reshape the
            postseason picture.
          </p>

          <h3 className="mt-6 font-semibold">Betting Implications</h3>
          <p>
            Week 15 results revealed massive market shifts. The Chiefs remain
            favorites in most books, but the Bills and Eagles are closing the
            gap. Underdog teams with strong defensive trends — such as
            Pittsburgh and Cleveland — have become popular picks against the
            spread. Bettors should pay attention to injury reports and weather
            forecasts as outdoor games become more unpredictable in late
            December.
          </p>

          <p className="mt-6">
            As we head into Week 16, every game carries more weight. Expect
            volatility, surprising upsets, and playoff-altering moments as the
            season approaches its final chapter.
          </p>
        </article>

        {/* Tags */}
        <h1 className="text-2xl font-medium mt-8 mb-3">Tags:</h1>
        <div className="flex gap-3 flex-wrap">
          <span className="px-4 py-1 bg-gray-200 rounded text-sm">NFL</span>
          <span className="px-4 py-1 bg-gray-200 rounded text-sm">
            Power Rankings
          </span>
          <span className="px-4 py-1 bg-gray-200 rounded text-sm">Chiefs</span>
          <span className="px-4 py-1 bg-gray-200 rounded text-sm">Bills</span>
          <span className="px-4 py-1 bg-gray-200 rounded text-sm">
            Playoffs
          </span>
          <span className="px-4 py-1 bg-gray-200 rounded text-sm">
            Betting Analysis
          </span>
        </div>

        {/* Author Box */}
        <div className="mt-10 p-6 rounded-xl shadow-md flex gap-5 items-start bg-white">
          <Image
            src="/blogDetails/momo.png"
            width={70}
            height={70}
            alt="Author"
            className="rounded-full"
          />
          <div>
            <h3 className="font-semibold text-2xl">Mike Rodriguez</h3>
            <p className="text-[#475569] text-sm">
              Mike Rodriguez is a veteran sports analyst with over 15 years of
              experience covering the NFL. He specializes in advanced analytics
              and has a proven track record of identifying value in betting
              markets.
            </p>
            <div className="flex items-center mt-4 gap-2 text-[#4B556C]">
              <FaXTwitter />
              <GrLinkedinOption />
            </div>
          </div>
        </div>
      </div>
      <RelatedArticles/>
    </div>
  );
}
