"use client";

import { useState } from "react";
import { useGetMyPickPurchasesQuery, useGetMySubscriptionQuery } from "@/feature/PaymentApi";
import { useGetMyAccessiblePicksQuery } from "@/feature/PicksApi";

const getStatusTone = (status) => {
  if (status === "win") return "bg-green-100 text-green-700";
  if (status === "loss") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
};

export default function MyPicksPage() {
  const [tab, setTab] = useState("active");
  const { data: purchasesData, isLoading: isLoadingPurchases } = useGetMyPickPurchasesQuery();
  const { data: accessiblePicksData, isLoading: isLoadingAccessible } = useGetMyAccessiblePicksQuery();
  const { data: subscriptionData } = useGetMySubscriptionQuery();

  const purchases = purchasesData?.data || [];
  const accessiblePicks = accessiblePicksData?.data || [];
  const activeSubscription = subscriptionData?.data;

  const activePicks = accessiblePicks.filter((pick) => !pick.result && pick.status === "active");
  const completedPicks = accessiblePicks.filter((pick) => pick.result === "win" || pick.result === "loss");

  const visiblePicks = tab === "active" ? activePicks : completedPicks;
  const isLoading = isLoadingPurchases || isLoadingAccessible;

  return (
    <div className="py-4 space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl lg:text-[32px] mb-1 font-medium">My Picks</h1>
        <p className="text-gray-500 text-base">
          Track purchased picks and every premium pick unlocked by your active subscription.
        </p>
      </div>

      {activeSubscription && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
          Active subscription sports: {activeSubscription.selectedSport?.join(", ")}
        </div>
      )}

      <div className="bg-white p-6 min-h-screen rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTab("active")}
              className={`whitespace-nowrap px-4 py-2 text-sm rounded-lg border ${
                tab === "active"
                  ? "bg-[#B91C1C] text-white border-red-600"
                  : "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              Active ({activePicks.length})
            </button>

            <button
              onClick={() => setTab("completed")}
              className={`whitespace-nowrap px-4 py-2 text-sm rounded-lg border ${
                tab === "completed"
                  ? "bg-[#B91C1C] text-white border-red-600"
                  : "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              Completed ({completedPicks.length})
            </button>
          </div>

          <div className="text-sm text-gray-500">Purchased records: {purchases.length}</div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-gray-500">Loading picks...</div>
        ) : visiblePicks.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            {tab === "active" ? "No active accessible picks right now." : "No completed picks yet."}
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {visiblePicks.map((pick) => (
              <div key={pick._id} className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-red-600 font-bold">
                      {pick.sport_title}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">
                      {pick.away_team} @ {pick.home_team}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(pick.commence_time).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      pick.result ? getStatusTone(pick.result) : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {pick.result || "active"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-gray-400">Pick</p>
                    <p className="font-semibold text-gray-800">{pick.selected_team}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-gray-400">Units</p>
                    <p className="font-semibold text-gray-800">{pick.units}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-gray-400">Market</p>
                    <p className="font-semibold text-gray-800 capitalize">{pick.market_type}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-gray-400">Confidence</p>
                    <p className="font-semibold text-gray-800 capitalize">{pick.confidence}</p>
                  </div>
                </div>

                <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-red-500 font-bold mb-2">
                    Writeup
                  </p>
                  <p className="text-sm text-gray-700 leading-6">{pick.writeup}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
