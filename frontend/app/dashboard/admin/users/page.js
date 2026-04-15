"use client";

import { useMemo, useState } from "react";
import { useGetAllUserQuery, useUpdateUserByIdMutation } from "@/feature/UserApi";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa6";
import { FiSearch, FiUsers } from "react-icons/fi";
import { MdOutlineWorkspacePremium } from "react-icons/md";

export default function Users() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const queryParams = useMemo(
    () => ({
      searchKey: search || undefined,
      isActive:
        statusFilter === "active" ? "true" : statusFilter === "inactive" ? "false" : undefined,
    }),
    [search, statusFilter]
  );

  const { data, isLoading } = useGetAllUserQuery(queryParams);
  const [updateUserById, { isLoading: isSaving }] = useUpdateUserByIdMutation();

  const users = data?.data?.users || [];
  const totalUsers = data?.data?.totalData || users.length;
  const activeUsers = users.filter((user) => user.isActive).length;
  const premiumUsers = users.filter((user) => user.role === "ADMIN").length;

  const handleToggleStatus = async (user) => {
    try {
      await updateUserById({
        id: user._id,
        body: {
          isActive: !user.isActive,
        },
      }).unwrap();

      toast.success(`${user.firstName} ${user.lastName} is now ${!user.isActive ? "active" : "inactive"}.`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update user status");
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center font-medium">Loading users...</div>;
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen p-4">
      <h1 className="text-[22px] font-semibold mb-6">Users</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white flex justify-between items-center rounded-xl p-5 shadow-sm">
          <div>
            <p>Total Users</p>
            <span className="text-2xl font-semibold">{totalUsers}</span>
          </div>
          <FiUsers className="text-blue-600 text-3xl" />
        </div>

        <div className="bg-white flex justify-between items-center rounded-xl p-5 shadow-sm">
          <div>
            <p>Active Users</p>
            <span className="text-2xl font-semibold">{activeUsers}</span>
          </div>
          <FaCheck className="text-green-600 text-3xl" />
        </div>

        <div className="bg-white flex justify-between items-center rounded-xl p-5 shadow-sm">
          <div>
            <p>Admin Users</p>
            <span className="text-2xl font-semibold">{premiumUsers}</span>
          </div>
          <MdOutlineWorkspacePremium className="text-pink-500 text-3xl" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="w-full space-y-2">
            <p>Search Users</p>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or phone..."
                className="w-full border border-gray-200 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <p>Status Filter</p>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 p-3 rounded-lg text-sm w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 text-xl font-medium">Users ({users.length})</div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 uppercase text-[11px] tracking-[0.12em]">
                <th className="py-6 pl-4 text-left">Name</th>
                <th className="py-6 pl-4 text-left">Email</th>
                <th className="py-6 pl-4 text-left">Phone</th>
                <th className="py-6 pl-4 text-left">Role</th>
                <th className="py-6 pl-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-6 pl-4">
                    <div className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                  </td>
                  <td className="py-6 pl-4 text-gray-600">{user.email}</td>
                  <td className="py-6 pl-4 text-gray-600">{user.phoneNumber}</td>
                  <td className="py-6 pl-4">
                    <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-[11px] font-bold">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-6 pl-4">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      disabled={isSaving}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition ${
                        user.isActive
                          ? "bg-green-50 text-green-600 hover:bg-green-100"
                          : "bg-red-50 text-red-500 hover:bg-red-100"
                      }`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${user.isActive ? "bg-green-500" : "bg-red-400"}`} />
                      {user.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="py-16 text-center text-gray-400 font-medium">No users found.</div>
        )}
      </div>
    </div>
  );
}
