"use client";

import { useState } from "react";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";
import { LiaUserEditSolid } from "react-icons/lia";
import { FaCheck } from "react-icons/fa6";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { useDeleteUserMutation, useGetAllUserQuery, useUpdateUserMutation } from "@/feature/UserApi";
import toast from "react-hot-toast";

export default function Users() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser] = useDeleteUserMutation();

  const { data, isLoading } = useGetAllUserQuery();
  const users = data?.data || [];
  console.log(users);

  const [updateUser, { isError, error }] = useUpdateUserMutation();

  if (isError) {
    console.log(error, "error kha ");
  }

  if (isLoading) {
    return <span className="loading loading-dots loading-xl"></span>;
  }

  // Save Button Handler
  const handleSave = async () => {
    try {
      await updateUser({
        email: selectedUser.email, // backend requires email
        body: {
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          phoneNumber: selectedUser.phoneNumber,
          status: selectedUser.status,
        },
      });

      setOpenModal(false);
    } catch (error) {
      console.log("Update failed", error);
    }
  };

  const handleDeleteUser = async (id) => {
    console.log(id);
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete User");
    }
  };

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
                <th className="py-6 pl-4 text-left">Name</th>
                <th className="py-6 pl-4 text-left">email</th>
                <th className="py-6 pl-4 text-left">Phone</th>
                <th className="py-6 text-left">Status</th>
                <th className="py-6 pr-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-6 pl-4">
                    {user?.firstName} {user?.lastName}
                  </td>
                  <td className="py-6 pl-4">{user.email}</td>
                  <td className="py-6 pl-4">{user.phoneNumber}</td>

                  <td>
                    <span
                      className={`px-2 py-[3px] ${
                        user?.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-500"
                      } text-[11px] rounded-md`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="py-6 pr-4 flex items-center justify-end gap-4">
                    <FiEdit
                      className="text-blue-600 cursor-pointer"
                      onClick={() => {
                        setSelectedUser({
                          id: user._id,
                          firstName: user.firstName,
                          lastName: user.lastName,
                          email: user.email,
                          status: user.status,
                          phoneNumber: user?.phoneNumber,
                        });
                        setOpenModal(true);
                      }}
                    />

                    <FiTrash2
                      onClick={() => {
                        handleDeleteUser(user?._id);
                      }}
                      className="text-red-500 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------- MODAL ---------- */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] px-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
              <h2 className="text-[20px]">
                Edit User:{" "}
                <span className="font-normal">{selectedUser?.firstName}</span>
              </h2>

              <FiX
                className="text-gray-600 text-xl cursor-pointer"
                onClick={() => setOpenModal(false)}
              />
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <input
                  value={selectedUser?.firstName}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      firstName: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <input
                  value={selectedUser?.lastName}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      lastName: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  disabled
                  readOnly
                  value={selectedUser?.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <input
                  value={selectedUser?.phoneNumber}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
              </div>
            </div>
            <label className="text-sm font-medium">Status</label>
            <select
              value={selectedUser?.status}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  status: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenModal(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
