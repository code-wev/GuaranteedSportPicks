"use client";

import { FiCalendar } from "react-icons/fi";

export default function CreatePickForm() {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">
        Create New Pick
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {/* Away Team */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Away Team</label>
          <select className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 outline-none">
            <option>Enter away Team</option>
          </select>
        </div>

        {/* Home Team */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Home Team</label>
          <input
            type="text"
            placeholder="e.g. Chiefs"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
          />
        </div>

        {/* Game Date */}
        <div className="flex flex-col relative">
          <label className="text-sm font-medium text-gray-700">Game Date</label>
          <input
            type="text"
            placeholder="mm/dd/yyyy"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 outline-none"
          />
          <FiCalendar className="absolute right-3 top-9 text-gray-500" />
        </div>

        {/* Game Time */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Game Time</label>
          <input
            type="text"
            placeholder="---;--- --"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
          />
        </div>

        {/* Pick Type */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Pick Type</label>
          <select className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 outline-none">
            <option>Spread</option>
          </select>
        </div>

        {/* Betting Line */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Betting Line</label>
          <input
            type="text"
            placeholder="e.g., -3.5 , +150, o 45.5"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
          />
        </div>

        {/* Odds */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Odds</label>
          <input
            type="text"
            placeholder="e.g., -110 , +150"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
          />
        </div>

        {/* Units */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Units</label>
          <input
            type="text"
            placeholder="1–5"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
          />
          <div className="mt-2 flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4" />
            <span className="text-sm text-gray-600">Show units publicly</span>
          </div>
        </div>
      </div>

      {/* Picks Analysis */}
      <div className="mt-6">
        <label className="text-sm font-medium text-gray-700">Picks Analysis</label>

        {/* Toolbar */}
        <div className="mt-2 flex items-center gap-4 rounded-t-lg border border-b-0 border-gray-300 bg-gray-50 px-3 py-2 text-gray-600 text-sm">
          <button className="font-semibold">B</button>
          <button className="italic">I</button>
          <button className="underline">U</button>
          <span>|</span>
          <button>•</button>
          <button>1.</button>
          <button>⎘</button>
          <button>⎋</button>
        </div>

        {/* Textarea */}
        <textarea
          placeholder="Write your detailed analysis and reasoning for this pick..."
          className="h-40 w-full rounded-b-lg border border-gray-300 px-3 py-2 outline-none"
        ></textarea>
      </div>

      {/* Banner Upload */}
      <div className="mt-6">
        <label className="text-sm font-medium text-gray-700">Optional Pick Banner</label>

        <div className="mt-3 flex h-40 w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-400 text-center text-sm text-gray-600">
          <p className="text-3xl">⬆</p>
          <p>Click to upload banner image</p>
          <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
        </div>
      </div>
    </div>
  );
}
