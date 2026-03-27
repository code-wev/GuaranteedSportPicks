"use client";

import ActivePickCard from "./components/ActivePickCard";
import PerformanceTrendChart from "./components/PerformanceTrendChart";
import PieChart from "./components/PieChart";
import QuickActions from "./components/QuickActions";
import StatCard from "./components/StateCard";
import WelcomeCard from "./components/WelcomeCard";
import { useGetMyDashboardSummaryQuery } from "@/feature/UserApi";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Dashboard() {
  const { data, isLoading } = useGetMyDashboardSummaryQuery();
  const summary = data?.data;

  return (
    <div className="space-y-6">
      <WelcomeCard />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Active picks"
          value={isLoading ? "..." : summary?.activePicks ?? 0}
          change={`${summary?.activeSubscription ? "Subscription active" : "Unlocked individually"} picks currently live`}
          icon="pick"
          changeTone="neutral"
        />
        <StatCard
          title="Total wins"
          value={isLoading ? "..." : summary?.totalWins ?? 0}
          change={`${summary?.gradedPicks ?? 0} graded picks tracked from backend`}
          icon="win"
          changeTone="neutral"
        />
        <StatCard
          title="Win Rate"
          value={isLoading ? "..." : `${summary?.winRate ?? 0}%`}
          change={`${summary?.totalLosses ?? 0} losses and ${summary?.totalVoids ?? 0} voids recorded`}
          icon="rate"
          changeTone="neutral"
        />
        <StatCard
          title="Wallet Balance"
          value={isLoading ? "..." : currencyFormatter.format(summary?.walletBalance ?? 0)}
          change={`Paid picks: ${summary?.paidPickPurchases ?? 0} | Subscriptions: ${currencyFormatter.format(
            summary?.totalSubscriptionSpend ?? 0
          )}`}
          icon="wallet"
          changeTone="neutral"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <PerformanceTrendChart
            data={summary?.monthlyPerformance || []}
            isLoading={isLoading}
          />
        </div>
        <PieChart
          wins={summary?.winLossRatio?.wins ?? 0}
          losses={summary?.winLossRatio?.losses ?? 0}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivePickCard />
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-xl">Wallet Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                Total paid picks
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {currencyFormatter.format(summary?.totalPickSpend ?? 0)}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                Total subscriptions
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {currencyFormatter.format(summary?.totalSubscriptionSpend ?? 0)}
              </p>
            </div>
            <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
              <p className="text-xs uppercase tracking-wide text-green-700 font-semibold">
                Successful charges
              </p>
              <p className="text-2xl font-bold text-green-700 mt-2">
                {currencyFormatter.format(summary?.totalSpent ?? 0)}
              </p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs uppercase tracking-wide text-blue-700 font-semibold">
                Pick purchase count
              </p>
              <p className="text-2xl font-bold text-blue-700 mt-2">
                {summary?.paidPickPurchases ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <QuickActions />
    </div>
  );
}
