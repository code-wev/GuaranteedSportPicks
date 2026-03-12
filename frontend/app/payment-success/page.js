"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <FaCheckCircle className="text-green-500 text-4xl" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 text-sm mb-2">
          Your subscription has been activated. Welcome aboard!
        </p>
        {sessionId && (
          <p className="text-xs text-gray-400 mb-6">
            Session: <span className="font-mono">{sessionId.slice(0, 24)}...</span>
          </p>
        )}
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard/my-subscription"
            className="w-full bg-[#B91C1C] hover:bg-red-800 text-white font-semibold py-3 rounded-xl transition text-sm"
          >
            View My Subscription
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

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500" /></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
