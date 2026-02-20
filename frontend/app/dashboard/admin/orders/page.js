"use client";

import {
  FiDollarSign,
  FiCheckCircle,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiChevronDown,
} from "react-icons/fi";

export default function OrdersPage() {
  const orders = [
    {
      id: "ORD-001",
      title: "Lakers vs Warrior",
      user: "John Smith",
      email: "johnsmith@gmail.com",
      status: "Sent",
      method: "PREPAID",
      amount: 150,
      date: "2024-01-15 14:30:00",
    },
    {
      id: "ORD-001",
      title: "Lakers vs Warrior",
      user: "John Smith",
      email: "johnsmith@gmail.com",
      status: "Queued",
      method: "PAW",
      amount: 0,
      date: "2024-01-15 16:00:00",
    },
    {
      id: "ORD-001",
      title: "Lakers vs Warrior",
      user: "John Smith",
      email: "johnsmith@gmail.com",
      status: "Returned",
      method: "PAW",
      amount: 250,
      date: "2024-01-15 12:15:00",
    },
    {
      id: "ORD-001",
      title: "Lakers vs Warrior",
      user: "John Smith",
      email: "johnsmith@gmail.com",
      status: "Sent",
      method: "PREPAID",
      amount: 300,
      date: "2024-01-15 12:15:00",
    },
  ];

  const statusStyle = {
    Sent: "bg-green-50 text-green-600",
    Queued: "bg-yellow-50 text-yellow-600",
    Returned: "bg-red-50 text-red-500",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <h1 className="text-2xl font-semibold">Order & Payment Management</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="flex items-center gap-4 bg-white rounded-xl p-6 shadow-sm">
          <div className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 rounded-lg">
            <FiDollarSign className="text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-semibold">$299.00</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white rounded-xl p-6 shadow-sm">
          <div className="w-10 h-10 flex items-center justify-center bg-yellow-50 text-yellow-600 rounded-lg">
            <FiArrowDownLeft className="text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Held Amount</p>
            <p className="text-2xl font-semibold">$49.00</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white rounded-xl p-6 shadow-sm">
          <div className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-lg">
            <FiArrowUpRight className="text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Refunded</p>
            <p className="text-2xl font-semibold">$199.00</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white rounded-xl p-6 shadow-sm">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg">
            <FiCheckCircle className="text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-semibold">04</p>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Users */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Search Users
            </label>
            <input
              type="text"
              placeholder="Search by name or email..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Status Filter
            </label>
            <div className="relative">
              <select className="appearance-none w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
                <option>All Status</option>
                <option>Sent</option>
                <option>Queued</option>
                <option>Returned</option>
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Subscription Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Subscription Filter
            </label>
            <div className="relative">
              <select className="appearance-none w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
                <option>All Subscriptions</option>
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Sort By */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <div className="relative">
              <select className="appearance-none w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
                <option>Name</option>
                <option>Amount</option>
                <option>Date</option>
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-10 bg-white rounded-xl p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">
          Orders & Transactions ({orders.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500 border-b border-gray-200">
              <tr>
                <th className="py-6">ORDER ID</th>
                <th className="py-6">AMOUNT</th>
                <th className="py-6">STATUS</th>
                <th className="py-6">METHOD</th>
                <th className="py-6">AMOUNT</th>
                <th className="py-6">DATE</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o, i) => (
                <tr key={i} className="border-b border-gray-200 last:border-none">
                  <td className="py-6">
                    <p className="font-medium">{o.id}</p>
                    <p className="text-xs text-gray-400">{o.title}</p>
                  </td>

                  <td className="py-6">
                    <p className="font-medium">{o.user}</p>
                    <p className="text-xs text-gray-400">{o.email}</p>
                  </td>

                  <td className="py-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusStyle[o.status]
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>

                  <td className="py-6">
                    <span className="px-2 py-1 text-xs rounded bg-indigo-50 text-indigo-600">
                      {o.method}
                    </span>
                  </td>

                  <td className="py-6 font-medium">${o.amount}</td>

                  <td className="py-6 text-xs text-gray-500">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
