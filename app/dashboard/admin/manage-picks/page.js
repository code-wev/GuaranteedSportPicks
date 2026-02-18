"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiEdit,
  FiTrash2,
  FiSearch,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiAward,
} from "react-icons/fi";
import { IoIosSend } from "react-icons/io";

const picksData = [
  {
    id: 1,
    game: "Warriors Lakers",
    date: "2024-01-15",
    time: "20:00",
    spread: "Spread -3.5",
    odds: "odds -110",
    status: "Active",
  },
  {
    id: 2,
    game: "Warriors Lakers",
    date: "2024-01-15",
    time: "20:00",
    spread: "Spread -3.5",
    odds: "odds -110",
    status: "Active",
  },
  {
    id: 3,
    game: "Warriors Lakers",
    date: "2024-01-15",
    time: "20:00",
    spread: "Spread -3.5",
    odds: "odds -110",
    status: "Active",
  },
  {
    id: 4,
    game: "Warriors Lakers",
    date: "2024-01-15",
    time: "20:00",
    spread: "Spread -3.5",
    odds: "odds -110",
    status: "Active",
  },
  {
    id: 5,
    game: "Warriors Lakers",
    date: "2024-01-15",
    time: "20:00",
    spread: "Spread -3.5",
    odds: "odds -110",
    status: "Active",
  },
  {
    id: 6,
    game: "Warriors Lakers",
    date: "2024-01-15",
    time: "20:00",
    spread: "Spread -3.5",
    odds: "odds -110",
    status: "Active",
  },
  {
    id: 7,
    game: "Warriors Lakers",
    date: "2024-01-15",
    time: "20:00",
    spread: "Spread -3.5",
    odds: "odds -110",
    status: "Active",
  },
  {
    id: 8,
    game: "Warriors Lakers",
    date: "2024-01-15",
    time: "20:00",
    spread: "Spread -3.5",
    odds: "odds -110",
    status: "Active",
  },
];

export default function PickManagement() {
  const [search, setSearch] = useState("");

  const filteredPicks = picksData.filter((pick) =>
    pick.game.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-semibold">Pick Management</h1>
        <Link href="/dashboard/admin/new-picks" className="bg-[#DC2626] text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
          + New Pick
        </Link>
      </div>

      {/* Stats Cards - hidden on mobile */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Active Picks" 
          value="01"
          icon={FiCheckCircle}
          iconColor="text-green-500"
        />
        <StatCard
          title="Scheduled"
          value="02"
          icon={FiClock}
          iconColor="text-yellow-500"
        />
        <StatCard
          title="Win Rate"
          value="68%"
          icon={FiTrendingUp}
          iconColor="text-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-x-auto">
        <div className="flex flex-col md:flex-row items-start md:justify-between mb-4 gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <h2 className="text-xl font-medium">All Picks</h2>
            <select className="border border-gray-200 rounded-md p-2">
              <option>Filter All Status</option>
              <option>Active</option>
              <option>Scheduled</option>
            </select>
          </div>

          <div className="relative flex gap-2 w-full md:w-1/2">
            <FiSearch className="absolute text-lg top-3 left-1.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search picks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-md p-2 pl-7 flex-1"
            />
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
              Search
            </button>
          </div>
        </div>

        <table className="min-w-full text-sm">
          <thead className="text-left text-gray-500">
            <tr>
              <th className="p-2 py-4">Game</th>
              <th className="p-2 py-4">Date/Time</th>
              <th className="p-2 py-4">Pick Details</th>
              {/* <th className="p-2 py-4">Units</th> */}
              <th className="p-2 py-4">Status</th>
              <th className="p-2 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPicks.map((pick) => (
              <tr key={pick.id}>
                <td className="p-2 py-4">{pick.game}</td>
                <td className="p-2 py-4">
                  <div className="flex flex-col">
                    <span>{pick.date}</span>
                    <span className="text-gray-500">{pick.time}</span>
                  </div>
                </td>
                <td className="p-2 py-4">
                  <div className="flex flex-col">
                    <span>{pick.spread}</span>
                    <span className="text-gray-500">{pick.odds}</span>
                  </div>
                </td>
                {/* <td className="p-2 py-4">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {pick.units}
                  </span>
                </td> */}
                <td className="p-2 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      pick.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {pick.status}
                  </span>
                </td>
                <td className="p-2 flex gap-2 py-8">
                  {/* <button className="text-gray-500 hover:text-gray-700">
                    <IoIosSend />
                  </button> */}
                  <button className="text-gray-500 hover:text-gray-700">
                    <FiEdit />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 mt-4 text-gray-500">
          <button>Previous</button>
          <span>1</span>
          <button>2</button>
          <button>3</button>
          <span>...</span>
          <button>Next</button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, iconColor }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-end justify-between shadow-sm">
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className={`text-2xl ${iconColor}`}>
        <Icon />
      </div>
    </div>
  );
}
