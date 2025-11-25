"use client";

import { useState } from "react";
import { FiUser, FiCheck, FiEdit, FiTrash2, FiX } from "react-icons/fi";
import { LiaUserEditSolid } from "react-icons/lia";
import { FaCheck } from "react-icons/fa6";
import { MdOutlineWorkspacePremium } from "react-icons/md";

export default function Users() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    { id: 1, name: "Warriors lakers", status: "Active", payType: "PREMIUM", purchases: 8 },
    { id: 2, name: "Warriors lakers", status: "Active", payType: "PREMIUM", purchases: 12 },
    { id: 3, name: "Warriors lakers", status: "Active", payType: "Free", purchases: 2 },
    { id: 4, name: "Warriors lakers", status: "Active", payType: "PREMIUM", purchases: 15 },
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen p-4">
      <h1 className="text-[22px] font-semibold mb-6">Users</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white flex justify-between items-center rounded-xl p-5 shadow-sm">
          <div>
            <p>Total Users</p>
            <span className="text-2xl font-semibold">04</span>
          </div>
          <LiaUserEditSolid className="text-blue-600 text-3xl" />
        </div>

        <div className="bg-white flex justify-between items-center rounded-xl p-5 shadow-sm">
          <div>
            <p>Active Users</p>
            <span className="text-2xl font-semibold">03</span>
          </div>
          <FaCheck className="text-green-600 text-3xl" />
        </div>

        <div className="bg-white flex justify-between items-center rounded-xl p-5 shadow-sm">
          <div>
            <p>Premium Users</p>
            <span className="text-2xl font-semibold">02</span>
          </div>
          <MdOutlineWorkspacePremium className="text-pink-500 text-3xl" />
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="w-full space-y-2">
            <p>Search Users</p>
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <p>Status Filter</p>
            <select className="border border-gray-200 p-3 rounded-lg text-sm w-full sm:w-40">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 text-xl font-medium">Users ({users.length})</div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 uppercase text-[11px] tracking-[0.12em]">
                <th className="py-6 pl-4 text-left">User</th>
                <th className="py-6 text-left">Status</th>
                <th className="py-6 text-left">Pay Types</th>
                <th className="py-6 text-left">Purchases</th>
                <th className="py-6 pr-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-6 pl-4">{u.name}</td>

                  <td>
                    <span className="px-2 py-[3px] bg-green-100 text-green-600 text-[11px] rounded-md">
                      ● {u.status}
                    </span>
                  </td>

                  <td className="py-6">
                    {u.payType === "PREMIUM" ? (
                      <span className="px-2 py-[3px] bg-blue-100 text-blue-600 text-[11px] rounded-md">
                        PREMIUM
                      </span>
                    ) : (
                      <span className="px-2 py-[3px] bg-gray-200 text-gray-600 text-[11px] rounded-md">
                        Free
                      </span>
                    )}
                  </td>

                  <td>{u.purchases}</td>

                  <td className="py-6 pr-4 flex items-center justify-end gap-4">
                    <FiEdit
                      className="text-blue-600 cursor-pointer"
                      onClick={() => {
                        setSelectedUser(u);
                        setOpenModal(true);
                      }}
                    />
                    <FiTrash2 className="text-red-500 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --------------- MODAL ---------------- */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] px-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
              <h2 className="text-[20px]">
                Edit Users: <span className="font-normal">{selectedUser?.name}</span>
              </h2>
              <FiX
                className="text-gray-600 text-xl cursor-pointer"
                onClick={() => setOpenModal(false)}
              />
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  defaultValue={selectedUser?.name}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  placeholder="john.smith@gmail.com"
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="text-sm font-medium">Status</label>
                <select className="w-full border border-gray-300 rounded-md p-2 mt-1">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenModal(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>

              <button className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
