"use client";

import EditPickModal from "@/components/Dashboard/admin/EditPickModal";
import { useDeletePicksMutation, useGetAdminPicksQuery } from "@/feature/PicksApi";
import Link from "next/link";
import { useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiEdit,
  FiSearch,
  FiTrash2,
  FiTrendingUp,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

export default function PickManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPick, setSelectedPick] = useState(null);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const showPerPage = 10;

  const { data, isLoading, isError, error } = useGetAdminPicksQuery({
    pageNo: page,
    showPerPage: showPerPage,
    searchKey: search
  });
  if(isError){
    console.log(error, 'error ');
  }
  
  const [deletePick] = useDeletePicksMutation();

  const picks = data?.data?.pickss || [];

  const totalPages = data?.data?.totalPages || 1;
  const totalData = data?.data?.totalData || 0;

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this pick?")) {
      try {
        await deletePick(id).unwrap();
        alert("Pick deleted successfully");
      } catch (err) {
        alert("Failed to delete pick");
      }
    }
  };

  const handleEdit = (pick) => {
    setSelectedPick(pick);
    setIsEditModalOpen(true);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const filteredPicks = picks.filter((pick) => {
    const matchesStatus = statusFilter === "All" || pick.status === statusFilter.toLowerCase();
    return matchesStatus;
  });

  const gradedPicks = picks.filter(p => p.result === 'win' || p.result === 'loss');
  const stats = {
    active: data?.data?.totalActivePicks || 0,
    pending: picks.filter(p => p.status === 'pending').length, // This is only for current page, ideally should come from backend
    winRate: gradedPicks.length > 0 
      ? Math.round((picks.filter(p => p.result === 'win').length / gradedPicks.length) * 100) 
      : 0
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Pick Management</h1>
        <Link href="/dashboard/admin/new-picks" className="bg-[#DC2626] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md shadow-red-100 flex items-center gap-2">
          <span>+</span> New Pick
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Active Picks" 
          value={stats.active}
          icon={FiCheckCircle}
          iconColor="text-green-500"
          bgColor="bg-green-50"
        />
        <StatCard
          title="Current Page Pending"
          value={stats.pending}
          icon={FiClock}
          iconColor="text-yellow-500"
          bgColor="bg-yellow-50"
        />
        <StatCard
          title="Current Page Win Rate"
          value={`${stats.winRate}%`}
          icon={FiTrendingUp}
          iconColor="text-blue-500"
          bgColor="bg-blue-50"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold text-gray-800">All Picks</h2>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option>All</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Close</option>
              </select>
            </div>

            <div className="relative w-full lg:w-96">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by team or sport..."
                value={search}
                onChange={handleSearch}
                className="w-full border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-4 py-4">Matchup</th>
                <th className="px-4 py-4">Sport</th>
                <th className="px-4 py-4">Pick Details</th>
                <th className="px-4 py-4">Units</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Result</th>
                <th className="px-4 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading picks...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPicks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-gray-500">
                    No picks found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredPicks.map((pick) => (
                  <tr key={pick._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">
                          {pick.away_team}{" "}
                          <span className="text-[#B91C1C]">VS</span>{" "}
                          {pick.home_team}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(pick.commence_time).toLocaleDateString()} {new Date(pick.commence_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{pick.sport_title}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-red-600">{pick.selected_team}</span>
                        <span className="text-xs text-gray-500 capitalize">{pick.market_type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-medium text-xs">
                        {pick.units}u
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        pick.status === "active" ? "bg-green-100 text-green-700" : 
                        pick.status === "pending" ? "bg-yellow-100 text-yellow-700" : 
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {pick.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        pick.result === "win" ? "bg-green-100 text-green-700" : 
                        pick.result === "loss" ? "bg-red-100 text-red-700" : 
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {pick.result || 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(pick)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Pick"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(pick._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Pick"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer/Pagination */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs text-gray-500 font-medium">
            Showing {(page - 1) * showPerPage + 1} to {Math.min(page * showPerPage, totalData)} of {totalData} picks
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`p-2 border border-gray-200 rounded-lg bg-white text-gray-600 transition-colors ${
                page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              <FiChevronLeft size={16} />
            </button>
            
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Show current page, first, last, and pages around current
                if (
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        page === pageNum 
                          ? "bg-red-600 text-white shadow-md shadow-red-100" 
                          : "bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  (pageNum === page - 2 && pageNum > 1) || 
                  (pageNum === page + 2 && pageNum < totalPages)
                ) {
                  return <span key={pageNum} className="px-1 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>

            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`p-2 border border-gray-200 rounded-lg bg-white text-gray-600 transition-colors ${
                page === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <EditPickModal 
        pick={selectedPick}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, iconColor, bgColor }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between shadow-sm`}>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${bgColor} ${iconColor}`}>
        <Icon size={24} />
      </div>
    </div>
  );
}
