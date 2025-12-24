"use client";

import Image from "next/image";
import { useState } from "react";
import {
  FiChevronDown,
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiX,
  FiUpload,
  FiCalendar,
} from "react-icons/fi";

export default function AffiliatedBannerManagement() {
  const [openModal, setOpenModal] = useState(false);

  const banners = [
    {
      title: "DraftKings Sportsbook",
      impressions: "45,230",
      clicks: "832",
      ctr: "1.97%",
      revenue: "$2845",
      target: "United States",
      region: "All States",
      weight: "30%",
      period: "2025-05-15 - 2025-06-25",
      status: "Active",
    },
    {
      title: "DraftKings Sportsbook",
      impressions: "45,230",
      clicks: "832",
      ctr: "1.97%",
      revenue: "$2845",
      target: "United States",
      region: "All States",
      weight: "30%",
      period: "2025-05-15 - 2025-06-25",
      status: "Active",
    },
    {
      title: "DraftKings Sportsbook",
      impressions: "45,230",
      clicks: "832",
      ctr: "1.97%",
      revenue: "$2845",
      target: "United States",
      region: "All States",
      weight: "30%",
      period: "2025-05-15 - 2025-06-25",
      status: "Active",
    },
  ];

  return (
    <div className="px-2 py-6 min-h-screen bg-gray-50">
      {/* PAGE TITLE */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Affiliated Banner Management</h1>

        {/* ADD BANNER BTN */}
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center whitespace-nowrap gap-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg text-sm shadow-sm"
        >
          <FiPlus className="text-lg" /> Add Banner
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">
            👤
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Subscribers</p>
            <p className="text-2xl font-semibold">01</p>
          </div>
        </div>

        <div className="bg-white  rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center text-xl">
            ✉️
          </div>
          <div>
            <p className="text-gray-500 text-sm">Avg Open Rate</p>
            <p className="text-2xl font-semibold">24.75%</p>
          </div>
        </div>

        <div className="bg-white  rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center text-xl">
            📈
          </div>
          <div>
            <p className="text-gray-500 text-sm">Avg Click Rate</p>
            <p className="text-2xl font-semibold">9.02%</p>
          </div>
        </div>

        <div className="bg-white  rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center text-xl">
            📨
          </div>
          <div>
            <p className="text-gray-500 text-sm">Campaigns</p>
            <p className="text-2xl font-semibold">03</p>
          </div>
        </div>
      </div>

      {/* ACTIVE BANNERS */}
      <h2 className="text-lg font-semibold mb-4">Active Banners (3)</h2>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 justify-end">
        <div className="relative">
          <select className="appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm w-40 cursor-pointer focus:outline-none">
            <option>All Banners</option>
          </select>
          <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
        </div>

        <div className="relative">
          <select className="appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 cursor-pointer focus:outline-none">
            <option>All Sizes</option>
          </select>
          <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Banner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {banners.map((banner, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold">{banner.title}</p>
              <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-md border border-green-200">
                ● Active
              </span>
            </div>

            <div className="bg-gray-700 w-full h-28 rounded-lg mb-3 flex items-center justify-center text-white text-xs">
              468×70
            </div>

            <div className="grid grid-cols-2 text-sm gap-y-1 mb-4">
              <p className="text-gray-500">Impressions</p>
              <p>{banner.impressions}</p>

              <p className="text-gray-500">Clicks</p>
              <p>{banner.clicks}</p>

              <p className="text-gray-500">CTR</p>
              <p>{banner.ctr}</p>

              <p className="text-gray-500">Revenue</p>
              <p>{banner.revenue}</p>
            </div>

            <div className="text-sm text-gray-500">
              <p>
                <span className="text-blue-600">Target:</span> {banner.target}
              </p>
              <p>
                <span className="text-blue-600">Region:</span> {banner.region}
              </p>
              <p>
                <span className="text-blue-600">Weight:</span> {banner.weight}
              </p>
              <p>
                <span className="text-blue-600">Period:</span> {banner.period}
              </p>
            </div>

            <div className="flex items-center justify-end mt-3 gap-3">
              <FiEdit3 className="text-gray-600 cursor-pointer hover:text-black" />
              <FiTrash2 className="text-red-500 cursor-pointer hover:text-red-700" />
            </div>
          </div>
        ))}
      </div>
      {/* GEO TRACKING CONFIGURATION */}
      <h2 className="text-lg font-semibold mb-3">Geo-Tracking Configuration</h2>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Default Country */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Default Country
            </label>
            <div className="relative">
              <select className="appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm w-full cursor-pointer focus:outline-none">
                <option>United States</option>
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Tracking Method */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Tracking Method
            </label>
            <div className="relative">
              <select className="appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm w-full cursor-pointer focus:outline-none">
                <option>IP Geolocation</option>
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Rotation Algorithm */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Rotation Algorithm
            </label>
            <div className="relative">
              <select className="appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm w-full cursor-pointer focus:outline-none">
                <option>Weighted Random</option>
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------- MODAL ----------------------- */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl p-6 relative">
            {/* Close Icon */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute right-5 top-5 text-gray-500 hover:text-black"
            >
              <FiX size={22} />
            </button>

            {/* Title */}
            <h1 className="text-xl font-semibold mb-6">Update New Banner</h1>

            {/* Banner Name + Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Banner Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Banner Size
                </label>
                <div className="relative">
                  <select className="appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer w-full focus:outline-none">
                    <option>468×60</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-3 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Upload Banner */}
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Upload Banner Image
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-xl py-10 flex flex-col items-center justify-center text-center mb-6 cursor-pointer hover:bg-gray-50">
              <div className="bg-red-100 text-red-500 p-3 rounded-full mb-3">
                <FiUpload size={22} />
              </div>
              <p className="text-gray-700 text-sm font-medium">
                Click to upload banner image
              </p>
              <p className="text-gray-400 text-xs mt-1">PNG, JPG up to 2MB</p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Affiliate link
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/..."
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Tracking URL
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/..."
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none"
                />
              </div>
            </div>

            {/* Country + Region */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Target Country
                </label>
                <div className="relative">
                  <select className="appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm w-full cursor-pointer focus:outline-none">
                    <option>Select Country</option>
                    <option>United States</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-3 text-gray-500" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Target Region
                </label>
                <input
                  type="text"
                  placeholder="e.g., New York, California"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none"
                />
              </div>
            </div>

            {/* Dates + Rotation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none"
                  />
                  <FiCalendar className="absolute right-3 top-3 text-gray-500" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none"
                  />
                  <FiCalendar className="absolute right-3 top-3 text-gray-500" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Rotation Weight (%)
                </label>
                <input
                  type="number"
                  defaultValue={10}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setOpenModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-100"
              >
                Cancel
              </button>

              <button className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium">
                Upload Banner
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --------------------- END MODAL --------------------- */}
    </div>
  );
}
