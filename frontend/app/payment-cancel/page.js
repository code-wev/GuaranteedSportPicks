"use client";

import Link from "next/link";
import { FaTimesCircle } from "react-icons/fa";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <FaTimesCircle className="text-red-400 text-4xl" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
        <p className="text-gray-500 text-sm mb-8">
          Your payment was cancelled. No charges were made. You can try again anytime.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/packages"
            className="w-full bg-[#B91C1C] hover:bg-red-800 text-white font-semibold py-3 rounded-xl transition text-sm"
          >
            Try Again
          </Link>
          <Link
            href="/dashboard"
            className="w-full border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition text-sm"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
