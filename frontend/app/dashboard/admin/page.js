"use client";

import Link from "next/link";
import DailySalesChart from "@/components/Dashboard/admin/dailysaleschart";
import DonutChart from "@/components/Dashboard/admin/donutchart";
import { useGetAdminDashboardSummaryQuery } from "@/feature/UserApi";
import { GrUserSettings } from "react-icons/gr";
import { LuCircleDollarSign, LuCirclePlus } from "react-icons/lu";
import {
  FiUsers,
  FiShoppingBag,
  FiTrendingUp,
  FiSend,
  FiUserCheck,
  FiBarChart2,
  FiCheckCircle,
  FiRadio,
  FiMail,
} from "react-icons/fi";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const activityIconMap = {
  pick: {
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    Icon: FiCheckCircle,
  },
  user: {
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
    Icon: GrUserSettings,
  },
  payment: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    Icon: LuCircleDollarSign,
  },
};

export default function DashboardPage() {
  const { data, isLoading } = useGetAdminDashboardSummaryQuery();
  const summary = data?.data;

  return (
    <div className="min-h-screen bg-[#F5F6FA] px-2 md:py-8">
      <div className="space-y-6">
        <StatsCardsSection summary={summary} isLoading={isLoading} />
        <ChartsSection summary={summary} isLoading={isLoading} />
        <MiddleSection summary={summary} isLoading={isLoading} />
        <ActivityFeed summary={summary} isLoading={isLoading} />
      </div>
    </div>
  );
}

function StatsCardsSection({ summary, isLoading }) {
  const cards = [
    {
      label: "Total Users",
      value: summary?.stats?.totalUsers ?? 0,
      change: `${summary?.stats?.activeUsers ?? 0} active accounts`,
      Icon: FiUsers,
      iconColor: "text-[#3B82F6]",
    },
    {
      label: "Active Picks",
      value: summary?.stats?.activePicks ?? 0,
      change: "Currently live on the board",
      Icon: FiRadio,
      iconColor: "text-[#EC4899]",
    },
    {
      label: "Total Orders",
      value: summary?.stats?.totalOrders ?? 0,
      change: `${summary?.stats?.newsletterSubscribers ?? 0} newsletter subscribers`,
      Icon: FiShoppingBag,
      iconColor: "text-[#F59E0B]",
    },
    {
      label: "Total Revenue",
      value: currencyFormatter.format(summary?.stats?.totalRevenue ?? 0),
      change: "Successful paid subscriptions and picks",
      Icon: FiTrendingUp,
      iconColor: "text-[#EF4444]",
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">{card.label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {isLoading ? "..." : card.value}
              </p>
            </div>
            <card.Icon className={`h-6 w-6 ${card.iconColor}`} />
          </div>
          <p className="text-xs font-medium text-gray-500">{card.change}</p>
        </div>
      ))}
    </section>
  );
}

function ChartsSection({ summary, isLoading }) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <DailySalesChart data={summary?.dailySales || []} isLoading={isLoading} />
      <DonutChart
        wins={summary?.winLossRatio?.wins ?? 0}
        losses={summary?.winLossRatio?.losses ?? 0}
        isLoading={isLoading}
      />
    </section>
  );
}

function MiddleSection({ summary, isLoading }) {
  const sports = summary?.topSports || [];

  const actions = [
    {
      label: "Create Pick",
      href: "/dashboard/admin/new-picks",
      Icon: LuCirclePlus,
      bg: "bg-rose-50",
      border: "border-rose-100",
      text: "text-rose-500",
    },
    {
      label: "Send Newsletter",
      href: "/dashboard/admin/newsletters",
      Icon: FiSend,
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      text: "text-indigo-500",
    },
    {
      label: "Manage Users",
      href: "/dashboard/admin/users",
      Icon: FiUserCheck,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-500",
    },
    {
      label: "Sales Reports",
      href: "/dashboard/admin/orders",
      Icon: FiBarChart2,
      bg: "bg-fuchsia-50",
      border: "border-fuchsia-100",
      text: "text-fuchsia-500",
    },
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Top Sports</h2>

        {isLoading ? (
          <div className="py-12 text-sm text-gray-500">Loading sports summary...</div>
        ) : sports.length === 0 ? (
          <div className="py-12 text-sm text-gray-400">No purchase activity yet.</div>
        ) : (
          <div className="space-y-4">
            {sports.map((sport, index) => {
              const maxPurchases = sports[0]?.purchases || 1;
              const width = Math.max(20, Math.round((sport.purchases / maxPurchases) * 100));
              const colors = [
                ["bg-[#EF4444]", "bg-[#FECACA]"],
                ["bg-[#3B82F6]", "bg-[#BFDBFE]"],
                ["bg-[#22C55E]", "bg-[#BBF7D0]"],
                ["bg-[#EAB308]", "bg-[#FEF3C7]"],
              ];
              const [color, track] = colors[index % colors.length];

              return (
                <div
                  key={sport.name}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />
                    <span className="text-gray-700">{sport.name}</span>
                  </div>
                  <div className="flex flex-1 items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {sport.purchases} Purchases
                    </span>
                    <div className="flex-1">
                      <div className={`h-2 w-full rounded-full ${track}`}>
                        <div
                          className={`h-2 rounded-full ${color}`}
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Quick Actions</h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border ${action.bg} ${action.border} py-4 text-sm font-semibold ${action.text} transition hover:shadow-md`}
            >
              <action.Icon className="h-4 w-4" />
              <span>{action.label}</span>
            </Link>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <FiMail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Newsletter Reach</p>
              <p className="text-xs text-gray-500">
                {summary?.stats?.newsletterSubscribers ?? 0} active subscribers ready to receive campaigns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActivityFeed({ summary, isLoading }) {
  const activities = summary?.recentActivity || [];

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Recent Activity</h2>

      {isLoading ? (
        <div className="py-12 text-sm text-gray-500">Loading recent activity...</div>
      ) : activities.length === 0 ? (
        <div className="py-12 text-sm text-gray-400">No recent activity found.</div>
      ) : (
        <div className="space-y-2">
          {activities.map((item) => {
            const ui = activityIconMap[item.type] || activityIconMap.user;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl bg-[#F9FAFB] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${ui.iconBg}`}>
                    <ui.Icon className={`text-lg ${ui.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.time}</p>
                  </div>
                </div>
                {typeof item.amount === "number" ? (
                  <div className="text-sm font-semibold text-gray-700">
                    {currencyFormatter.format(item.amount)}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
