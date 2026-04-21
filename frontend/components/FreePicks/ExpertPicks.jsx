"use client";

import Link from "next/link";
import { useGetManyPicksQuery } from "@/feature/PicksApi";

export default function ExpertPicks() {
  const { data, isLoading } = useGetManyPicksQuery({
    pageNo: 1,
    showPerPage: 12,
  });

  const picks = (data?.data?.pickss || []).filter((pick) => pick.status === "active");

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold mb-3">Today&apos;s Picks Board</h1>
        <p className="text-lg text-gray-500">
          Free picks are fully visible. Premium picks stay blurred until you buy the pick or unlock it with a subscription.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-gray-500">Loading picks...</div>
      ) : picks.length === 0 ? (
        <div className="py-20 text-center text-gray-400">No active picks available right now.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {picks.map((pick) => {
            const locked = Boolean(pick.accessLocked);

            return (
              <div
                key={pick._id}
                className="relative bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-red-600 font-bold">
                        {pick.sport_title}
                      </p>
                      <h2 className="text-2xl font-semibold leading-snug mt-2">
                        {pick.away_team}{" "}
                        <span className="text-[#B91C1C]">VS</span>{" "}
                        {pick.home_team}
                      </h2>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        pick.confidence === "high"
                          ? "bg-green-100 text-green-700"
                          : pick.confidence === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {pick.confidence}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-gray-400">Start</p>
                      <p className="font-semibold text-gray-800">{new Date(pick.commence_time).toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-gray-400">Price</p>
                      <p className="font-semibold text-gray-800">
                        {pick.premium ? `$${Number(pick.price).toFixed(2)}` : "Free"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-gray-400">Pick</p>
                      {locked ? (
                        <div className="h-5 mt-1 rounded bg-gray-200 blur-[2px]" />
                      ) : (
                        <p className="font-semibold text-gray-800">{pick.selected_team}</p>
                      )}
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-gray-400">Market</p>
                      <p className="font-semibold text-gray-800 capitalize">{pick.market_type}</p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#F9FAFB] border border-gray-100 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-400 font-bold mb-2">Writeup</p>
                    {locked ? (
                      <div className="space-y-2">
                        <div className="h-4 rounded bg-gray-200 blur-[2px]" />
                        <div className="h-4 rounded bg-gray-200 blur-[2px]" />
                        <div className="h-4 w-2/3 rounded bg-gray-200 blur-[2px]" />
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 leading-6">{pick.writeup}</p>
                    )}
                  </div>
                </div>

                {locked && (
                  <div className="absolute bottom-6 left-6 right-6 flex flex-col items-center justify-center bg-white/85 border border-red-100 rounded-2xl p-6 text-center shadow-sm">
                    <span className="px-3 py-1 rounded-full bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-[0.2em]">
                      Premium Pick
                    </span>
                    <p className="mt-4 text-sm font-medium text-gray-700">
                      Buy this pick with prepaid or Pay After Win, or unlock all picks from this sport with a subscription.
                    </p>
                    <Link
                      href="/dashboard/purchase"
                      className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#B91C1C] px-5 py-3 text-sm font-semibold text-white hover:bg-red-800 transition"
                    >
                      Unlock Picks
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
