"use client";

import Image from "next/image";

const picks = [
  {
    id: 1,
    leagueLogo: "/sportsPicks/p1.png", // put your NFL logo here
    time: "8:20 PM ET",
    teamA: "Kansas City Chiefs",
    teamB: "Buffalo Bills",
    confidence: "High",
    topPick: true,
  },
  {
    id: 2,
    leagueLogo: "/sportsPicks/p2.png", // put your icon here
    time: "12:20 PM ET",
    teamA: "Kansas City Chiefs",
    teamB: "Buffalo Bills",
    confidence: "Medium",
    topPick: false,
  },
  {
    id: 3,
    leagueLogo: "/sportsPicks/p3.png", // put your NBA logo here
    time: "10:00 PM ET",
    teamA: "Kansas City Chiefs",
    teamB: "Buffalo Bills",
    confidence: "Medium",
    topPick: false,
  },
  {
    id: 4,
    leagueLogo: "/sportsPicks/p4.png", // put your icon here
    time: "9:00 PM ET",
    teamA: "Kansas City Chiefs",
    teamB: "Buffalo Bills",
    confidence: "High",
    topPick: false,
  },
];

function ConfidencePill({ level }) {
  const isHigh = level === "High";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium",
        isHigh ? "bg-[#DFF4E9] text-[#0F7A4D]" : "bg-[#FFF2CC] text-[#B7791F]",
      ].join(" ")}
    >
      {isHigh ? "High Confidence" : "Medium Confidence"}
    </span>
  );
}

function VsDot() {
  return (
    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#E11D2E] text-white text-[9px] font-bold leading-none">
      VS
    </span>
  );
}

export default function GetSportsPicks() {
  return (
    <section className="w-full bg-[#FFF3F3] py-12">
      <div className="max-w-[1350px] mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          {/* Title */}
          <h2 className="text-[32px] font-bold text-[#111827] mb-2">
            Get Sports Picks
          </h2>

          {/* Subtitle */}
          <p className="text-[15px] text-[#6B7280] mb-6">
            Carefully analyzed selections from our professional handicappers
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-8 text-[#111827]">
            {/* Item 1 */}
            <div className="flex items-center gap-3">
              <span className="text-[14px]">▶</span>
              <span className="text-[22px] font-bold">85%</span>
              <span className="text-[15px] text-[#374151]">
                Recent Win Rate
              </span>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-3">
              <span className="text-[14px]">▶</span>
              <span className="text-[22px] font-bold">6</span>
              <span className="text-[15px] text-[#374151]">
                Free Picks Today
              </span>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-3">
              <span className="text-[14px]">▶</span>
              <span className="text-[22px] font-bold">24/7</span>
              <span className="text-[15px] text-[#374151]">Expert Support</span>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {picks.map((p) => (
            <div
              key={p.id}
              className="
        group relative rounded-[14px]
        bg-white
        border border-[#F3F4F6]
        shadow-[0_6px_18px_rgba(17,24,39,0.06)]
        transition-all duration-300 ease-out
        hover:-translate-y-[2px]
        hover:shadow-[0_14px_32px_rgba(17,24,39,0.12)]
        overflow-hidden
      "
            >
              {/* PERFECTLY ROUNDED LEFT ACCENT */}
              <div
                className="
          absolute left-0 top-0 h-full w-[4px]
          bg-[#E11D2E]
          rounded-r-[14px]
          scale-y-0
          origin-top
          transition-transform duration-300 ease-out
          group-hover:scale-y-100
        "
              />

              {/* CONTENT */}
              <div className="px-5 py-4">
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center">
                      <Image
                        src={p.leagueLogo}
                        alt="League"
                        width={26}
                        height={26}
                        className="object-contain"
                      />
                    </div>
            
                  </div>

                  <span className="text-[10px] text-[#9CA3AF]">{p.time}</span>
                </div>

                {/* Match row */}
                <div className="flex items-center gap-2 text-[12px] text-[#111827]">
                  <span className="font-medium">{p.teamA}</span>
                  <VsDot />
                  <span className="font-medium">{p.teamB}</span>
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between mt-4">
                  <ConfidencePill level={p.confidence} />
                  {p.topPick && (
                    <span className="text-[9px] font-semibold px-2 py-[3px] rounded-full bg-[#FFE94A] text-[#111827]">
                      Top Pick
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-center mt-8">
          <button className="bg-[#B91C1C] hover:bg-[#991B1B] text-white font-semibold text-[12px] px-12 py-3 rounded-[6px] transition">
            Get Picks
          </button>
        </div>
      </div>
    </section>
  );
}
