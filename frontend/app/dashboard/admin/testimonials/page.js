"use client";

import { FiChevronDown, FiSearch } from "react-icons/fi";
import { FiStar } from "react-icons/fi";

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: "John Smith",
      email: "john.smith@email.com",
      location: "New York",
      review:
        "guaranteedsportpicks has completely changes my betting game. their analysis is spot-on and ive been profitable for 3 months straight!",
      date: "2024-01-15",
      approved: true,
    },
    {
      name: "John Smith",
      email: "john.smith@email.com",
      location: "New York",
      review:
        "guaranteedsportpicks has completely changes my betting game. their analysis is spot-on and ive been profitable for 3 months straight!",
      date: "2024-01-15",
      approved: true,
    },
    {
      name: "John Smith",
      email: "john.smith@email.com",
      location: "New York",
      review:
        "guaranteedsportpicks has completely changes my betting game. their analysis is spot-on and ive been profitable for 3 months straight!",
      date: "2024-01-15",
      approved: false,
    },
  ];

  return (
    <div className="px-2 py-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold mb-6">Testimonials</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {/* <h2 className="text-lg font-semibold">Blog Post (0{testimonials.length})</h2> */}

          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <div className="relative">
              <select className="appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer focus:outline-none w-40">
                <option>All Status</option>
                <option>Approved</option>
                <option>Pending</option>
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search blogs..."
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48 placeholder-gray-400 focus:outline-none"
              />
              <FiSearch className="absolute right-3 top-3 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-gray-600">{t.email}</p>
                  <p className="text-sm text-gray-500">{t.location}</p>
                </div>

                {/* Rating Stars */}
                <div className="flex text-yellow-400">
                  <FiStar />
                  <FiStar />
                  <FiStar />
                  <FiStar />
                  <FiStar />
                </div>
              </div>

              {/* Review Text */}
              <p className="text-sm text-gray-700 mt-4 leading-relaxed">
                {t.review}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">{t.date}</p>

                <div className="flex items-center gap-2">
                  {t.approved && (
                    <span className="px-3 py-1 rounded-md text-xs font-medium bg-green-50 text-green-600 border border-green-200">
                      ✓ Approved
                    </span>
                  )}

                  {!t.approved && (
                    <>
                      <span className="px-3 py-1 rounded-md text-xs font-medium bg-green-50 text-green-600 border border-green-200">
                        ✓ Approved
                      </span>
                      <span className="px-3 py-1 rounded-md text-xs font-medium bg-red-50 text-red-500 border border-red-200">
                        ✕ Reject
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
