// app/page.jsx or pages/index.js
import DailySalesChart from "@/components/Dashboard/admin/dailysaleschart";
import DonutChart from "@/components/Dashboard/admin/donutchart";
import { GrUserSettings } from "react-icons/gr";
import { LuCircleDollarSign } from "react-icons/lu";
import { LuCirclePlus } from "react-icons/lu";
import Image from "next/image";
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiMail,
  FiTrendingUp,
  FiPlus,
  FiSend,
  FiUserCheck,
  FiBarChart2,
  FiCheckCircle,
} from "react-icons/fi";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F5F6FA] px-2 md:py-8">
      <div className="space-y-6">
        <StatsCardsSection />
        <ChartsSection />
        <MiddleSection />
        <ActivityFeed />
      </div>
    </div>
  );
}

/* 1️⃣ TOP STATS CARDS */
function StatsCardsSection() {
  const cards = [
    {
      label: "Total Users",
      value: "1,247",
      change: "+12% vs last month",
      changeColor: "text-emerald-500",
      Icon: FiUsers,
      iconColor: "text-[#3B82F6]",
    },
    {
      label: "Active Picks",
      value: "12",
      change: "+3 new today",
      changeColor: "text-emerald-500",
      Icon: FiDollarSign,
      iconColor: "text-[#EC4899]",
    },
    {
      label: "Total Orders",
      value: "1,523",
      change: "+8% vs last week",
      changeColor: "text-emerald-500",
      Icon: FiShoppingBag,
      iconColor: "text-[#F59E0B]",
    },
    {
      label: "Total Revenue",
      value: "$12,847",
      change: "+15% vs last month",
      changeColor: "text-emerald-500",
      Icon: FiTrendingUp,
      iconColor: "text-[#EF4444]",
    }
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
                {card.value}
              </p>
            </div>
            <card.Icon className={`h-6 w-6 ${card.iconColor}`} />
          </div>
          <p className={`text-xs font-medium ${card.changeColor}`}>
            {card.change}
          </p>
        </div>
      ))}
    </section>
  );
}

/* 2️⃣ MIDDLE CHARTS SECTION */
function ChartsSection() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {/* Daily Sales */}
      <DailySalesChart />

      {/* Donut Chart */}
      <DonutChart />
    </section>
  );
}

/* 3️⃣ TOP SPORTS + QUICK ACTIONS */
function MiddleSection() {
  const sports = [
    {
      name: "NFL",
      purchases: 450,
      color: "bg-[#EF4444]",
      track: "bg-[#FECACA]",
    },
    {
      name: "NFL",
      purchases: 380,
      color: "bg-[#3B82F6]",
      track: "bg-[#BFDBFE]",
    },
    {
      name: "NFL",
      purchases: 280,
      color: "bg-[#22C55E]",
      track: "bg-[#BBF7D0]",
    },
    {
      name: "NFL",
      purchases: 180,
      color: "bg-[#EAB308]",
      track: "bg-[#FEF3C7]",
    },
  ];

  const actions = [
    {
      label: "Create Pick",
      Icon: LuCirclePlus,
      bg: "bg-rose-50",
      border: "border-rose-100",
      text: "text-rose-500",
    },
    {
      label: "Send Newsletter",
      Icon: FiSend,
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      text: "text-indigo-500",
    },
    {
      label: "Manage Users",
      Icon: FiUserCheck,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-500",
    },
    {
      label: "Sales Reports",
      Icon: FiBarChart2,
      bg: "bg-fuchsia-50",
      border: "border-fuchsia-100",
      text: "text-fuchsia-500",
    },
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {/* Top Sports list */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Top Sports</h2>

        <div className="space-y-4">
          {sports.map((sport, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${sport.color}`}
                />
                <span className="text-gray-700">{sport.name}</span>
              </div>
              <div className="flex flex-1 items-center gap-3">
                <span className="text-xs text-gray-500">
                  {sport.purchases} Purchases
                </span>
                <div className="flex-1">
                  <div className={`h-2 w-full rounded-full ${sport.track}`}>
                    <div
                      className={`h-2 rounded-full ${sport.color}`}
                      style={{
                        width:
                          index === 0
                            ? "85%"
                            : index === 1
                            ? "75%"
                            : index === 2
                            ? "55%"
                            : "40%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {actions.map((action) => (
            <button
              key={action.label}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border ${action.bg} ${action.border} py-4 text-sm font-semibold ${action.text} transition hover:shadow-md`}
            >
              <action.Icon className="h-4 w-4" />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 4️⃣ ACTIVITY FEED (BOTTOM) */
function ActivityFeed() {
  const activities = [
    {
      id: 1,
      title: "New pick published: Lakers vs Warriors",
      time: "2 minutes ago",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      Icon: FiCheckCircle,
    },
    {
      id: 2,
      title: "New user registered: john.doe@email.com",
      time: "15 minutes ago",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-500",
      Icon: GrUserSettings,
    },
    {
      id: 3,
      title: "Payment received: $299 Premium Package",
      time: "1 hour ago",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      Icon: LuCircleDollarSign,
    },
  ];

  // return (
  //   <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
  //     <h2 className="mb-4 text-xl font-semibold text-gray-800">
  //       Recent Activity
  //     </h2>

  //     <div className="space-y-2">
  //       {activities.map((item) => (
  //         <div
  //           key={item.id}
  //           className="flex items-center justify-between rounded-2xl bg-[#F9FAFB] px-4 py-3"
  //         >
  //           <div className="flex items-center gap-3">
  //             <div
  //               className={`flex h-8 w-8 items-center justify-center rounded-full ${item.iconBg}`}
  //             >
  //               <div
  //                 className={`p-2 rounded-full ${item.iconBg}`}
  //               >
  //                 <item.Icon className={`text-2xl ${item.iconColor} `} />
  //               </div>
  //             </div>
  //             <div>
  //               <p className="text-sm font-medium text-gray-800">{item.title}</p>
  //               <p className="text-xs text-gray-400">{item.time}</p>
  //             </div>
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   </section>
  // );
}
