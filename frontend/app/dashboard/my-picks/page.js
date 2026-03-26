"use client";

import { useState } from "react";
import { useGetMyPickPurchasesQuery, useGetMySubscriptionQuery } from "@/feature/PaymentApi";
import { useGetMyAccessiblePicksQuery } from "@/feature/PicksApi";

const getStatusTone = (status) => {
  if (status === "win") return "bg-green-100 text-green-700";
  if (status === "loss") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
};

const getPurchaseStatusBadge = (purchase) => {
  if (!purchase) return null;
  
  if (purchase.paymentModel === "PAY_AFTER_WIN") {
    if (purchase.status === "AUTHORIZED") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 uppercase border border-purple-200">
          PAW: Authorized
        </span>
      );
    }
    if (purchase.status === "PAID") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase border border-green-200">
          PAW: Captured
        </span>
      );
    }
    if (purchase.status === "CANCELLED") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 uppercase border border-gray-200">
          PAW: Cancelled
        </span>
      );
    }
  } else if (purchase.paymentModel === "PREPAID") {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase border border-blue-200">
        Prepaid
      </span>
    );
  }
  return null;
};

export default function MyPicksPage() {
  const [tab, setTab] = useState("active");
  const { data: purchasesData, isLoading: isLoadingPurchases } = useGetMyPickPurchasesQuery();
  const { data: accessiblePicksData, isLoading: isLoadingAccessible } = useGetMyAccessiblePicksQuery();
  const { data: subscriptionData } = useGetMySubscriptionQuery();

  const purchases = purchasesData?.data || [];
  const accessiblePicks = accessiblePicksData?.data || [];
  const activeSubscription = subscriptionData?.data;

  // Filter out picks that were cancelled (LOSS/VOID in PAW model) if they are in completed tab
  // but keep them if the user wants to see their history. 
  // Actually, getMyAccessiblePicks only returns AUTHORIZED or PAID.
  // So for CANCELLED PAW picks, they might not show up in accessiblePicks.
  
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
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 flex items-center justify-between">
          <span>Active subscription sports: {activeSubscription.selectedSport?.join(", ")}</span>
          <span className="text-[10px] font-bold uppercase bg-green-200 px-2 py-1 rounded">Subscription Active</span>
        </div>
      )}

      <div className="bg-white p-6 min-h-screen rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTab("active")}
              className={`whitespace-nowrap px-6 py-2.5 text-sm font-semibold rounded-xl border transition-all ${
                tab === "active"
                  ? "bg-[#B91C1C] text-white border-red-600 shadow-md shadow-red-100"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              Active ({activePicks.length})
            </button>

            <button
              onClick={() => setTab("completed")}
              className={`whitespace-nowrap px-6 py-2.5 text-sm font-semibold rounded-xl border transition-all ${
                tab === "completed"
                  ? "bg-[#B91C1C] text-white border-red-600 shadow-md shadow-red-100"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              Completed ({completedPicks.length})
            </button>
          </div>

          <div className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            Purchased records: {purchases.length}
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-gray-500">
             <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
             Loading your picks...
          </div>
        ) : visiblePicks.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-2xl">
            <p className="text-gray-400 text-lg">
              {tab === "active" ? "No active accessible picks right now." : "No completed picks yet."}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Visit the <a href="/dashboard/purchase" className="text-red-600 font-bold hover:underline">Purchase</a> page to unlock premium picks.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {visiblePicks.map((pick) => {
              const purchase = purchases.find(p => p.pickId?._id === pick._id || p.pickId === pick._id);
              const isFromSubscription = activeSubscription?.selectedSport?.includes(pick.sport_title);

              return (
                <div key={pick._id} className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-red-600 font-black">
                          {pick.sport_title}
                        </p>
                        {getPurchaseStatusBadge(purchase)}
                        {isFromSubscription && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase border border-green-200">
                            Subscribed
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight">
                        {pick.away_team} @ {pick.home_team}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium mt-1">
                        {new Date(pick.commence_time).toLocaleString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        pick.result ? getStatusTone(pick.result) : "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}
                    >
                      {pick.result || "PENDING"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">My Pick</p>
                      <p className="font-bold text-gray-800 truncate">{pick.selected_team}</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Units</p>
                      <p className="font-bold text-gray-800">{pick.units}u</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Market</p>
                      <p className="font-bold text-gray-800 capitalize">{pick.market_type}</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Confidence</p>
                      <p className="font-bold text-gray-800 capitalize">{pick.confidence}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#FFF9F9] border border-[#FFECEC] p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                    <p className="text-[10px] uppercase font-black text-red-600 mb-2 tracking-widest">
                      Expert Writeup & Analysis
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium italic">"{pick.writeup}"</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
