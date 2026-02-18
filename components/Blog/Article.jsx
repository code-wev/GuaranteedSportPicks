"use client";
import Image from "next/image";
import { useState } from "react";
import { GoDotFill } from "react-icons/go";
export default function Article() {
  const [active, setActive] = useState("All");

  const categories = [
    "All",
    "NFL Analysis",
    "NBA Insights",
    "MLB Predictions",
    "NHL Coverage",
    "Soccer Strategy",
    "Industry News",
  ];
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 mt-20">
      {/* LEFT SECTION */}
      <div className="md:col-span-2 space-y-8">
        <h2 className="text-4xl font-semibold">Featured Article</h2>

        {/* Large Featured Card */}
        <div className="bg-white rounded-xl shadow py-10 overflow-hidden">
          <Image
            src="/blog/nfl.png"
            alt="Featured Image"
            width={800}
            height={500}
            className="w-full h-64 object-center rounded-lg"
          />

          <div className="mt-4 space-y-2 ml-4">
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
              <span className="bg-[#B91C1C] text-white px-3 py-1 rounded">
                NFL Analysis
              </span>
              <p className="flex items-center gap-1">
                <GoDotFill className="text-gray-400" />
                November 12, 2025
              </p>
              <p className="flex items-center gap-1">
                <GoDotFill className="text-gray-400" />5 min read
              </p>
            </div>

            <h3 className="text-2xl font-semibold">
              NFL Week 15 Power Rankings: Chiefs Maintain Top Spot Despite Close
              Calls
            </h3>
            <p className="text-gray-600 text-base">
              Breaking down the latest NFL power rankings as we head into the
              final stretch of the regular season. The Kansas City Chiefs
              continue to lead despite some nail-biting victories.
            </p>
            <p className="text-lg text-gray-700">By Mike Rodriguez</p>
          </div>
        </div>

        {/* Grid of 4 smaller cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CARD 1 */}
          <div className="bg-white rounded-xl shadow-md">
            <Image
              src="/blog/nba.png"
              alt="Card Image"
              width={400}
              height={300}
              className="w-full  h-[220px] object-cover rounded-t-xl"
            />
            <div className="mt-3 space-y-1 pb-6 p-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="bg-[#B91C1C] text-white px-3 py-1 rounded-md">
                  MLB Predictions
                </span>
                <div className="flex items-center text-xs gap-1">
                  <p className="flex items-center">
                    <GoDotFill className="text-gray-400" />
                    November 12, 2025
                  </p>
                  <p className="flex items-center">
                    <GoDotFill className="text-gray-400" />5 min read
                  </p>
                </div>
              </div>
              <h4 className="font-semibold text-xl">
                NBA MVP Race Heats Up: Analyzing the Top Contenders at
                Mid-Season
              </h4>
              <p className="text-xs text-gray-600">
                With the NBA season hitting its stride, we examine the leading
                MVP candidates and their statistical dominance. From Nikola
                Jokic to Jayson Tatum, who has the edge?
              </p>
              <p className="text-lg">By Sarah Chen</p>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="bg-white rounded-xl shadow-md">
            <Image
              src="/blog/mlb.png"
              alt="Card Image"
              width={400}
              height={300}
              className="w-full  h-[220px] object-cover rounded-t-xl"
            />
            <div className="mt-3 space-y-1 pb-6 p-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="bg-[#B91C1C] text-white px-3 py-1 rounded">
                  MLB Predictions
                </span>
                <div className="flex items-center text-xs gap-1">
                  <p className="flex items-center">
                    <GoDotFill className="text-gray-400" />
                    November 12, 2025
                  </p>
                  <p className="flex items-center">
                    <GoDotFill className="text-gray-400" />5 min read
                  </p>
                </div>
              </div>
              <h4 className="font-semibold text-xl">
                MLB Winter Meetings Recap: Biggest Signings and Trade Impact
                Analysis
              </h4>
              <p className="text-xs text-gray-600">
                The MLB winter meetings delivered blockbuster moves that will
                reshape the 2025 season. We analyze the signings and their
                impact on championship odds.
              </p>
              <p className="text-lg">By Alex Martinez</p>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="bg-white rounded-xl shadow-md">
            <Image
              src="/blog/nhl.png"
              alt="Card Image"
              width={400}
              height={300}
              className="w-full  h-[220px] object-cover rounded-t-xl"
            />
            <div className="mt-3 space-y-1 pb-6 p-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="bg-[#B91C1C] text-white px-3 py-1 rounded">
                  NHL Coverage
                </span>
                <div className="flex items-center text-xs gap-1">
                  <p className="flex items-center">
                    <GoDotFill className="text-gray-400" />
                    November 12, 2025
                  </p>
                  <p className="flex items-center">
                    <GoDotFill className="text-gray-400" />5 min read
                  </p>
                </div>
              </div>
              <h4 className="font-semibold text-xl">
                NHL Stanley Cup Odds Update: Dark Horse Teams to Watch
              </h4>
              <p className="text-xs text-gray-600">
                While the usual suspects lead the Stanley Cup odds, several dark
                horse teams are making compelling cases. We identify the sleeper
                picks worth backing.
              </p>
              <p className="text-lg">By Jennifer Walsh</p>
            </div>
          </div>
          {/* CARD 4 */}
          <div className="bg-white rounded-xl shadow-md">
            <Image
              src="/blog/articlebuilding.png"
              alt="Card Image"
              width={400}
              height={300}
              className="w-full  h-[220px] object-cover rounded-t-xl"
            />
            <div className="mt-3 space-y-1 pb-6 p-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="bg-[#B91C1C] text-white px-3 py-1 rounded">
                  Industry News
                </span>
                <div className="flex items-center text-xs gap-1">
                  <p className="flex items-center">
                    <GoDotFill className="text-gray-400" />
                    November 12, 2025
                  </p>
                  <p className="flex items-center">
                    <GoDotFill className="text-gray-400" />5 min read
                  </p>
                </div>
              </div>
              <h4 className="font-semibold text-xl">
                Sports Betting Regulation Update: New State Laws and Their
                Impact
              </h4>
              <p className="text-xs text-gray-600">
                Recent changes in sports betting legislation across multiple
                states are reshaping the industry landscape. Here’s need to know
                about the new regulations.
              </p>
              <p className="text-lg">By Lisa Johnson</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 mb-8">
          <button className="bg-[#B91C1C] text-white px-6 py-3 rounded-md text-sm shadow">
            Load More Articles
          </button>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="space-y-6">
        {/* Categories */}
        <div className="bg-white p-5 shadow-md rounded-xl">
          <h4 className="font-semibold mb-4 text-xl">Categories</h4>

          <ul className="space-y-2 text-sm text-gray-700">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => setActive(cat)}
                className={`
              cursor-pointer py-1 rounded px-2 transition 
              ${
                active === cat
                  ? "bg-[#B91C1C] text-white font-medium"
                  : "hover:bg-red-100 hover:text-red-600"
              }
            `}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="bg-white p-5 shadow-md rounded-xl">
          <h4 className="font-semibold mb-2">Stay Updated</h4>
          <p className="text-xs text-gray-600 mb-3">
            Get the latest analysis and picks delivered to your inbox.
          </p>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-gray-300 px-3 py-2 rounded mb-2 text-sm"
          />
          <button className="w-full bg-[#B91C1C] text-white py-2 rounded-lg text-sm font-medium">
            Subscribe Now
          </button>
        </div>

        {/* Recent Articles */}
        <div className="bg-white p-5 shadow rounded-xl">
          <h4 className="font-semibold mb-3">Recent Articles</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <div>
                <Image
                  src="/blog/recent.png"
                  alt="Card Image"
                  width={400}
                  height={300}
                  className="w-[97px] h-[50px] object-cover rounded"
                />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-medium">
                  NFL Week 15 Power Rankings: Chiefs Maintain Top Spot Despite
                  Close Calls
                </p>
                <p className="text-gray-500">November 12, 2025</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div>
                <Image
                  src="/blog/recent.png"
                  alt="Card Image"
                  width={400}
                  height={300}
                  className="w-[97px] h-[50px] object-cover rounded"
                />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-medium">
                  NBA MVP Race Heats Up: Analyzing the Top Contenders at
                  Mid-Season
                </p>
                <p className="text-gray-500">November 12, 2025</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div>
                <Image
                  src="/blog/recent.png"
                  alt="Card Image"
                  width={400}
                  height={300}
                  className="w-[97px] h-[50px] object-cover rounded"
                />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-medium">
                  Advanced Betting Strategies: Understanding Line Movement and
                  Market
                </p>
                <p className="text-gray-500">November 12, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
