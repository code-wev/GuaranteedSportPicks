"use client";

import {
  useGetMyPickPurchasesQuery,
  useGetMySubscriptionHistoryQuery,
  useCancelSubscriptionMutation,
} from "@/feature/PaymentApi";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaBan,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";

const STATUS_BADGE = {
  PAID: { label: "Paid", color: "bg-green-100 text-green-700", icon: <FaCheckCircle className="inline mr-1" /> },
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: <FaClock className="inline mr-1" /> },
  CANCELLED: { label: "Cancelled", color: "bg-gray-100 text-gray-600", icon: <FaBan className="inline mr-1" /> },
  FAILED: { label: "Failed", color: "bg-red-100 text-red-600", icon: <FaTimesCircle className="inline mr-1" /> },
  EXPIRED: { label: "Expired", color: "bg-orange-100 text-orange-600", icon: <FaTimesCircle className="inline mr-1" /> },
  AUTHORIZED: { label: "Authorized", color: "bg-purple-100 text-purple-700", icon: <FaClock className="inline mr-1" /> },
  REFUNDED: { label: "Refunded", color: "bg-red-100 text-red-600", icon: <FaTimesCircle className="inline mr-1" /> },
};

function fmt(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PurchaseHistory() {
  const [pageNo, setPageNo] = useState(1);
  const [cancelId, setCancelId] = useState(null);
  const [cancelError, setCancelError] = useState("");

  const { data, isLoading, isFetching, refetch } = useGetMySubscriptionHistoryQuery(
    { pageNo, showPerPage: 10 },
    { refetchOnMountOrArgChange: true }
  );
  const { data: pickPurchaseData, isLoading: isLoadingPickPurchases } = useGetMyPickPurchasesQuery();
  const [cancelSubscription, { isLoading: cancelling }] = useCancelSubscriptionMutation();

  const subscriptions = data?.data?.subscriptions || [];
  const pickPurchases = pickPurchaseData?.data || [];
  const totalPages = data?.data?.totalPages || 1;

  const records = useMemo(() => {
    const subscriptionRecords = subscriptions.map((sub) => ({
      id: `subscription-${sub._id}`,
      source: "SUBSCRIPTION",
      itemName: `${sub.packageName} Plan`,
      sport: sub.selectedSport?.join(", ") || "-",
      amount: Number(sub.price || 0),
      status: sub.status,
      method: sub.isSeasonal ? "ONE_TIME" : "RECURRING",
      canCancel: sub.status === "PAID" && sub.isSubscribed,
      subscriptionId: sub._id,
      start: sub.subscriptionStart,
      end: sub.subscriptionEnd,
      createdAt: sub.createdAt,
    }));

    const pickRecords = pickPurchases.map((purchase) => {
      const pickObj = purchase.pickId && typeof purchase.pickId === "object" ? purchase.pickId : null;
      const awayTeam = pickObj?.away_team || purchase?.pickSnapshot?.awayTeam || "Unknown";
      const homeTeam = pickObj?.home_team || purchase?.pickSnapshot?.homeTeam || "Pick";
      const sportTitle = pickObj?.sport_title || purchase?.pickSnapshot?.sportTitle || "-";

      return {
        id: `pick-${purchase._id}`,
        source: "PICK",
        itemName: `${awayTeam} @ ${homeTeam}`,
        sport: sportTitle,
        amount: Number(purchase.price || 0),
        status: purchase.status,
        method: purchase.paymentModel,
        canCancel: false,
        start: purchase.purchasedAt,
        end: purchase.capturedAt || purchase.cancelledAt,
        createdAt: purchase.createdAt,
      };
    });

    return [...subscriptionRecords, ...pickRecords].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [subscriptions, pickPurchases]);

  const handleCancel = async (id) => {
    setCancelError("");
    try {
      await cancelSubscription(id).unwrap();
      refetch();
      setCancelId(null);
    } catch (err) {
      setCancelError(err?.data?.message || "Failed to cancel. Please try again.");
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl lg:text-[28px] font-semibold">Payment & Purchase History</h2>
          <p className="text-gray-500 text-sm mt-1">
            Subscription and pick purchase records in one place.
          </p>
        </div>
        <Link
          href="/dashboard/purchase"
          className="bg-[#B91C1C] hover:bg-red-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
        >
          + New Purchase
        </Link>
      </div>

      {isLoading || isFetching || isLoadingPickPurchases ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B91C1C]" />
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-sm mb-4">No purchase records found yet.</p>
          <Link
            href="/dashboard/purchase"
            className="inline-block bg-[#B91C1C] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-red-800 transition text-sm"
          >
            Buy Now
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left">
              <thead className="bg-[#F9FAFB]">
                <tr className="text-gray-500 text-xs font-semibold uppercase border-b border-gray-100">
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Item</th>
                  <th className="px-5 py-4">Sport(s)</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Method</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => {
                  const badge = STATUS_BADGE[record.status] || STATUS_BADGE["PENDING"];

                  return (
                    <tr
                      key={record.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition text-sm"
                    >
                      <td className="px-5 py-4 text-gray-700 font-semibold">{record.source}</td>
                      <td className="px-5 py-4 text-gray-800 font-medium">{record.itemName}</td>
                      <td className="px-5 py-4 text-gray-600">{record.sport}</td>
                      <td className="px-5 py-4 font-semibold text-[#B91C1C]">${record.amount.toFixed(2)}</td>
                      <td className="px-5 py-4 text-xs text-gray-600 font-semibold uppercase">{record.method}</td>
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{fmt(record.start)}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.color}`}>
                          {badge.icon}
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {record.canCancel ? (
                          cancelId === record.subscriptionId ? (
                            <div className="flex flex-col gap-1">
                              <p className="text-xs text-red-600 font-medium">Sure?</p>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleCancel(record.subscriptionId)}
                                  disabled={cancelling}
                                  className="text-xs bg-red-600 text-white px-2 py-1 rounded-md disabled:opacity-60"
                                >
                                  {cancelling ? "..." : "Yes"}
                                </button>
                                <button
                                  onClick={() => {
                                    setCancelId(null);
                                    setCancelError("");
                                  }}
                                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md"
                                >
                                  No
                                </button>
                              </div>
                              {cancelError && <p className="text-xs text-red-500">{cancelError}</p>}
                            </div>
                          ) : (
                            <button
                              onClick={() => setCancelId(record.subscriptionId)}
                              className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 transition"
                            >
                              <MdOutlineCancel className="text-base" /> Cancel
                            </button>
                          )
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Page {pageNo} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPageNo((p) => Math.max(1, p - 1))}
                  disabled={pageNo === 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition"
                >
                  <FaChevronLeft className="text-xs" /> Prev
                </button>
                <button
                  onClick={() => setPageNo((p) => Math.min(totalPages, p + 1))}
                  disabled={pageNo === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition"
                >
                  Next <FaChevronRight className="text-xs" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
