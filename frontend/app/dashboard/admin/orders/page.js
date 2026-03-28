"use client";

import { useMemo, useState } from "react";
import { useGetAdminOrdersSummaryQuery } from "@/feature/UserApi";
import {
  FiDollarSign,
  FiCheckCircle,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiChevronDown,
  FiSearch,
} from "react-icons/fi";

const STATUS_BADGE = {
  PAID: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-gray-100 text-gray-600",
  FAILED: "bg-red-100 text-red-600",
  EXPIRED: "bg-orange-100 text-orange-600",
  AUTHORIZED: "bg-purple-100 text-purple-700",
  REFUNDED: "bg-red-100 text-red-600",
};

const METHOD_BADGE = {
  PREPAID: "bg-blue-50 text-blue-600",
  PAY_AFTER_WIN: "bg-purple-50 text-purple-600",
  RECURRING: "bg-indigo-50 text-indigo-600",
  ONE_TIME: "bg-fuchsia-50 text-fuchsia-600",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const { data, isLoading, isFetching } = useGetAdminOrdersSummaryQuery();
  const summary = data?.data;

  const filteredOrders = useMemo(() => {
    const orders = summary?.orders || [];
    const normalizedSearch = search.trim().toLowerCase();
    let nextOrders = orders.filter((order) => {
      const matchesSearch =
        !normalizedSearch ||
        order.title?.toLowerCase().includes(normalizedSearch) ||
        order.userName?.toLowerCase().includes(normalizedSearch) ||
        order.email?.toLowerCase().includes(normalizedSearch) ||
        order.orderId?.toLowerCase().includes(normalizedSearch);

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || order.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    nextOrders = [...nextOrders].sort((a, b) => {
      if (sortBy === "amount-desc") return b.amount - a.amount;
      if (sortBy === "amount-asc") return a.amount - b.amount;
      if (sortBy === "name-asc") return a.userName.localeCompare(b.userName);
      if (sortBy === "name-desc") return b.userName.localeCompare(a.userName);
      if (sortBy === "date-asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return nextOrders;
  }, [summary?.orders, search, statusFilter, categoryFilter, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Order & Payment Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Subscription payments and pick purchase transactions in one place.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <SummaryCard
          label="Total Revenue"
          value={isLoading ? "..." : currencyFormatter.format(summary?.stats?.totalRevenue || 0)}
          icon={<FiDollarSign className="text-xl" />}
          iconWrap="bg-green-50 text-green-600"
        />
        <SummaryCard
          label="Held Amount"
          value={isLoading ? "..." : currencyFormatter.format(summary?.stats?.heldAmount || 0)}
          icon={<FiArrowDownLeft className="text-xl" />}
          iconWrap="bg-yellow-50 text-yellow-600"
        />
        <SummaryCard
          label="Refunded / Cancelled"
          value={isLoading ? "..." : currencyFormatter.format(summary?.stats?.refundedAmount || 0)}
          icon={<FiArrowUpRight className="text-xl" />}
          iconWrap="bg-red-50 text-red-500"
        />
        <SummaryCard
          label="Total Orders"
          value={isLoading ? "..." : summary?.stats?.totalOrders || 0}
          icon={<FiCheckCircle className="text-xl" />}
          iconWrap="bg-blue-50 text-blue-600"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Search Orders</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by user, email, order or title..."
                className="border border-gray-300 rounded-lg px-3 py-2 pl-10 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <FilterSelect
            label="Status Filter"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              ["all", "All Status"],
              ["PAID", "Paid"],
              ["AUTHORIZED", "Authorized"],
              ["PENDING", "Pending"],
              ["CANCELLED", "Cancelled"],
              ["FAILED", "Failed"],
            ]}
          />

          <FilterSelect
            label="Type Filter"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              ["all", "All Orders"],
              ["subscription", "Subscriptions"],
              ["pick", "Pick Purchases"],
            ]}
          />

          <FilterSelect
            label="Sort By"
            value={sortBy}
            onChange={setSortBy}
            options={[
              ["date-desc", "Newest First"],
              ["date-asc", "Oldest First"],
              ["amount-desc", "Highest Amount"],
              ["amount-asc", "Lowest Amount"],
              ["name-asc", "Name A-Z"],
              ["name-desc", "Name Z-A"],
            ]}
          />
        </div>
      </div>

      {isLoading || isFetching ? (
        <div className="mt-10 bg-white rounded-xl p-12 shadow flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B91C1C]" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="mt-10 bg-white rounded-xl p-12 shadow text-center text-gray-400">
          No matching orders found.
        </div>
      ) : (
        <div className="mt-10 bg-white rounded-xl p-6 shadow border border-gray-100 overflow-hidden">
          <h2 className="text-lg font-semibold mb-4">
            Orders & Transactions ({filteredOrders.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="bg-[#F9FAFB]">
                <tr className="text-gray-500 text-xs font-semibold uppercase border-b border-gray-100">
                  <th className="px-5 py-4">Order</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Method</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 last:border-none hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{order.orderId}</p>
                      <p className="text-xs text-gray-400 mt-1">{order.title}</p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{order.userName}</p>
                      <p className="text-xs text-gray-400 mt-1">{order.email}</p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 capitalize">
                        {order.category}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          STATUS_BADGE[order.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          METHOD_BADGE[order.method] || "bg-indigo-50 text-indigo-600"
                        }`}
                      >
                        {order.method}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-semibold text-[#B91C1C]">
                      {currencyFormatter.format(order.amount || 0)}
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(order.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, icon, iconWrap }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl p-6 shadow-sm">
      <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${iconWrap}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer"
        >
          {options.map(([optionValue, optionLabel]) => (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          ))}
        </select>
        <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
}
