"use client";

import { FiChevronDown } from "react-icons/fi";

export default function PurchaseHistory() {
  const data = [
    {
      pick: "Cowboys VS Giants",
      type: "Spread",
      amount: "$25.00",
      model: "Prepaid",
      date: "2025-02-26",
      status: "Paid",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      pick: "Lakers VS Warriors",
      type: "Moneyline",
      amount: "$55.00",
      model: "PAW",
      date: "2025-02-26",
      status: "Pending",
      statusColor: "bg-orange-100 text-orange-700",
    },
    {
      pick: "Chiefs VS Bills",
      type: "Total",
      amount: "$105.00",
      model: "Prepaid",
      date: "2025-02-26",
      status: "Paid",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      pick: "Celtics VS Heat",
      type: "Heat",
      amount: "$215.00",
      model: "PAW",
      date: "2025-02-26",
      status: "Failed",
      statusColor: "bg-red-100 text-red-700",
    },
  ];

  return (
    <div className="w-full px-4 md:px-8 py-6">
      <h2 className="text-xl md:text-2xl lg:text-[32px] font-semibold mb-4">Purchase history</h2>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
          <FilterDropdown label="All Sports" />
          <FilterDropdown label="All Status" />
          <FilterDropdown label="All time" />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-left">
            <thead className="bg-[#F9FAFB]">
              <tr className="text-gray-500 text-sm border-b border-gray-100">
                <th className="px-4 py-3">PICK</th>
                <th className="px-4 py-3">TYPE</th>
                <th className="px-4 py-3">AMOUNT</th>
                <th className="px-4 py-3">MODEL</th>
                <th className="px-4 py-3">DATE</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 last:border-b-0 text-sm"
                >
                  <td className="px-4 py-6 whitespace-nowrap">{row.pick}</td>
                  <td className="px-4 py-6 text-blue-600">{row.type}</td>
                  <td className="px-4 py-6">{row.amount}</td>
                  <td className="px-4 py-6 text-blue-600">{row.model}</td>
                  <td className="px-4 py-6">{row.date}</td>
                  <td className="px-4 py-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${row.statusColor}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 flex items-center gap-3 text-blue-600">
                    <button className="hover:underline">View</button>
                    <button className="hover:underline">Resend</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FilterDropdown({ label }) {
  return (
    <button className="w-full md:w-auto flex justify-between items-center px-4 py-2 bg-gray-100 text-sm rounded-md">
      {label}
      <FiChevronDown className="ml-2 text-gray-600" />
    </button>
  );
}
