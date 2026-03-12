"use client";

import {
  useCancelSubscriptionMutation,
  useGetMySubscriptionQuery,
} from "@/feature/PaymentApi";
import Link from "next/link";
import { useState } from "react";
import {
  FaBan,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaShoppingCart,
  FaTimesCircle,
} from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";

const STATUS_CONFIG = {
  PAID: {
    label: "Active",
    color: "bg-green-100 text-green-700",
    icon: <FaCheckCircle className='inline mr-1' />,
  },
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    icon: <FaClock className='inline mr-1' />,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-600",
    icon: <FaBan className='inline mr-1' />,
  },
  FAILED: {
    label: "Failed",
    color: "bg-red-100 text-red-600",
    icon: <FaTimesCircle className='inline mr-1' />,
  },
  EXPIRED: {
    label: "Expired",
    color: "bg-orange-100 text-orange-600",
    icon: <FaTimesCircle className='inline mr-1' />,
  },
};

function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function MySubscriptionPage() {
  const { data, isLoading, isError, refetch } = useGetMySubscriptionQuery();
  const [cancelSubscription, { isLoading: cancelling }] =
    useCancelSubscriptionMutation();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const sub = data?.data;

  const handleCancel = async () => {
    if (!sub?._id) return;
    setErrorMsg("");
    try {
      await cancelSubscription(sub._id).unwrap();
      setSuccessMsg("Your subscription has been cancelled successfully.");
      setConfirmCancel(false);
      refetch();
    } catch (err) {
      setErrorMsg(err?.data?.message || "Failed to cancel. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-[#B91C1C]' />
      </div>
    );
  }

  const statusInfo = STATUS_CONFIG[sub?.status] || STATUS_CONFIG["PENDING"];
  const isActive = sub?.status === "PAID" && sub?.isSubscribed;
  const isRecurring = sub && !sub.isSession && sub.stripeSubscriptionId;

  return (
    <div className='w-full px-4 md:px-8 py-6 max-w-3xl mx-auto'>
      <h2 className='text-2xl md:text-3xl font-bold mb-2'>My Subscription</h2>
      <p className='text-gray-500 mb-8'>
        Manage your current subscription plan
      </p>

      {/* ── Success/Error Messages ──────────────────── */}
      {successMsg && (
        <div className='mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 flex items-center gap-2'>
          <FaCheckCircle /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className='mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3'>
          {errorMsg}
        </div>
      )}

      {/* ── No Subscription ────────────────────────── */}
      {!sub || isError ? (
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center'>
          <div className='w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4'>
            <FaShoppingCart className='text-gray-400 text-2xl' />
          </div>
          <h3 className='text-lg font-semibold text-gray-700 mb-2'>
            No Active Subscription
          </h3>
          <p className='text-gray-400 text-sm mb-6'>
            You don&apos;t have any subscription yet. Browse our plans and get
            started today.
          </p>
          <Link
            href='/packages'
            className='inline-block bg-[#B91C1C] hover:bg-red-800 text-white font-semibold px-6 py-3 rounded-xl transition'>
            View Plans
          </Link>
        </div>
      ) : (
        <>
          {/* ── Subscription Card ──────────────────── */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6'>
            <div className='flex items-start justify-between mb-5'>
              <div>
                <h3 className='text-xl font-bold text-gray-800 capitalize'>
                  {sub.packageName?.charAt(0) +
                    sub.packageName?.slice(1).toLowerCase()}{" "}
                  Plan
                  {sub.isSession && ` (${sub.customDays} days)`}
                </h3>
                <p className='text-sm text-gray-500 mt-1'>
                  {sub.isSession
                    ? "One-time sessional payment"
                    : "Recurring subscription"}
                </p>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusInfo.color}`}>
                {statusInfo.icon}
                {statusInfo.label}
              </span>
            </div>

            <div className='grid grid-cols-2 gap-4 text-sm'>
              <InfoRow
                icon={<FaCalendarAlt className='text-[#B91C1C]' />}
                label='Start Date'
                value={fmt(sub.subscriptionStart)}
              />
              <InfoRow
                icon={<FaCalendarAlt className='text-[#B91C1C]' />}
                label='End Date'
                value={fmt(sub.subscriptionEnd)}
              />
              {isRecurring && (
                <InfoRow
                  icon={<FaClock className='text-[#B91C1C]' />}
                  label='Next Billing'
                  value={fmt(sub.nextBilling)}
                />
              )}
              <InfoRow
                icon={<span className='text-[#B91C1C] font-bold'>$</span>}
                label='Price Paid'
                value={`$${sub.price?.toFixed(2)}`}
              />
              {sub.selectedSport?.length > 0 && (
                <InfoRow
                  icon={<span className='text-[#B91C1C]'>🏈</span>}
                  label='Sport(s)'
                  value={sub.selectedSport.join(", ")}
                />
              )}
            </div>
          </div>

          {/* ── Cancel Section ─────────────────────── */}
          {isActive && (
            <div className='bg-white rounded-2xl shadow-sm border border-red-100 p-6'>
              <h4 className='font-semibold text-gray-800 mb-1'>
                Cancel Subscription
              </h4>
              <p className='text-sm text-gray-500 mb-4'>
                {isRecurring
                  ? "Cancelling will stop future renewals. You'll keep access until the current period ends."
                  : "Cancelling this sessional plan will revoke your remaining access."}
              </p>

              {!confirmCancel ? (
                <button
                  onClick={() => setConfirmCancel(true)}
                  className='flex items-center gap-2 px-5 py-2.5 border-2 border-red-200 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-50 transition'>
                  <MdOutlineCancel className='text-lg' /> Cancel Subscription
                </button>
              ) : (
                <div className='bg-red-50 border border-red-200 rounded-xl p-4'>
                  <p className='text-sm text-red-700 font-medium mb-4'>
                    Are you sure you want to cancel? This action cannot be
                    undone.
                  </p>
                  <div className='flex gap-3'>
                    <button
                      onClick={handleCancel}
                      disabled={cancelling}
                      className='px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition disabled:opacity-60'>
                      {cancelling ? "Cancelling..." : "Yes, Cancel"}
                    </button>
                    <button
                      onClick={() => setConfirmCancel(false)}
                      className='px-5 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition'>
                      Keep Subscription
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Resubscribe ────────────────────────── */}
          {!isActive && (
            <div className='text-center mt-6'>
              <Link
                href='/packages'
                className='inline-block bg-[#B91C1C] hover:bg-red-800 text-white font-semibold px-8 py-3 rounded-xl transition'>
                Browse Plans & Resubscribe
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className='flex items-start gap-2'>
      <span className='mt-0.5 text-sm'>{icon}</span>
      <div>
        <p className='text-gray-400 text-xs'>{label}</p>
        <p className='text-gray-800 font-semibold text-sm'>{value}</p>
      </div>
    </div>
  );
}
