"use client";

import { useState } from "react";
import PickCard from "../components/PickCard";
import PickCardCompleted from "../components/PickCardCompleted";

export default function MyPicksPage() {
  const [tab, setTab] = useState("active");

  return (
    <div className="py-4">
      {/* Title + Subtitle */}
      <h1 className="text-xl md:text-2xl lg:text-[32px] mb-1 font-medium">My Picks</h1>
      <p className="text-gray-500 mb-6 text-base">
        Track all your purchased picks and their performance
      </p>

      <div className="bg-white p-6 min-h-screen">
        {/* Tabs + Dropdown */}
        <div className="flex items-center justify-between mb-6">
          {/* Tabs */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTab("active")}
              className={`whitespace-nowrap px-4 py-2 text-sm rounded-lg border ${
                tab === "active"
                  ? "bg-[#B91C1C] text-white border-red-600"
                  : "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              Active (1)
            </button>

            <button
              onClick={() => setTab("completed")}
              className={`whitespace-nowrap px-4 py-2 text-sm rounded-lg border mr-2 ${
                tab === "completed"
                  ? "bg-[#B91C1C] text-white border-red-600"
                  : "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              Completed (2)
            </button>
          </div>

          {/* Dropdown */}
          <select className="text-sm px-3 py-1.5 rounded-lg shadow-sm">
            <option>All Sports</option>
            <option>NBA</option>
            <option>NFL</option>
            <option>NHL</option>
          </select>
        </div>

        {/* Cards Section */}
        <div className="mt-4">
          {tab === "active" && (
            <div>
              <PickCard />
            </div>
          )}

          {tab === "completed" && (
            <div className="flex items-center gap-6">
              <PickCardCompleted status="Won" statusColor="green" />
              <PickCardCompleted status="Lost" statusColor="red" />
            </div>
          )}

          {tab === "expired" && (
            <div>
              <PickCardCompleted status="Expired" statusColor="gray" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
