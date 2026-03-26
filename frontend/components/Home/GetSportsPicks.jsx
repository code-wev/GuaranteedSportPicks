"use client";

import Link from "next/link";
import { useGetManyPicksQuery } from "@/feature/PicksApi";

function ConfidencePill({ level }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium",
        level === "high" ? "bg-[#DFF4E9] text-[#0F7A4D]" : "bg-[#FFF2CC] text-[#B7791F]",
      ].join(" ")}
    >
      {level === "high" ? "High Confidence" : "Medium Confidence"}
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
  const { data, isLoading } = useGetManyPicksQuery({
    pageNo: 1,
    showPerPage: 4,
  });

  const picks = (data?.data?.pickss || []).filter((pick) => pick.status === "active");

  return (
    <section className="w-full bg-[#FFF3F3] py-12">
      <div className="max-w-[1350px] mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-[32px] font-bold text-[#111827] mb-2">Get Sports Picks</h2>
          <p className="text-[15px] text-[#6B7280] mb-6">
            Free picks are visible now. Premium picks stay blurred until unlocked.
          </p>

          <div className="flex flex-wrap items-center gap-8 text-[#111827]">
            <div className="flex items-center gap-3">
              <span className="text-[22px] font-bold">{data?.data?.totalActivePicks || 0}</span>
              <span className="text-[15px] text-[#374151]">Active Picks</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[22px] font-bold">{picks.filter((pick) => !pick.accessLocked).length}</span>
              <span className="text-[15px] text-[#374151]">Visible Free Picks</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[22px] font-bold">PAW</span>
              <span className="text-[15px] text-[#374151]">Pay After Win Available</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-500">Loading picks...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {picks.map((pick) => (
              <div
                key={pick._id}
                className="group relative rounded-[14px] bg-white border border-[#F3F4F6] shadow-[0_6px_18px_rgba(17,24,39,0.06)] transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-[0_14px_32px_rgba(17,24,39,0.12)] overflow-hidden"
              >
                <div className="absolute left-0 top-0 h-full w-[4px] bg-[#E11D2E] rounded-r-[14px]" />

                <div className={`px-5 py-4 ${pick.accessLocked ? "blur-[4px]" : ""}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-red-600 font-bold">{pick.sport_title}</p>
                      <p className="text-[10px] text-[#9CA3AF] mt-1">
                        {new Date(pick.commence_time).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-[3px] rounded-full bg-[#FFE94A] text-[#111827]">
                      {pick.premium ? "Premium" : "Free"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[12px] text-[#111827]">
                    <span className="font-medium">{pick.away_team}</span>
                    <VsDot />
                    <span className="font-medium">{pick.home_team}</span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <ConfidencePill level={pick.confidence} />
                    <span className="text-sm font-bold text-[#B91C1C]">
                      {pick.premium ? `$${Number(pick.price).toFixed(2)}` : "Free"}
                    </span>
                  </div>
                </div>

                {pick.accessLocked && (
                  <div className="absolute inset-0 bg-white/40 flex items-center justify-center p-4">
                    <Link
                      href="/dashboard/purchase"
                      className="bg-[#B91C1C] hover:bg-[#991B1B] text-white font-semibold text-[12px] px-8 py-3 rounded-[8px] transition"
                    >
                      Unlock Pick
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Link href="/freepicks" className="bg-[#B91C1C] hover:bg-[#991B1B] text-white font-semibold text-[12px] px-12 py-3 rounded-[6px] transition">
            View Picks Board
          </Link>
        </div>
      </div>
    </section>
  );
}
