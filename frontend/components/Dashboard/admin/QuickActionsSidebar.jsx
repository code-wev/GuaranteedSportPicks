"use client";

import { FiCalendar } from "react-icons/fi";

export default function QuickActionsSidebar() {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Quick Action</h2>

      {/* Buttons */}
      <div className="space-y-3">
        <button className="w-full rounded bg-[#DC2626] py-2.5 text-center text-sm font-semibold text-white hover:bg-red-700">
          + Create Pick
        </button>

        <button className="w-full rounded bg-white text-[#DC2626] border border-[#DC2626] py-2.5 text-center text-sm font-semibold hover:bg-blue-700">
          Schedule Release
        </button>
      </div>

      {/* Pick Preview */}
      <div className="mt-6">
        <label className="text-sm font-medium text-gray-700">Pick Preview</label>
        <input
          type="text"
          disabled
          placeholder="Fill in the form to see preview"
          className="mt-2 w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 outline-none"
        />
      </div>

      {/* Schedule Options */}
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Schedule Options</h3>

        {/* Release Date */}
        <label className="text-sm font-medium text-gray-700">Release Date</label> 
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="mm/dd/yyyy"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 outline-none"
          />
          <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>

        {/* Expiry Date */}
        <label className="text-sm font-medium text-gray-700">Expiry Date</label>
        <div className="relative">
          <input
            type="text"
            placeholder="mm/dd/yyyy"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 outline-none"
          />
          <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>
    </div>
  );
}
