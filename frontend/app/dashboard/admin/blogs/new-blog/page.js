"use client";

import { FiChevronDown } from "react-icons/fi";

export default function NewBlog() {
  return (
    <div className="px-2 py-4 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold mb-6">New Blog Management</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

        {/* Title + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Title */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              defaultValue="top 5 NFL Betting Strategies for 2024"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Category
            </label>

            <div className="relative">
              <select className="appearance-none w-full border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer focus:outline-none">
                <option>NFL</option>
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Game Date */}
        <div className="flex flex-col mb-6">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Game Date
          </label>

          <input
            type="file"
            className="border border-gray-300 rounded-lg px-2 py-2 text-sm bg-white focus:outline-none"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col mb-6">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Content
          </label>

          <textarea
            rows={6}
            className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none resize-none"
            defaultValue="Discover the most effective betting strategies for the current NFL season..."
          ></textarea>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
            Cancel
          </button>

          <button className="px-5 py-2 bg-[#DC2626] text-white rounded-lg text-sm font-medium hover:bg-red-600 shadow-sm">
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
