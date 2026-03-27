"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  useGetAdminTestimonialsQuery,
  useUpdateTestimonialStatusMutation,
} from "@/feature/TestimonialApi";
import { FiChevronDown, FiSearch, FiStar } from "react-icons/fi";

const STATUS_STYLES = {
  APPROVED: "bg-green-50 text-green-600 border border-green-200",
  PENDING: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  REJECTED: "bg-red-50 text-red-500 border border-red-200",
};

export default function TestimonialsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, isLoading } = useGetAdminTestimonialsQuery({
    searchKey: search || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
  });
  const [updateStatus, { isLoading: isSaving }] = useUpdateTestimonialStatusMutation();

  const stats = useMemo(
    () => {
      const testimonials = data?.data || [];
      return {
      total: testimonials.length,
      approved: testimonials.filter((item) => item.status === "APPROVED").length,
      pending: testimonials.filter((item) => item.status === "PENDING").length,
      };
    },
    [data?.data]
  );

  const testimonials = data?.data || [];

  const handleAction = async (id, status) => {
    try {
      await updateStatus({ id, body: { status } }).unwrap();
      toast.success(`Testimonial ${status === "APPROVED" ? "approved" : "rejected"} successfully.`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update testimonial.");
    }
  };

  return (
    <div className="px-2 py-6 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Testimonials</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review user-submitted testimonials before they appear on the public site.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MiniStat label="Total" value={stats.total} />
        <MiniStat label="Approved" value={stats.approved} />
        <MiniStat label="Pending" value={stats.pending} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer focus:outline-none w-40"
              >
                <option value="all">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
            </div>

            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search testimonials..."
                className="border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm w-56 placeholder-gray-400 focus:outline-none"
              />
              <FiSearch className="absolute right-3 top-3 text-gray-500" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-sm text-gray-500">Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div className="py-12 text-sm text-gray-400">No testimonials found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((item) => (
              <div
                key={item._id}
                className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.email}</p>
                    <p className="text-sm text-gray-500">
                      {[item.location, item.title].filter(Boolean).join(" | ") || "No extra details"}
                    </p>
                  </div>

                  <div className="flex text-yellow-400">
                    {Array.from({ length: item.rating || 0 }).map((_, index) => (
                      <FiStar key={index} className="fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-700 mt-4 leading-relaxed">{item.review}</p>

                <div className="flex items-center justify-between mt-4 gap-3 flex-wrap">
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <span
                      className={`inline-flex mt-2 px-3 py-1 rounded-md text-xs font-medium ${
                        STATUS_STYLES[item.status] || "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status !== "APPROVED" && (
                      <button
                        onClick={() => handleAction(item._id, "APPROVED")}
                        disabled={isSaving}
                        className="px-3 py-1 rounded-md text-xs font-medium bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
                      >
                        Approve
                      </button>
                    )}

                    {item.status !== "REJECTED" && (
                      <button
                        onClick={() => handleAction(item._id, "REJECTED")}
                        disabled={isSaving}
                        className="px-3 py-1 rounded-md text-xs font-medium bg-red-50 text-red-500 border border-red-200 hover:bg-red-100"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
