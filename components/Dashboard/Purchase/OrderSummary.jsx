"use client";

import { MdOutlinePayment } from "react-icons/md";

export default function OrderSummary() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm mb-8">
      <h2 className="text-base font-medium mb-4">Order Summary</h2>

      {/* Summary Rows */}
      <div className="text-sm text-gray-700 space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Package:</span>
          <span className="font-medium">Weekly Package</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Sport:</span>
          <span className="font-medium">NFL</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Payment Model:</span>
          <span className="font-medium">Prepaid</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-4"></div>

      {/* Total */}
      <div className="flex justify-between font-semibold text-[17px] mb-4">
        <span>Total</span>
        <span className="text-[#B91C1C]">$99.00</span>
      </div>

      {/* Payment Button */}
      <button
        className="
          w-full 
          bg-[#B91C1C] 
          hover:bg-red-800
          text-white 
          py-3 
          rounded-lg 
          font-medium
          text-sm
          flex items-center justify-center gap-2
        "
      >
        <MdOutlinePayment />
        Process to payment
      </button>
    </div>
  );
}
