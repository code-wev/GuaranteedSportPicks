"use client";

import Link from "next/link";
import { useGetMyAccessiblePicksQuery } from "@/feature/PicksApi";

export default function ActivePickCard() {
  const { data, isLoading } = useGetMyAccessiblePicksQuery();
  const picks = (data?.data || []).filter((pick) => !pick.result).slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-xl">Unlocked Picks</h3>
        <Link href="/dashboard/my-picks" className="text-[#DC2626] text-sm cursor-pointer">
          View All
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-5 text-sm text-gray-500">Loading picks...</div>
      ) : picks.length === 0 ? (
        <div className="mt-5 text-sm text-gray-400">No active unlocked picks yet.</div>
      ) : (
        <div className="mt-5 space-y-4">
          {picks.map((pick) => (
            <div
              key={pick._id}
              className="flex justify-between items-center p-3 border border-gray-100 rounded-xl"
            >
              <div>
                <p className="font-medium">
                  {pick.away_team} <span className="text-[#B91C1C]">VS</span>{" "}
                  {pick.home_team}
                </p>
                <p className="text-xs text-gray-500">
                  {pick.sport_title} • {new Date(pick.commence_time).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold capitalize">{pick.market_type}</p>
                <p className="text-xs text-gray-500">{pick.selected_team}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
