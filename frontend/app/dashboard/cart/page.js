"use client";

import { useMemo } from "react";
import {
  useGetMyPickPurchasesQuery,
  useGetMySubscriptionHistoryQuery,
} from "@/feature/PaymentApi";
import Link from "next/link";

const statusTone = {
  PAID: "bg-green-100 text-green-700",
  AUTHORIZED: "bg-purple-100 text-purple-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-gray-100 text-gray-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-red-100 text-red-700",
  EXPIRED: "bg-orange-100 text-orange-700",
};

export default function CartPage() {
  const { data: subData, isLoading: isLoadingSub } = useGetMySubscriptionHistoryQuery({
    pageNo: 1,
    showPerPage: 100,
  });
  const { data: pickData, isLoading: isLoadingPick } = useGetMyPickPurchasesQuery();

  const rows = useMemo(() => {
    const subscriptions = (subData?.data?.subscriptions || []).map((sub) => ({
      id: `sub-${sub._id}`,
      type: "Subscription",
      item: `${sub.packageName} Plan`,
      status: sub.status,
      amount: Number(sub.price || 0),
      createdAt: sub.createdAt,
    }));

    const picks = (pickData?.data || []).map((purchase) => {
      const pick = purchase.pickId && typeof purchase.pickId === "object" ? purchase.pickId : null;
      const awayTeam = pick?.away_team || purchase?.pickSnapshot?.awayTeam || "Unknown";
      const homeTeam = pick?.home_team || purchase?.pickSnapshot?.homeTeam || "Pick";

      return {
        id: `pick-${purchase._id}`,
        type: "Pick",
        item: `${awayTeam} @ ${homeTeam}`,
        status: purchase.status,
        amount: Number(purchase.price || 0),
        createdAt: purchase.createdAt,
      };
    });

    return [...subscriptions, ...picks].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [subData, pickData]);

  const totalSpent = rows
    .filter((row) => row.status === "PAID")
    .reduce((sum, row) => sum + row.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Cart & Purchase Tracker</h1>
          <p className="text-sm text-gray-500 mt-1">
            See what you bought and each payment status (paid, authorized, pending, cancelled).
          </p>
        </div>
        <Link
          href="/dashboard/purchase"
          className="bg-[#B91C1C] text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-800"
        >
          Buy More Picks
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total Records" value={rows.length} />
        <Card title="Paid Items" value={rows.filter((row) => row.status === "PAID").length} />
        <Card title="Total Paid" value={`$${totalSpent.toFixed(2)}`} />
      </div>

      {isLoadingSub || isLoadingPick ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">Loading cart...</div>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
          No cart/purchase records yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500 uppercase text-xs">
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold text-gray-700">{row.type}</td>
                    <td className="px-5 py-4 text-gray-800">{row.item}</td>
                    <td className="px-5 py-4 font-semibold text-[#B91C1C]">${row.amount.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          statusTone[row.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}
