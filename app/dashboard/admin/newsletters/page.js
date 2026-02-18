"use client";

import { useState } from "react";
import {
  FiEye,
  FiCopy,
  FiX,
  FiBold,
  FiItalic,
  FiUnderline,
  FiLink,
  FiList,
//   FiListOl,
  FiClock,
} from "react-icons/fi";

export default function Newsletters() {
  const [openModal, setOpenModal] = useState(false);

  const campaigns = [
    {
      title: "Weekly NFL Picks - Week 12",
      desc: "Your Weekly NFL Picks are here!",
      date: "2025-05-01",
      recipients: 2847,
      status: "Sent",
    },
    {
      title: "NBA Player Props - Special",
      desc: "Your Weekly NFL Picks are here!",
      date: "2025-05-01",
      recipients: 2897,
      status: "Sent",
    },
    {
      title: "NBA Player Props Special",
      desc: "Your Weekly NFL Picks are here!",
      date: "2025-05-01",
      recipients: 6847,
      status: "Sent",
    },
    {
      title: "March Madness Previews",
      desc: "Your Weekly NFL Picks are here!",
      date: "2025-05-01",
      recipients: 2847,
      status: "Sent",
    },
  ];

  return (
    <div className="min-h-screen p-6 md:p-10 bg-white">

      {/* Inline Keyframes — NO globals.css needed */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Newsletter Management</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-red-500 hover:bg-red-600 transition text-white px-3 py-1.5 md:px-5 md:py-2.5 rounded-lg font-medium flex items-center gap-2"
        >
          <span className="text-xl">+</span> Compose Newsletter
        </button>
      </div>

      {/* CAMPAIGN TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Campaign History</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-gray-500 text-sm border-b border-gray-300">
                <th className="pb-6">CAMPAIGN</th>
                <th className="pb-6">SENT DATE</th>
                <th className="pb-6">RECIPIENTS</th>
                <th className="pb-6">STATUS</th>
                <th className="pb-6">Action</th>
              </tr>
            </thead>

            <tbody>
              {campaigns.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-300 last:border-none text-sm hover:bg-gray-50 transition"
                >
                  <td className="py-6">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-gray-500">{item.desc}</p>
                  </td>

                  <td className="py-6">{item.date}</td>
                  <td className="py-6">{item.recipients}</td>

                  <td className="py-6">
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-md text-xs font-medium">
                      {item.status}
                    </span>
                  </td>

                  <td className="py-4">
                    <div className="flex items-center gap-4 text-gray-600">
                      <FiEye className="cursor-pointer hover:text-black transition" />
                      <FiCopy className="cursor-pointer hover:text-black transition" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 animate-[fadeIn_0.2s_ease-out]">

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Compose Newsletter</h2>
              <FiX
                className="text-2xl cursor-pointer hover:text-red-500 transition"
                onClick={() => setOpenModal(false)}
              />
            </div>

            {/* Campaign Title + Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Campaign Title</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email Subject</label>
                <input
                  type="text"
                  placeholder="Email Subject"
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>

            {/* EMAIL BODY */}
            <div className="mt-5">
              <label className="block text-sm font-medium mb-1">Email Body</label>

              <div className="flex items-center gap-3 border px-3 py-2 rounded-t-lg">
                <FiBold />
                <FiItalic />
                <FiUnderline />
                <FiLink />
                <FiList />
                {/* <FiListOl /> */}
              </div>

              <textarea
                placeholder="Write your newsletter content here..."
                className="w-full border border-t-0 rounded-b-lg px-3 py-3 text-sm min-h-[120px] outline-none resize-none"
              ></textarea>
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div>
                <label className="block text-sm font-medium mb-1">Schedule Date (Optional)</label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Schedule Time (Optional)</label>
                <div className="relative">
                  <input
                    type="time"
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
                  />
                  <FiClock className="absolute right-3 top-3 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Picks Analysis */}
            <div className="mt-5">
              <label className="block text-sm font-medium mb-1">Picks Analysis</label>

              <div className="flex items-center gap-3 border px-3 py-2 rounded-t-lg">
                <FiBold />
                <FiItalic />
                <FiUnderline />
                <FiLink />
                <FiList />
                {/* <FiListOl /> */}
              </div>

              <textarea
                placeholder="Write your detailed analysis and reasoning for this pick..."
                className="w-full border border-t-0 rounded-b-lg px-3 py-3 text-sm min-h-[120px] outline-none resize-none"
              ></textarea>
            </div>

            {/* FOOTER BUTTONS */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setOpenModal(false)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 transition rounded-lg"
              >
                Cancel
              </button>

              <button className="px-5 py-2 bg-red-500 hover:bg-red-600 transition rounded-lg text-white">
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
